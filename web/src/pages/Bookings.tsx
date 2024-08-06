import { Fragment } from "react";
import type { ResizeEnable } from "react-rnd";
import { Rnd } from "react-rnd";

import { useApp } from "@/appContext/useApp";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DAY_IN_MS } from "../getDates";
import { CreateBooking } from "./CreateBooking";

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

export function AssetsBookings() {
  const {
    assets,
    bookings,
    startDate,
    setStartDate: _setStartDate,
    endDate,
    setEndDate,
    dates,
    columnsSizes: [datesColumnSize, ...columnsSizes],
    setColumnsSizes,
    dateItemHeight,
    setDateItemHeight: _setDateItemHeight,
    scrollableContainerHeight,
    scrollableContainerRef,
    dateToY,
  } = useApp();

  return (
    <main className="flex h-full flex-col">
      <ResizablePanelGroup
        tagName="header"
        direction="horizontal"
        className="flex-shrink-0"
        style={{ height: "unset" }}
        onLayout={setColumnsSizes}
      >
        <ResizablePanel>
          <Button className="w-full rounded-none">Settings</Button>
        </ResizablePanel>
        {assets.map((a) => (
          <Fragment key={a.id}>
            <ResizableHandle />
            <ResizablePanel>
              <CreateBooking {...a} />
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
      <div className="flex w-full overflow-hidden">
        <div
          ref={scrollableContainerRef}
          className="flex w-full overflow-y-auto hide-scrollbar"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            if (scrollHeight - scrollTop <= clientHeight * 2 + 1) {
              setEndDate((prev) => prev + DAY_IN_MS);
            }
          }}
        >
          <ul style={{ width: `${datesColumnSize}%` }}>
            {dates.map((item, i) => (
              <li
                className="border bg-black text-white"
                style={{
                  height: dateItemHeight,
                  backgroundColor: i % 2 ? "gray" : undefined,
                }}
                key={item}
              >
                {new Date(item).toLocaleString()}
              </li>
            ))}
          </ul>
          {assets.map((asset, i) => {
            const assetBookings = bookings
              .filter((b) => b.assetId === asset.id)
              .filter((b) => b.from >= startDate && b.to <= endDate);
            return (
              <section
                key={asset.id}
                style={{
                  height: scrollableContainerHeight,
                  width: `${columnsSizes[i]}%`,
                }}
                className="relative w-32"
              >
                {assetBookings.map(({ from, to, id }) => (
                  <Rnd
                    className="bg-blue-500"
                    key={id}
                    title={`${new Date(from).toLocaleString()}\n${new Date(to).toLocaleString()}`}
                    bounds="parent"
                    enableResizing={enableResizing}
                    size={{
                      width: "100%",
                      height: dateToY(to) - dateToY(from),
                    }}
                    position={{
                      x: 0,
                      y: dateToY(from),
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
                    <Tooltip>
                      <TooltipTrigger>
                        {new Date(from).toLocaleTimeString()}
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent>
                          {new Date(from).toLocaleString()}
                          <br />
                          {new Date(to).toLocaleString()}
                        </TooltipContent>
                      </TooltipPortal>
                    </Tooltip>
                  </Rnd>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
