import { z } from "zod";

export const revnetStageSchema = z.object({
  id: z
    .number()
    .describe(
      "Number of the stage. Start with 1 and increment by 1 for each stage"
    ),
  initialPrice: z.number().describe("Price in ETH for 1 token"),
  cutPercentage: z
    .number()
    .describe(
      "The percentage (0-100) by which tokens per ETH decreases each period"
    ),
  cutPeriod: z.number().describe("The number of days between each cut"),
  stageDuration: z.number().describe("The number of days this stage lasts"),
  splits: z
    .array(
      z.object({
        id: z.string(),
        percentage: z.number().describe("The percentage (0-100) of the split"),
        name: z.string().describe("The name of the party receiving the split"),
      })
    )
    .describe("The splits for this stage revenue sharing"),
  cashOutTax: z.number().describe("The tax rate for cashing out tokens (0-1)"),
  reasoning: z.string().describe(
    `The reasoning of the paramaters for this stage. In simple and natural language, easy to understand for humans.
      The last stage goes on forever, so the duration doesn't matter.`
  ),
});

export const revnetTermsSchema = z.object({
  stages: z.array(revnetStageSchema),
});

export type RevnetTerms = z.infer<typeof revnetTermsSchema>;
export type RevnetStage = z.infer<typeof revnetStageSchema>;
export type Split = z.infer<typeof revnetStageSchema.shape.splits>;
