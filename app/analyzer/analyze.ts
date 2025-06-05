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

export async function analyzeProject(userDescription: string): Promise<Analysis> {
  try {
    const { text, usage, providerMetadata } = await generateText({
      model: openai("o4-mini"),
      system: aboutRevnetPrompt,
      prompt: `
      Here is the project's description from the user:
      ${userDescription}.
      
      Ultimately you'll be helping the user to create a revnet terms, but first you need to understand their project better.

      Do your research about the project. You should search the web for more details and context.
      
      Take your time and prepare analysis of the project and how it can benefit from revnet implementation.
      
      Once you have understanding of the project, generate a list of required questions to ask to the user.
      
      Each question should be short, direct & specific.

      Questions should be prepared in a way that answers will help you to generate a revnet terms. 

      Do not ask too many questions, just really needed ones.

      Do not ask direct questions about exact terms values (example: "what should be the price of the token?").  
      
      Questions should be about project's goals, target audience, etc - stuff that will later help AI generate a proposed revnet terms.

      Summary:
      - Analyze & research the project and return analysis summary in response. Analysis shouldn't mention that more answers/info are needed, etc. Just summarize what you know/found.
      - Generate a list of questions to ask to the user

      ## Response
      - Wrap your analysis summary in <analysis> tags
      - Wrap your questions in <question> tags
      `,
      providerOptions: {
        openai: {
          parallelToolCalls: true,
          reasoningEffort: "high",
        } satisfies OpenAIResponsesProviderOptions,
      },
      tools: {
        web_search_preview: openai.tools.webSearchPreview({ searchContextSize: "high" }),
      },
    });

    console.debug("Usage:", {
      ...usage,
      reasoningTokens: providerMetadata?.openai?.reasoningTokens,
    });

    if (!text) throw new Error("No analysis generated");

    const { object } = await generateObject({
      model: openai("gpt-4-turbo"),
      system: `You'll be getting the text with analysis summary and list of questions.

      - Analysis summary will be wrapped in <analysis> tags.
      - List of questions will be wrapped in <question> tags.

      Your job is to extract analysis summary and list of questions from the text and return them in the structured format.

      Do not analyze or modify questions or analysis summary. Just extract them.

      Then prepare the initial message to the user that will be shown to the user first.
      
      It should be short message informing them that you finished project analysis and need to ask them some questions - then include the 1st question from the list.
      `,
      prompt: text,
      schema: z.object({
        summary: z.string(),
        questions: z.array(z.string()),
        initialMessage: z.string(),
      }),
    });

    return { ...object, error: null, userDescription };
  } catch (error) {
    console.error("Error analyzing project", error);
    return {
      error: error instanceof Error ? error.message : "Failed to analyze project",
      summary: "",
      questions: [],
      initialMessage: "",
      userDescription,
    };
  }
}
