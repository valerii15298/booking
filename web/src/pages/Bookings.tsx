import { useLayoutEffect, useRef, useState } from "react";
import type { ResizeEnable } from "react-rnd";
import { Rnd } from "react-rnd";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DAY_IN_MS, getDates, getDefaultStartDate } from "../getDates";
import { trpc } from "../trpc";

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

const DATE_ITEM_HEIGHT = 50;
export function AssetsBookings() {
  const [startDate, _setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(startDate + DAY_IN_MS);
  const assetsQuery = trpc.assets.list.useQuery();
  const [scrollHeight, setScrollHeight] = useState(0);
  const bookingsQuery = trpc.bookings.list.useQuery();
  const datesListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!datesListRef.current) return;
    if (scrollHeight !== datesListRef.current.scrollHeight) {
      setScrollHeight(datesListRef.current.scrollHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  const dates = getDates(startDate, endDate);

  if (bookingsQuery.isPending) {
    return <>Loading...</>;
  }
  if (bookingsQuery.isError) {
    return <>{bookingsQuery.error.message}</>;
  }
  if (assetsQuery.isPending) {
    return <>Loading...</>;
  }
  if (assetsQuery.isError) {
    return <>{assetsQuery.error.message}</>;
  }

  // startDate -> 0 (pixels)
  // endDate -> scrollHeight (pixels)
  // x -> (x - startDate) * scrollHeight / (endDate - startDate) (pixels)

  function dateToY(ts: number) {
    return ((ts - startDate) * scrollHeight) / (endDate - startDate);
  }

  return (
    <main className="flex h-full flex-col">
      <header>
        <Button>Settings</Button>
        {assetsQuery.data.map((a) => (
          <Button key={a.id}>{a.name}</Button>
        ))}
      </header>
      <div className="flex overflow-hidden">
        <div
          ref={datesListRef}
          className="flex w-fit overflow-y-auto hide-scrollbar"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            if (scrollHeight - scrollTop <= clientHeight * 2 + 1) {
              setEndDate((prev) => prev + DAY_IN_MS);
            }
          }}
        >
          <ul>
            {dates.map((item, i) => (
              <li
                className="border bg-black text-white"
                style={{
                  height: DATE_ITEM_HEIGHT,
                  backgroundColor: i % 2 ? "gray" : undefined,
                }}
                key={item}
              >
                {new Date(item).toLocaleString()}
              </li>
            ))}
          </ul>
          {assetsQuery.data.map((asset) => {
            const assetBookings = bookingsQuery.data
              .filter((b) => b.assetId === asset.id)
              .filter((b) => b.from >= startDate && b.to <= endDate);
            return (
              <section
                key={asset.id}
                style={{ height: scrollHeight }}
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
