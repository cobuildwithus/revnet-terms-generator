"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Markdown } from "./markdown";
import { useTextStream, type Mode } from "./response-stream";

export type ReasoningProps = {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Reasoning({ children, className, open, onOpenChange }: ReasoningProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className={className}>
      {children}
    </Collapsible>
  );
}

export type ReasoningTriggerProps = {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof CollapsibleTrigger>;

function ReasoningTriggerComponent({ children, className, ...props }: ReasoningTriggerProps) {
  return (
    <CollapsibleTrigger asChild {...props}>
      <button className={cn("flex cursor-pointer items-center gap-2 group", className)}>
        <span className="text-primary">{children}</span>
        <div className="transform transition-transform group-data-[state=open]:rotate-180">
          <ChevronDownIcon className="size-4" />
        </div>
      </button>
    </CollapsibleTrigger>
  );
}

export type ReasoningContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof CollapsibleContent>;

function ReasoningContentComponent({ children, className, ...props }: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "overflow-hidden data-[state=closed]:animate-[collapsible-up_200ms_ease-out] data-[state=open]:animate-[collapsible-down_200ms_ease-out]",
        className
      )}
      {...props}
    >
      <div className="pb-1">{children}</div>
    </CollapsibleContent>
  );
}

export type ReasoningResponseProps = {
  text: string | AsyncIterable<string>;
  className?: string;
  speed?: number;
  mode?: Mode;
  onComplete?: () => void;
  fadeDuration?: number;
  segmentDelay?: number;
  characterChunkSize?: number;
};

function ReasoningResponse({
  text,
  className,
  speed = 20,
  mode = "typewriter",
  onComplete,
  fadeDuration,
  segmentDelay,
  characterChunkSize,
}: ReasoningResponseProps) {
  const { displayedText } = useTextStream({
    textStream: text,
    speed,
    mode,
    onComplete,
    fadeDuration,
    segmentDelay,
    characterChunkSize,
  });

  return (
    <div
      className={cn("text-muted-foreground prose prose-sm dark:prose-invert text-sm", className)}
    >
      <Markdown>{displayedText}</Markdown>
    </div>
  );
}

export const ReasoningTrigger = ReasoningTriggerComponent;
export const ReasoningContent = ReasoningContentComponent;
export { Reasoning, ReasoningResponse };
