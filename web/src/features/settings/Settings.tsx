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
import { IntervalSetting } from "./IntervalSetting";

export function Settings() {
  const { preload } = useApp();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) preload();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="sticky top-0 w-full rounded-none"
        >
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Choose a preferred theme, zoom level, jump to date, and more.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          <ModeToggle />
          <IntervalSetting />
        </div>
        <DateItemHeightSetting />
        <DialogFooter>
          <Button>Give Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
