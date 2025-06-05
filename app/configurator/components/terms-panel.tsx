"use client";

import { Badge } from "@/components/ui/badge";
import { RevnetTerms } from "@/lib/schemas";
import { StageItem } from "./stage-item";

interface Props {
  terms: RevnetTerms;
}

export function TermsPanel(props: Props) {
  const { terms } = props;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Revnet Terms</h2>
          <Badge variant="outline">
            {terms.stages.length} {terms.stages.length === 1 ? "Stage" : "Stages"}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {terms.stages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
            <h3 className="text-xl font-semibold mb-1">No terms yet</h3>
            <p className="max-w-md">Your terms will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {terms.stages.map((stage) => (
              <StageItem key={stage.id} stage={stage} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
