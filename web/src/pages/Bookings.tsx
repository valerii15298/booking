import { useRef, useState } from "react";
import type { ResizeEnable } from "react-rnd";
import { Rnd } from "react-rnd";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getDefaultStartDate, getEndDate } from "../getDates";
import { ReactInfiniteCircularScrollWithDates } from "../ReactInfiniteCircularScrollWithDates";
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

export function AssetsBookings() {
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const assetsQuery = trpc.assets.list.useQuery();
  const [scrollHeight, setScrollHeight] = useState(0);
  const bookingsQuery = trpc.bookings.list.useQuery();
  const refs = useRef<Record<number, HTMLElement>>({});

  const endDate = getEndDate(startDate);
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
        <ReactInfiniteCircularScrollWithDates
          {...{ startDate, setStartDate }}
          onScroll={(e) => {
            if (!scrollHeight) setScrollHeight(e.currentTarget.scrollHeight);
            for (const ref of Object.values(refs.current)) {
              ref.scrollTop = e.currentTarget.scrollTop;
            }
          }}
        />
        {assetsQuery.data.map((asset) => {
          const assetBookings = bookingsQuery.data
            .filter((b) => b.assetId === asset.id)
            .filter((b) => b.from >= startDate && b.to <= endDate);
          return (
            <section
              key={asset.id}
              ref={(e) => {
                if (e) {
                  refs.current[asset.id] = e;
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                  delete refs.current[asset.id];
                }
              }}
              className="relative w-32 overflow-y-hidden"
            >
              <div
                style={{
                  minHeight: scrollHeight,
                  maxHeight: scrollHeight,
                  height: scrollHeight,
                }}
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
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
