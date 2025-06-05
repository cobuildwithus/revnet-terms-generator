"use client";

import { Analysis } from "@/app/analyzer/analyze";
import { Button } from "@/components/ui/button";
import { ChatContainerContent, ChatContainerRoot } from "@/components/ui/chat-container";
import { Loader } from "@/components/ui/loader";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ScrollButton } from "@/components/ui/scroll-button";
import { RevnetTerms } from "@/lib/schemas";
import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import AIAvatar from "../avatar.png";
import { ChatMessage } from "./chat-message";

interface ChatPanelProps {
  terms: RevnetTerms;
  onTermsUpdate: (terms: RevnetTerms) => void;
  analysis: Analysis;
}

export function ChatPanel(props: ChatPanelProps) {
  const { terms, onTermsUpdate, analysis } = props;

  const { messages, input, setInput, handleSubmit, status } = useChat({
    api: "/api/chat",
    initialMessages: analysis.initialMessage
      ? [{ id: "init", role: "assistant", content: analysis.initialMessage }]
      : [],
    body: { terms, analysis },
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "updateTerms") {
        onTermsUpdate(toolCall.args as RevnetTerms);
      }
    },
    onError(error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b shrink-0">
        <div className="flex items-center space-x-3">
          <Image
            src={AIAvatar}
            alt="AI Assistant"
            width={40}
            height={40}
            className="rounded-full object-cover size-10 aspect-square"
          />
          <div>
            <h2 className="text-xl font-bold">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Ask questions and modify your terms</p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto">
        <ChatContainerRoot className="flex-1 relative h-full">
          <ChatContainerContent className="p-6 space-y-6">
            {messages.map((message, i) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={status === "streaming" && i === messages.length - 1}
              />
            ))}
          </ChatContainerContent>
          <div className="absolute right-4 bottom-4">
            <ScrollButton className="shadow-sm" />
          </div>
        </ChatContainerRoot>
      </div>

      <div className="p-6 border-t shrink-0">
        <PromptInput
          value={input}
          onValueChange={(value) => setInput(value)}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full bg-card"
        >
          <PromptInputTextarea
            className="text-foreground"
            placeholder="Ask about your terms or request changes..."
          />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction tooltip={status === "streaming" ? "Please wait..." : "Send message"}>
              <Button
                variant="default"
                size="icon"
                className="size-8 rounded-full"
                type="submit"
                disabled={status === "streaming" || !input.trim()}
                onClick={handleSubmit}
              >
                {status === "streaming" ? (
                  <Loader variant="dots" size="sm" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
