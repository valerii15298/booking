import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import { useId, useRef } from "react";
import { useForm } from "react-hook-form";

import { AppDate, formatDateTime, roundDate } from "@/atoms/dates";
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
  const open = Boolean(initialDate);
  const fromRaw = initialDate ?? currDate;

  const { dateDelimiter, scrollableContainerRef, yToDate, menuPosition } =
    useApp();
  const from = new Date(
    roundDate(fromRaw.getTime(), dateDelimiter.prev().value),
  );

  const navigate = routeApi.useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const utils = trpc.useUtils();
  const formId = useId();

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess({ id }, { from, to }) {
      if (!scrollableContainerRef.current) return;
      setInitialDate(null);
      const diff = to.getTime() - from.getTime();
      const middle = from.getTime() + diff / 2;
      // scrollHeight + clientHeight/2 = middleHeightDate
      const clientHeightInterval =
        yToDate(scrollableContainerRef.current.clientHeight) - yToDate(0);
      const date = middle - clientHeightInterval / 2;

      // to prevent focus issues navigate only after dialog close animation ended
      ref.current?.addEventListener(
        "animationend",
        () =>
          setTimeout(
            () =>
              void navigate({
                search: {
                  date: new AppDate(date).toUrlFriendly(),
                  focusBookingId: id,
                },
              }),
          ),
        { once: true },
      );
    },
    async onSettled() {
      return utils.assets.list.invalidate();
    },
  });

  const form = useForm({
    values: {
      from,
      to: new Date(from.getTime() + dateDelimiter.value),
      assetId: id,
    },
    disabled: createBooking.isPending,
    resolver: zodResolver(zod.bookingInput),
  });

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
          variant={"outline"}
          className={`sticky z-10 w-full rounded-none ${menuPosition === "top" ? "top-0" : "bottom-0"}`}
        >
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent ref={ref} className="w-fit max-w-fit">
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
                  step={dateDelimiter.prev().value / 1000}
                  type={dateDelimiter.prev().inputType}
                  className="w-fit"
                  {...field}
                  max={formatDateTime(
                    new Date(
                      form.watch("to").getTime() - dateDelimiter.prev().value,
                    ),
                  )}
                  value={formatDateTime(field.value)}
                  onChange={(e) => {
                    const ts = new Date(e.target.value).getTime();
                    const roundedTs = roundDate(ts, dateDelimiter.prev().value);
                    field.onChange(new Date(roundedTs));
                  }}
                  required
                />
              )}
            />
            <span className="hidden whitespace-nowrap sm:inline">{"->"}</span>
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <Input
                  step={dateDelimiter.prev().value / 1000}
                  type={dateDelimiter.prev().inputType}
                  className="w-fit"
                  {...field}
                  min={formatDateTime(
                    new Date(
                      form.watch("from").getTime() + dateDelimiter.prev().value,
                    ),
                  )}
                  value={formatDateTime(field.value)}
                  onChange={(e) => {
                    const ts = new Date(e.target.value).getTime();
                    const roundedTs = roundDate(ts, dateDelimiter.prev().value);
                    field.onChange(new Date(roundedTs));
                  }}
                  required
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
