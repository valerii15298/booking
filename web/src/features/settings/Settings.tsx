import { GearIcon } from "@radix-ui/react-icons";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from "@/features/app/useApp";

import { DateItemHeightSetting } from "./DateItemHeightSetting";
import { GoToCurrentDateSetting } from "./GoToCurrentDateSetting";
import { IntervalSetting } from "./IntervalSetting";
import { JumpToDateSetting } from "./JumpToDateSetting";

export function Settings() {
  const { preload, menuPosition } = useApp();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) preload();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`sticky z-10 w-full rounded-none p-0 ${menuPosition === "top" ? "top-0" : "bottom-0"}`}
        >
          <GearIcon className="h-full w-1/3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Choose a preferred theme, date interval, zoom level, jump to date,
            and more
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          <ModeToggle />
          <IntervalSetting />
          <GoToCurrentDateSetting />
        </div>
        <JumpToDateSetting />

        <DateItemHeightSetting />
        <DialogFooter>
          <Button>Give Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
