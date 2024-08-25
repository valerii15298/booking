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

  const isBreakpoint = dateDelimiter.isBreakpoint(date);
  const dateBreakpoint =
    (isBreakpoint || first) && dateDelimiter.breakpoint(date);

  const top =
    menuPosition === "top" ? 56 - dateItemHeight : 20 - dateItemHeight;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <li
          className={`flex flex-col items-end justify-end overflow-hidden border-b bg-background px-2 ${dateBreakpoint ? "sticky" : ""}`}
          style={{ height: dateItemHeight, top }}
        >
          {dateBreakpoint}
          {!dateBreakpoint && dateDelimiter.item(date)}
        </li>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="w-24" side="right">
          {date.toLocaleString()}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
