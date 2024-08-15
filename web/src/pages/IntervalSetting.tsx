import { useApp } from "@/app/useApp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Interval, IntervalMap } from "@/interval";

export function IntervalSetting() {
  const { dateDelimiter, setDateDelimiter } = useApp();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="capitalize" variant={"secondary"}>
          By {IntervalMap[dateDelimiter]?.toLowerCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(Interval).map(([key, value]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => {
              setDateDelimiter(value);
            }}
            className="capitalize"
          >
            By {key.toLowerCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
