"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { analyzeProject } from "./analyze";

export function AnalyzeForm() {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const toastId = toast.loading("Analyzing. It can take a while...");
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeProject(description);
      if (analysis.error) throw new Error(analysis.error);

      localStorage.setItem("analysis", JSON.stringify(analysis));
      toast.success("Finished analysis. Redirecting...", { id: toastId });
      router.push("/configurator");
    } catch (error) {
      console.error("Error analyzing project:", error);
      toast.error("Error. Please try again.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
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
            {isAnalyzing ? "Analyzing your project..." : "Let's go!"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
