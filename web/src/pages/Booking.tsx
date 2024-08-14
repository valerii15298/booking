import { CubeIcon } from "@radix-ui/react-icons";
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
  const utils = trpc.useUtils();
  const update = trpc.bookings.update.useMutation({
    async onSuccess() {
      return utils.assets.list.invalidate();
    },
  });
  const { dateToY, yToDate } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { from, to } = update.isPending ? update.variables : b;

  return (
    <Rnd
      className="bg-cyan-400"
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
          {update.isPending && (
            <CubeIcon className={`m-auto h-[50%] w-[50%] animate-spin`} />
          )}
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
