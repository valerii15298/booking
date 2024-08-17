import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { dateFromISO, formatDateTime } from "@/atoms/dates";
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
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc";
import { type Types, zod } from "@/zod";

const routeApi = getRouteApi("/");
export function CreateBooking({ id, name }: Types.Asset) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const navigate = routeApi.useNavigate();
  const createBooking = trpc.bookings.create.useMutation({
    async onSuccess() {
      return utils.assets.list.invalidate();
    },
  });
  const form = useForm({
    defaultValues: {
      from: new Date(),
      to: new Date(),
      assetId: id,
    },
    disabled: createBooking.isPending,
    resolver: zodResolver(zod.bookingInput),
  });

  const formId = useId();
  return (
    <Dialog open={open} onOpenChange={setOpen} key={id}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="sticky top-0 z-10 w-full rounded-none"
        >
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-full overflow-x-auto">
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
          <DialogDescription className="text-balance">
            Book <b>{name}</b> for a specific date and time
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            onSubmit={(e) => {
              void form.handleSubmit((data, e) => {
                setOpen(false);
                e?.preventDefault();

                // TODO go back to current position in case of an error and setOpen back to true(test with disabled network)
                void navigate({
                  search: { date: dateFromISO(data.from.toISOString()) },
                });

                void createBooking.mutateAsync(data);
              })(e);
            }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
          >
            <input type="text" className="hidden" />
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <Input
                  type="datetime-local"
                  className="w-fit"
                  {...field}
                  value={formatDateTime(field.value)}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              )}
            />
            <span className="hidden whitespace-nowrap sm:inline">{"->"}</span>
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <Input
                  className="w-fit"
                  type="datetime-local"
                  {...field}
                  value={formatDateTime(field.value)}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value));
                  }}
                />
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={form.formState.disabled}
            form={formId}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
