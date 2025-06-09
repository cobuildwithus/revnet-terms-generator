import { Badge } from "@/components/ui/badge";
import { RevnetStage } from "@/lib/schemas";

interface StageItemProps {
  stage: RevnetStage;
}

export function StageItem({ stage }: StageItemProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">
              {stage.id}
            </div>
            <span className="text-lg">Stage</span>
          </div>
          <Badge variant="secondary">
            {stage.stageDuration === 0 ? "Forever" : `${stage.stageDuration}d`}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted p-3 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground block mb-1">
              Token price
            </span>
            <p className="text-lg font-bold">{stage.initialPrice} ETH</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground block mb-1">
              Cut Rate
            </span>
            <p className="text-lg font-bold">
              {stage.cutPercentage}% every {stage.cutPeriod}d
            </p>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground block mb-1">
              Cash Out Tax
            </span>
            <p className="text-lg font-bold">
              {(stage.cashOutTax * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className=" text-sm rounded-lg">{stage.reasoning}</div>

        {stage.splits.length > 0 && (
          <div className="border-t pt-3">
            <span className="text-sm font-medium text-muted-foreground mb-2 block">
              Revenue Splits
            </span>
            <div className="space-y-2">
              {stage.splits.map((split) => (
                <div
                  key={split.id}
                  className="flex justify-between items-center text-sm bg-muted p-2 rounded border"
                >
                  <span className="font-medium">{split.percentage}%</span>
                  <span className="font-mono text-muted-foreground text-xs">
                    {split.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
