import { useApp } from "@/app/useApp";
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { IntervalSetting } from "./IntervalSetting";

export function Settings() {
  const { dateItemHeight, setDateItemHeight } = useApp();

  return (
    <Dialog>
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
            Choose a preferred theme, zoom level, date range, and more.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          <ModeToggle />
          <IntervalSetting />
        </div>
        <Label>Block Height</Label>
        <Slider
          value={[dateItemHeight]}
          onValueChange={([newValue]) => {
            if (newValue) setDateItemHeight(newValue);
          }}
          min={25}
          step={1}
          max={100}
        />
        <DialogFooter>
          <Button>Give Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
