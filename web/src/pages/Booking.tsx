import { useState } from "react";
import type { ResizeEnable } from "react-rnd";
import { Rnd } from "react-rnd";

import { useApp } from "@/app/useApp";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
export function Booking(b: Types.Booking) {
  const { from, to } = b;
  const { dateToY, yToDate } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const utils = trpc.useUtils();
  const update = trpc.bookings.update.useMutation({
    async onSuccess() {
      return utils.assets.list.invalidate();
    },
  });

  return (
    <Rnd
      className="bg-blue-500"
      // discouraged to use because of bad mobile support
      // title={`${from.toLocaleString()}\n${to.toLocaleString()}`}
      bounds="parent"
      enableResizing={enableResizing}
      size={{
        width: "100%",
        height: dateToY(to.getTime()) - dateToY(from.getTime()),
      }}
      position={{
        x: 0,
        y: dateToY(from.getTime()),
      }}
      // onDragStop={(_e, d) => {
      //   const _ = d.y;
      // }}

      // eslint-disable-next-line @typescript-eslint/max-params
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        update.mutate({
          ...b,
          from: new Date(yToDate(position.y)),
          to: new Date(yToDate(position.y + ref.clientHeight)),
        });
      }}
    >
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger
          onClick={() => {
            setTooltipOpen(true);
          }}
          className="h-full w-full"
        >
          {from.toLocaleTimeString()}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {from.toLocaleString()}
            <br />
            {to.toLocaleString()}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </Rnd>
  );
}
