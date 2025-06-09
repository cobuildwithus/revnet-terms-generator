"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appendToChat, setChatMetadata, type ChatMessage } from "@/lib/kv";
import { newChatId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { analyzeProject } from "./analyze";

export function AnalyzeForm() {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [buttonText, setButtonText] = useState("Let's go!");
  const router = useRouter();

  useEffect(() => {
    if (!isAnalyzing) return;

    const loadingMessages = [
      "Searching the web...",
      "Doing market research...",
      "Analyzing economics...",
      "Studying tokenomics models...",
      "Evaluating project goals...",
      "Reviewing best practices...",
      "Calculating optimal parameters...",
      "Finalizing recommendations...",
    ];

    let messageIndex = 0;
    let timeoutId: NodeJS.Timeout;
    setButtonText(loadingMessages[0]);

    const rotateMessage = () => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setButtonText(loadingMessages[messageIndex]);

      // Random interval between 1.5 and 3.5 seconds
      const randomDelay = Math.random() * 2000 + 1500;
      timeoutId = setTimeout(rotateMessage, randomDelay);
    };

    // Start with a random delay for the first change
    timeoutId = setTimeout(rotateMessage, Math.random() * 2000 + 1500);

    return () => clearTimeout(timeoutId);
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const toastId = toast.loading("Analyzing. It can take a while...");
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeProject(description);
      if (analysis.error) throw new Error(analysis.error);

      // Generate a new chat ID
      const chatId = newChatId();

      // Store chat metadata in KV
      await setChatMetadata(chatId, {
        analysis,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Save the initial assistant message if it exists
      if (analysis.initialMessage) {
        const initialMessage: ChatMessage = {
          id: "init",
          role: "assistant",
          content: analysis.initialMessage,
        };
        await appendToChat(chatId, initialMessage);
      }

      toast.success("Finished analysis. Redirecting...", { id: toastId });
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error analyzing project:", error);
      toast.error("Error. Please try again.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
      setButtonText("Let's go!");
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="description">Describe your project</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project goals, target audience, tokenomics preferences, and any specific requirements. The more details you provide, the better we can configure your revnet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[140px] resize-none field-sizing-content leading-7"
              disabled={isAnalyzing}
            />
          </div>

          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={!description.trim() || isAnalyzing}
          >
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
