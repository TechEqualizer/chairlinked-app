
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SiteLifecycleStage, LIFECYCLE_STAGE_CONFIG } from "@/types/siteLifecycle";
import { CircleCheck, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface SiteLifecycleProgressBarProps {
  siteId: string;
  currentStage: SiteLifecycleStage;
  isAdmin?: boolean;
  onStageChange: (targetStage: SiteLifecycleStage) => void;
  disabled?: boolean;
}

const STAGE_FLOW: SiteLifecycleStage[] = [
  "draft",
  "ready_to_share",
  "shared",
  "claimed",
  "converting",
  "customer_controlled",
  "live_published",
];

export const SiteLifecycleProgressBar: React.FC<SiteLifecycleProgressBarProps> = ({
  siteId,
  currentStage,
  isAdmin = false,
  onStageChange,
  disabled = false,
}) => {
  // Find current stage index
  const currIdx = Math.max(STAGE_FLOW.indexOf(currentStage), 0);

  // Calculate legal next stages:
  const legalForward: SiteLifecycleStage[] = useMemo(() => {
    switch (currentStage) {
      case "draft": return ["ready_to_share"];
      case "ready_to_share": return ["shared"];
      case "shared": return ["claimed"];
      case "claimed": return ["converting"];
      case "converting": return ["customer_controlled", "claimed"];
      case "customer_controlled": return ["live_published"];
      default: return [];
    }
  }, [currentStage]);

  // Show the next legal stage as CTA
  const nextStage: SiteLifecycleStage | undefined = legalForward.length > 0 ? legalForward[0] : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center gap-2">
        {STAGE_FLOW.map((stage, i) => {
          const config = LIFECYCLE_STAGE_CONFIG[stage];
          const isReached = i <= currIdx;
          const isCurrent = i === currIdx;
          const isClickable = isAdmin || (legalForward.includes(stage) && !isCurrent);

          return (
            <React.Fragment key={stage}>
              <Button
                size="sm"
                variant={isCurrent ? "default" : isReached ? "secondary" : "ghost"}
                className={clsx(
                  "flex flex-col items-center px-2 py-1 min-w-[90px] group rounded transition-all duration-200",
                  isClickable
                    ? "hover:border-purple-400 hover:bg-indigo-50 cursor-pointer"
                    : "opacity-60 cursor-default",
                  isCurrent && "ring-2 ring-sky-400 border border-sky-300"
                )}
                // Ensure type is correct
                onClick={() => isClickable && !disabled && onStageChange(stage)}
                disabled={!isClickable || disabled}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="flex items-center gap-1">
                  <span className="">{config.icon}</span>
                  <span className="font-semibold">{config.label}</span>
                </div>
                <span className="text-xs mt-1 text-slate-500 opacity-80">{config.description}</span>
              </Button>
              {i < STAGE_FLOW.length - 1 && (
                <ChevronRight className={clsx(
                  "w-4 h-4 text-slate-300",
                  i < currIdx ? "text-green-400" : ""
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {nextStage && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="bg-sky-600 hover:bg-sky-700 text-white shadow rounded px-3"
            onClick={() => !disabled && onStageChange(nextStage)}
            disabled={disabled}
          >
            <CircleCheck className="w-4 h-4 mr-2" />
            Move to: {LIFECYCLE_STAGE_CONFIG[nextStage].label}
          </Button>
          <span className="text-xs text-slate-400 pt-2">
            (Next step in workflow)
          </span>
        </div>
      )}
    </div>
  );
};
export default SiteLifecycleProgressBar;
