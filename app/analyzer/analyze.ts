"use server";

import { createOpenAI, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { aboutRevnetPrompt } from "./prompt";

const openai = createOpenAI({ compatibility: "strict" });

export type Analysis = {
  userDescription: string;
  summary: string;
  questions: string[];
  initialMessage: string;
  error: string | null;
};

export async function analyzeProject(
  userDescription: string
): Promise<Analysis> {
  try {
    const { text, usage, providerMetadata } = await generateText({
      model: openai("o4-mini"),
      system: aboutRevnetPrompt,
      prompt: `
      Here is the project's description from the user:
      ${userDescription}
      
      Ultimately, you will help the user design their revnet terms. But first, you must become their trusted strategic partner. 
      Your goal is to arrive at a crisp snapshot of their project and collect only the *must-know* facts that will inform revnet parameters.

      **RESEARCH WORKFLOW**

      **1. Web pass 1 – name & tagline**
      • Search the project's name plus "homepage", "whitepaper", or GitHub.
      • Capture: one-sentence mission, product category, earliest public date.

      **2. Web pass 2 – business model & market**
      • Search the project name + ("pricing" OR "business model" OR "how it works" OR "features").
      • Search the project name + ("target market" OR "customers" OR "use cases").
      • Capture: what they sell (product/service details), pricing structure, target customers
      • Capture: Market size.

      **3. Web pass 3 – revenue intelligence**
      • Search the project name + ("revenue model" OR "monetization" OR "pricing tiers" OR "subscription").
      • Search broader market terms + ("market size" OR "growth rate" OR "trends").
      • Capture: revenue streams (one-time vs recurring), price points, payment frequency, market dynamics.

      **4. Web pass 4 – traction & comparables**
      • Search the project name + ("funding" OR "revenue" OR "users" OR "ARR" OR "MRR" OR "growth").
      • Identify up to three projects in the *same* space that already sell similar products/services.
      • Note: verified metrics (with year), competitor pricing models, market patterns.

      **SYNTHESIS: Project Vitals Analysis (≤200 words)**
      
      Create a concise "Project Vitals" analysis that shows you understand their business deeply:
      
      - **Project Summary**: One-sentence description + core value proposition
      - **Product/Service**: What exactly they sell and how it's delivered
      - **Revenue Model**: Specific revenue streams, pricing structure, and payment patterns
      - **Target Market**: Who buys this, market size, and growth potential
      - **Money Flow**: How revenue arrives (frequency, size, seasonality) based on their model
      - **Key Stakeholders**: Who must be rewarded automatically (builders, early adopters, partners, customers)
      - **Traction Signals**: Any verified numbers (users, revenue, funding) with year
      - **Comparables**: Similar projects using tokens/crowdfunding and their patterns
      - **Why Revnet**: How a revnet could align these parties better than status-quo

      Cite all your sources. Do not under any circumstances make up any information.

      **GENERATE ASSUMPTIONS**
      
      Based on your research, generate a list of assumptions you made about the project.
      
      - Wrap your assumptions in <assumptions> tags
      - Total assumptions ≤10
      - Each assumption should be a single sentence

      **GENERATE QUESTIONS (12 max)**
      
      Based on your research and your assumptions, select the *smallest* set of questions that remain unanswered AND are critical for designing the revnet parameters. Choose from this menu, adapting the phrasing to reference specific findings from your research:

      • **Timeline**: "When do you expect meaningful revenue to start: immediately, within 6 months, or later?"
      • **Revenue pattern**: "Based on your [specific product/service], will income arrive as big one-off drops, steady monthly fees, or a mix?"
      • **Customer behavior**: "In your [market/industry], do customers typically make one-time purchases or stick around for recurring payments?"
      • **Urgency vs. openness**: "Do you prefer an early-bird rush that rewards first movers, or a calmer curve that stays welcoming for newcomers?"
      • **Team runway**: "Roughly how many months of operating budget should the revnet route to the core team?"
      • **Holder liquidity**: "Should token holders feel free to cash out any time, or be nudged to hold for at least a few months?"
      • **Key beneficiaries**: "Besides the core team, who *must* automatically receive tokens or value?"
      • **Risk tolerance**: "Would a sharp price jump every few months excite your audience, or scare them off?"
      • **Success vision**: "What does wild success look like for [project name] three years from now?"
      • **Community evolution**: "How do you see the community's role evolving - will you always lead, or should they gradually take more control?"

      Make each question personal by referencing something specific you discovered about their business model or market. Questions should feel like a strategic consultation from someone who understands their industry.

      ## Response Format
      - Wrap your Project Vitals analysis in <analysis> tags (≤200 words)
      - Wrap each question in <question> tags
      - Wrap your sources in <sources> tags
      - Total response ≤300 words
      `,
      providerOptions: {
        openai: {
          parallelToolCalls: true,
          reasoningEffort: "high",
        } satisfies OpenAIResponsesProviderOptions,
      },
      tools: {
        web_search_preview: openai.tools.webSearchPreview({
          searchContextSize: "high",
        }),
      },
    });

    console.debug("Usage:", {
      ...usage,
      reasoningTokens: providerMetadata?.openai?.reasoningTokens,
    });

    console.debug("Text:", text);

    if (!text) throw new Error("No analysis generated");

    const { object } = await generateObject({
      model: openai.responses("gpt-4.1-2025-04-14"),
      system: `You'll be getting the text with a structured "Project Vitals" analysis and a list of strategic questions.

      - The Project Vitals analysis will be wrapped in <analysis> tags and contains: Project Summary, Product/Service, Revenue Model, Target Market, Money Flow, Key Stakeholders, Traction Signals, Comparables, and Why Revnet.
      - List of questions will be wrapped in <question> tags.

      Your job is to extract the analysis and questions from the text and return them in the structured format.

      Do not analyze or modify questions or analysis. Just extract them as-is.

      Then prepare the initial message to the user that will be shown to the user first.
      
      The initial message should:
      - Be warm and personalized based on what was discovered about their project
      - Reference specific details about their business model or market from the research
      - Transition naturally to the first question
      - Feel like the start of a strategic consultation from someone who understands their industry
      
      Example: "I've been exploring [Project Name] and I'm impressed by [specific detail about their product/market]. Your [revenue model detail] approach in the [market] space is interesting. To help design the perfect revnet structure for your vision, I'd love to understand: [first question]"
      `,
      prompt: text,
      schema: z.object({
        summary: z.string(),
        questions: z.array(z.string()),
        initialMessage: z.string(),
      }),
    });

    console.debug("Object:", object);

    return { ...object, error: null, userDescription };
  } catch (error) {
    console.error("Error analyzing project", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to analyze project",
      summary: "",
      questions: [],
      initialMessage: "",
      userDescription,
    };
  }
}
