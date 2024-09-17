import type { UseFormReturn } from "react-hook-form";

import { formatDateTime, roundDate } from "@/atoms/dates";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Types } from "@/zod";

import { useApp } from "./app/useApp";

export function EditBooking<T extends Types.BookingInput = Types.BookingInput>({
  form: _form,
  formId,
  onSubmit,
}: {
  form: UseFormReturn<T>;
  formId?: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  const form = _form as UseFormReturn<Types.BookingInput>;

  const { dateDelimiter } = useApp();

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={onSubmit}
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
  );
}