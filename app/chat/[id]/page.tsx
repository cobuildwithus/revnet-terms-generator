"use client";

import { RevnetTerms } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { Analysis } from "@/app/analyzer/analyze";
import { ChatPanel } from "@/app/components/chat-panel";
import { TermsPanel } from "@/app/components/terms-panel";
import {
  getTranscript,
  getChatMetadata,
  updateChatTerms,
  type ChatMessage,
} from "@/lib/kv";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [terms, setTerms] = useState<RevnetTerms>({ stages: [] });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const router = useRouter();

  // Unwrap params using React's use hook
  const { id } = use(params);

  useEffect(() => {
    const loadData = async () => {
      setChatId(id);

      try {
        // Load chat metadata (analysis, terms)
        const metadata = await getChatMetadata(id);

        // Load existing chat messages
        const messages = await getTranscript(id);

        if (!metadata && messages.length === 0) {
          // Chat doesn't exist
          toast.error("Chat not found");
          router.push("/");
          return;
        }

        // Load analysis and terms from metadata
        if (metadata) {
          setAnalysis(metadata.analysis);
          if (metadata.terms) {
            setTerms(metadata.terms);
          }
        } else {
          // Create minimal analysis for legacy chats
          setAnalysis({
            summary: "Loaded from existing chat",
            questions: [],
            userDescription: "Continuing previous conversation",
            initialMessage:
              "Welcome back! You can continue working on your revnet terms.",
            error: null,
          });
        }

        // Load messages
        if (messages && messages.length > 0) {
          // Convert stored messages to the format expected by useChat
          const formattedMessages = messages.map((msg: ChatMessage) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }));

          setInitialMessages(formattedMessages);

          // If no terms in metadata, try to extract from messages
          if (!metadata?.terms) {
            const termsFromChat = extractTermsFromMessages(messages);
            if (termsFromChat) {
              setTerms(termsFromChat);
            }
          }
        } else if (metadata?.analysis.initialMessage) {
          // New chat with initial message
          setInitialMessages([
            {
              id: "init",
              role: "assistant",
              content: metadata.analysis.initialMessage,
            },
          ]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading chat:", error);
        toast.error("Failed to load chat");
        router.push("/");
      }
    };

    loadData();
  }, [id, router]);

  const updateTerms = async (newTerms: RevnetTerms) => {
    setTerms(newTerms);
    // Update terms in KV metadata
    await updateChatTerms(id, newTerms);
  };

  // Helper function to extract terms from messages
  const extractTermsFromMessages = (
    messages: ChatMessage[]
  ): RevnetTerms | null => {
    // Look through messages for tool calls that updated terms
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.content.includes("updateTerms")) {
        try {
          // This is a simplified extraction - adjust based on your actual message format
          const termsMatch = msg.content.match(/updateTerms.*?({[\s\S]*?})/);
          if (termsMatch) {
            return JSON.parse(termsMatch[1]);
          }
        } catch (e) {
          console.error("Failed to parse terms from message:", e);
        }
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Missing project analysis! Go back to the homepage and start again.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:underline"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-var(--header-height))] flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden border-t">
        <div className="w-1/2 border-r">
          <TermsPanel terms={terms} />
        </div>
        <div className="w-1/2">
          <ChatPanel
            key={chatId} // Force remount when switching chats
            chatId={id}
            terms={terms}
            onTermsUpdate={updateTerms}
            analysis={analysis}
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </div>
  );
}
