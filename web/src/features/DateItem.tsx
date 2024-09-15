import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApp } from "@/features/app/useApp";

export function DateItem({
  date,
  first = false,
}: {
  date: Date;
  first?: boolean;
}) {
  const { dateItemHeight, menuPosition, dateDelimiter } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const isBreakpoint = dateDelimiter.isBreakpoint(date);
  const dateBreakpoint =
    (isBreakpoint || first) && dateDelimiter.breakpoint(date);

  const top =
    menuPosition === "top" ? 56 - dateItemHeight : 20 - dateItemHeight;

  const [dateLocal, timeLocal] = date.toLocaleString().split(", ", 2);
  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <li
          onClick={() => {
            setTooltipOpen(true);
          }}
          className={`flex flex-col items-end justify-end overflow-hidden border-y-[0.5px] bg-background px-2 ${dateBreakpoint ? "sticky" : ""}`}
          style={{
            height: dateItemHeight,
            top: dateBreakpoint ? top : undefined,
          }}
        >
          {dateBreakpoint}
          {!dateBreakpoint && dateDelimiter.item(date)}
        </li>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          style={{ height: dateItemHeight }}
          className="grid place-items-center py-0"
          side="right"
        >
          {dateLocal}, {dateItemHeight > 35 ? <br /> : null} {timeLocal}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
