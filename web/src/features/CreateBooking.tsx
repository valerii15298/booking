import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useId } from "react";
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
import type { UseState } from "@/lib/types";
import { trpc } from "@/trpc";
import { type Types, zod } from "@/zod";

import { useApp } from "./app/useApp";

const currDate = new Date();

const routeApi = getRouteApi("/");
export function CreateBooking({
  id,
  name,
  initialDate,
  setInitialDate,
}: Types.Asset & UseState<Date | null, "initialDate">) {
  const { dateDelimiter, scrollableContainerRef, yToDate } = useApp();
  const navigate = routeApi.useNavigate();

  const open = Boolean(initialDate);
  const from = initialDate ?? currDate;

  const utils = trpc.useUtils();
  const createBooking = trpc.bookings.create.useMutation({
    async onSuccess(_, { from, to }) {
      if (!scrollableContainerRef.current) return;
      setInitialDate(null);
      const diff = to.getTime() - from.getTime();
      const middle = from.getTime() + diff / 2;
      // scrollHeight + clientHeight/2 = middleHeightDate
      const clientHeightInterval =
        yToDate(scrollableContainerRef.current.clientHeight) - yToDate(0);
      const date = middle - clientHeightInterval / 2;
      void navigate({
        search: { date: dateFromISO(new Date(date).toISOString()) },
      });
      return utils.assets.list.invalidate();
    },
  });

  const form = useForm({
    values: {
      from,
      to: new Date(from.getTime() + dateDelimiter),
      assetId: id,
    },
    disabled: createBooking.isPending,
    resolver: zodResolver(zod.bookingInput),
  });

  const formId = useId();
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setInitialDate(open ? currDate : null);
      }}
      key={id}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="sticky top-0 z-10 w-full rounded-none"
        >
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
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
                e?.preventDefault();

                createBooking.mutate(data);
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
                  max={formatDateTime(new Date(form.watch("to").getTime() - 1))}
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
                  min={formatDateTime(
                    new Date(form.watch("from").getTime() + 1),
                  )}
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
