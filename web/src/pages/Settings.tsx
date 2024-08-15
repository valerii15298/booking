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

export function Settings() {
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
        <ModeToggle />
        <DialogFooter>
          <Button>Give Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
