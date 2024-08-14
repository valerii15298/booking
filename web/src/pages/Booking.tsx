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
export function Booking({ from, to }: Types.BookingInput) {
  const { dateToY } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <Rnd
      className="bg-blue-500"
      title={`${from.toLocaleString()}\n${to.toLocaleString()}`}
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

      // onResizeStop={(_e, _direction, ref, _delta, position) => {
      //   const _ = {
      //     width: "100%",
      //     height: ref.style.height,
      //     ...position,
      //   };
      // }}
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
