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
import type { Types } from "@/zod";

export function CreateBooking({ id, name }: Types.Asset) {
  return (
    <Dialog key={id}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-none">{name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
          <DialogDescription>
            Book <b>{name}</b> for a specific date and time
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">Form placeholder</div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
