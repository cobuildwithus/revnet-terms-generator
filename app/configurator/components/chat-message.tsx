"use client";

import { Loader } from "@/components/ui/loader";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningResponse,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { UIMessage } from "ai";
import { Avatar } from "connectkit";
import { useAccount } from "wagmi";
import AIAvatar from "../avatar.png";

interface Props {
  message: UIMessage;
  isStreaming: boolean;
}

export function ChatMessage({ message, isStreaming }: Props) {
  const { address } = useAccount();

  const textParts = message.parts?.filter((part) => part.type === "text") || [];
  const reasoningParts = message.parts?.filter((part) => part.type === "reasoning") || [];
  const toolParts = message.parts?.filter((part) => part.type === "tool-invocation") || [];

  const hasEmptyContent = isStreaming && (!message.content || message.content.trim() === "");
  const hasNoParts = !message.parts || message.parts.length === 0;

  return (
    <Message className={message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}>
      {message.role !== "user" && <MessageAvatar src={AIAvatar.src} alt="AI Assistant" />}
      {message.role === "user" && <Avatar address={address} size={32} />}

      <div className="flex flex-col gap-1">
        {hasEmptyContent ? (
          <MessageContent>
            <Loader variant="typing" size="md" />
          </MessageContent>
        ) : (
          <>
            {hasNoParts && message.content ? (
              <MessageContent markdown>{message.content}</MessageContent>
            ) : (
              <>
                {textParts.map((part, i) => (
                  <MessageContent key={`text-${i}`} markdown>
                    {part.text}
                  </MessageContent>
                ))}

                {toolParts.map((part) => {
                  const toolInvocation = part.toolInvocation;
                  const toolCallId = toolInvocation.toolCallId;

                  switch (part.toolInvocation.state) {
                    case "partial-call":
                    case "call":
                      return (
                        <MessageContent key={`tool-${toolCallId}`}>
                          Updating terms...
                        </MessageContent>
                      );
                    case "result":
                      return (
                        <MessageContent key={`tool-${toolCallId}`}>Terms updated!</MessageContent>
                      );
                  }
                })}

                {reasoningParts.map((part, i) => {
                  const reasoningText =
                    part.details
                      ?.map((detail: any) => (detail.type === "text" ? detail.text : ""))
                      .filter(Boolean)
                      .join("\n") || "";

                  return (
                    <Reasoning key={`reasoning-${i}`} className="mt-2">
                      <ReasoningTrigger className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Show reasoning
                      </ReasoningTrigger>
                      <ReasoningContent className="mt-2 pl-4 border-l-2 border-muted">
                        <ReasoningResponse
                          text={reasoningText}
                          className="text-xs"
                          speed={40}
                          mode="typewriter"
                        />
                      </ReasoningContent>
                    </Reasoning>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </Message>
  );
}
