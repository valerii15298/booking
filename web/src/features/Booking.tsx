import { useState } from "react";
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
export function Booking(booking: Types.Booking) {
  const utils = trpc.useUtils();
  const update = trpc.bookings.update.useMutation({
    async onSuccess() {
      return utils.assets.list.invalidate();
    },
  });
  const { dateToY, yToDate } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [isResizing, setIsResizing] = useState(false);

  const b = update.isPending ? update.variables : booking;

  return (
    <Rnd
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
      onDragStop={(_, { y }) => {
        if (isResizing) return;
        update.mutate({
          ...b,
          from: new Date(yToDate(y)),
          to: new Date(yToDate(y) + (b.to.getTime() - b.from.getTime())),
          updatedAt: new Date(),
        });
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
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger
          onClick={() => {
            setTooltipOpen(true);
          }}
          className="grid h-full w-full place-items-center overflow-hidden"
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
