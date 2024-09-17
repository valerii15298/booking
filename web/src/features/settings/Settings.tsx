import { GearIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";

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
  const { menuPosition } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  async function onAnimationEnd() {
    return new Promise((resolve) => {
      ref.current?.addEventListener("animationend", () => setTimeout(resolve), {
        once: true,
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`sticky z-10 w-full rounded-none p-0 ${menuPosition === "top" ? "top-0" : "bottom-0"}`}
        >
          <GearIcon className="h-full w-1/3" />
        </Button>
      </DialogTrigger>
      <DialogContent ref={ref} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="text-balance">
            Choose a preferred theme, date interval, zoom level, jump to date,
            and more
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-around gap-5">
          <ModeToggle />
          <IntervalSetting />
          <GoToCurrentDateSetting
            onGo={async () => {
              setOpen(false);
              await onAnimationEnd();
            }}
          />
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
