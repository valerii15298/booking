import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ResizeEnable } from "react-rnd";
import { Rnd } from "react-rnd";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";
import type { Types } from "@/zod";

const enableResizing: ResizeEnable = {
  top: true,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

const routeApi = getRouteApi("/");
export function Booking({
  tabIndex,
  ...booking
}: Types.Booking & { tabIndex: number }) {
  const utils = trpc.useUtils();
  const update = trpc.bookings.update.useMutation({
    async onSettled() {
      return utils.assets.list.invalidate();
    },
  });
  const { dateToY, yToDate } = useApp();

  const [isResizing, setIsResizing] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const { focusBookingId } = routeApi.useSearch();

  useEffect(() => {
    if (booking.id === focusBookingId) {
      ref.current?.focus();
    }
  }, [booking.id, focusBookingId]);

  const b = update.isPending ? update.variables : booking;

  function getDragDates(y: number) {
    const from = new Date(yToDate(y));
    const to = new Date(yToDate(y) + (b.to.getTime() - b.from.getTime()));
    return { from, to };
  }
  return (
    <Rnd
      key={b.id}
      className="bg-indigo-400 dark:bg-indigo-800"
      bounds="parent"
      enableResizing={enableResizing}
      size={{
        width: "100%",
        height: dateToY(b.to.getTime()) - dateToY(b.from.getTime()),
      }}
      dragAxis="y"
      position={{
        x: 0,
        y: dateToY(b.from.getTime()),
      }}
      onDrag={(_, { y }) => {
        const { from, to } = getDragDates(y);
        utils.assets.list.setData(undefined, (prev) =>
          prev?.map((a) => ({
            ...a,
            bookings: a.bookings.map((b) =>
              b.id === booking.id ? { ...b, from, to } : b,
            ),
          })),
        );
      }}
      onDragStop={(_, { y }) => {
        if (isResizing) return;
        const { from, to } = getDragDates(y);
        update.mutate({ ...b, from, to, updatedAt: new Date() });
      }}
      onResizeStart={() => {
        setIsResizing(true);
      }}
      // eslint-disable-next-line @typescript-eslint/max-params
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setIsResizing(false);
        update.mutate({
          ...b,
          from: new Date(yToDate(position.y)),
          to: new Date(yToDate(position.y + ref.clientHeight)),
          updatedAt: new Date(),
        });
      }}
    >
      <Tooltip>
        <TooltipTrigger
          tabIndex={tabIndex}
          ref={ref}
          className="grid h-full w-full place-items-center overflow-hidden focus:outline focus:outline-1 focus-visible:outline-foreground"
        >
          {b.id} {b.from.toLocaleString()}
          {" -> "}
          {b.to.toLocaleString()}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {b.from.toLocaleString()}
            <br />
            {b.to.toLocaleString()}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </Rnd>
  );
}
