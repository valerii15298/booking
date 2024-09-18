import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useRef } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseState } from "@/lib/types";
import { trpc } from "@/trpc";
import { type Types, zod } from "@/zod";

import { EditBooking } from "./EditBooking";

export function BookingDialog({
  open,
  setOpen,
  ...b
}: Types.Booking & UseState<boolean, "open">) {
  const ref = useRef<HTMLDivElement | null>(null);
  const utils = trpc.useUtils();
  const formId = useId();

  const deleteBooking = trpc.bookings.delete.useMutation({
    async onSettled() {
      return utils.assets.list.invalidate();
    },
  });

  const updateBooking = trpc.bookings.update.useMutation({
    async onSettled() {
      return utils.assets.list.invalidate();
    },
  });

  const form = useForm({
    values: b,
    disabled: updateBooking.isPending || deleteBooking.isPending,
    resolver: zodResolver(zod.booking),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    void form.handleSubmit((data, e) => {
      e?.preventDefault();
      void updateBooking.mutateAsync(data);
    })(e);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(open);
        }
      }}
    >
      <DialogContent ref={ref} className="w-fit max-w-fit">
        <DialogHeader>
          <DialogTitle>Booking #{b.id}</DialogTitle>
          <DialogDescription className="text-balance">
            Update booking data or delete booking entirely
          </DialogDescription>
        </DialogHeader>
        <EditBooking formId={formId} form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button
            disabled={form.formState.disabled}
            variant={"destructive"}
            onClick={() => {
              deleteBooking.mutate(b.id);
            }}
          >
            Delete
          </Button>
          <Button
            disabled={form.formState.disabled}
            form={formId}
            type="submit"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
