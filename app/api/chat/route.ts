import { Analysis } from "@/app/analyzer/analyze";
import { aboutRevnetPrompt } from "@/app/analyzer/prompt";
import { revnetTermsSchema } from "@/lib/schemas";
import { appendToChat, type ChatMessage } from "@/lib/kv";
import { newChatId } from "@/lib/utils";
import { createOpenAI, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { streamText, tool } from "ai";

export const maxDuration = 30;

const openai = createOpenAI({ compatibility: "strict" });

function buildSystemPrompt(analysis: Analysis, terms: any) {
  return `You're in conversation with user whom are you helping with their revnet terms.
        
## Data
This is how user described their project:
${analysis.userDescription}

This is your analysis of the project:
${analysis.summary}

This is list of questions that needs to be answered by the user:
${analysis.questions.join("\n")}

Current terms: ${JSON.stringify(terms, null, 2)}

## Your job

Your job is first to ask user questions from the list until you have all the required information.

Be straight forward and concise. Ask questions one by one. Ask follow up questions if needed.

Do not give user the impression that you have a list of questions and you just go one-by-one. Try to make this process looks natural, like normal conversation.

Feel free to skip some questions if - based on existing answers - you think they aren't relevant anymore or you already have enough information.

Once you have fully understand the project, do generate a revnet terms.

If you generate it, call "updateTerms" tool with terms as an argument - this will show the new terms to the user in the UI.

User may ask you questions about the terms or request changes.

If user requests changes, make changes in terms and just call again "updateTerms" tool to update the terms in the UI.

User see current terms in the chat, every time you update the terms, user will see the updated values.`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages, terms, chatId: rawId } = data;

    const analysis: Analysis = data.analysis;
    if (!analysis || !analysis.summary) {
      throw new Error("Incorrect input params");
    }

    // Generate or use existing chat ID
    const chatId = rawId || newChatId();

    // Save the user's message if present
    if (messages && messages.length > 0) {
      const lastUserMsg = messages[messages.length - 1] as ChatMessage;
      if (lastUserMsg.role === "user") {
        await appendToChat(chatId, lastUserMsg);
      }
    }

    const result = streamText({
      model: openai.responses("o4-mini"),
      messages: [
        { role: "system", content: aboutRevnetPrompt },
        { role: "system", content: buildSystemPrompt(analysis, terms) },
        ...messages,
      ],
      tools: {
        updateTerms: tool({
          description: "Update the revnet terms",
          parameters: revnetTermsSchema,
          execute: async (terms) => terms,
        }),
      },
      providerOptions: {
        openai: {
          reasoningEffort: "high",
          reasoningSummary: "auto",
        } satisfies OpenAIResponsesProviderOptions,
      },
      toolCallStreaming: true,
      onFinish: async ({ text, toolCalls }) => {
        // Determine what content to save
        let contentToSave = text?.trim() || "";

        // If only tool calls, create a descriptive message
        if (!contentToSave && toolCalls?.length) {
          const hasUpdateTerms = toolCalls.some(
            (tc) => tc.toolName === "updateTerms"
          );
          if (hasUpdateTerms) {
            contentToSave = "Terms updated!";
          }
        }

        // Save assistant's response if there's content
        if (contentToSave) {
          const assistantMessage: ChatMessage = {
            id: `${chatId}-${Date.now()}`,
            role: "assistant",
            content: contentToSave,
          };
          await appendToChat(chatId, assistantMessage);
        }
      },
    });

    // Return response with chat ID in headers
    return result.toDataStreamResponse({
      sendReasoning: true,
      headers: {
        "x-chat-id": chatId,
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
