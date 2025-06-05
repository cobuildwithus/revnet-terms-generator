"use client";

import { RevnetTerms } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { Analysis } from "../analyzer/analyze";
import { ChatPanel } from "./components/chat-panel";
import { TermsPanel } from "./components/terms-panel";

export default function ConfiguratorPage() {
  const [terms, setTerms] = useState<RevnetTerms>({ stages: [] });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("analysis");

    if (savedAnalysis && savedAnalysis !== "undefined") {
      setAnalysis(JSON.parse(savedAnalysis));
    }

    const savedTerms = localStorage.getItem("terms");

    if (savedTerms && savedTerms !== "undefined") {
      setTerms(JSON.parse(savedTerms));
    }

    setIsLoading(false);
  }, []);

  const updateTerms = (newTerms: RevnetTerms) => {
    setTerms(newTerms);
    localStorage.setItem("terms", JSON.stringify(newTerms));
  };

  return (
    <div className="h-[calc(100vh-var(--header-height))] flex flex-col bg-background ">
      <div className="flex-1 flex overflow-hidden border-t">
        <div className="w-1/2 border-r">
          <TermsPanel terms={terms} />
        </div>
        <div className="w-1/2">
          {analysis && <ChatPanel terms={terms} onTermsUpdate={updateTerms} analysis={analysis} />}
          {!analysis && (
            <div className="h-full flex flex-col items-center justify-center text-sm">
              {isLoading && "Loading..."}
              {!isLoading && "Missing project analysis! Go back to the homepage and start again."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
