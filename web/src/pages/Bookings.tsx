import { Fragment, useEffect } from "react";
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
    dates,
    dateItemHeight,
    scrollableContainerRef,
    dateToY,
  } = useApp();

  useEffect(() => {
    // TODO refactor to use tanstack router
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: dateToY(Date.now()),
        behavior: "instant",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      ref={scrollableContainerRef}
      className="h-full overflow-y-auto hide-scrollbar"
    >
      <div className="relative">
        <Button
          variant={"outline"}
          className="absolute left-[50%] top-2 z-20 translate-x-[-50%]"
        >
          Load Previous
        </Button>
        <ResizablePanelGroup
          tagName="header"
          direction="horizontal"
          style={{ overflow: "visible" }}
        >
          <ResizablePanel style={{ overflow: "visible" }}>
            <Button className="sticky top-0 w-full rounded-none">
              Settings
            </Button>

            <ul>
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
          </ResizablePanel>
          {assets.map((a) => {
            const assetBookings = bookings.filter((b) => b.assetId === a.id);

            return (
              <Fragment key={a.id}>
                <ResizableHandle />
                <ResizablePanel
                  className="flex flex-col"
                  style={{ overflow: "visible" }}
                >
                  <CreateBooking {...a} />
                  <section
                    key={a.id}
                    className="relative flex-1 overflow-y-hidden"
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
                </ResizablePanel>
              </Fragment>
            );
          })}
        </ResizablePanelGroup>
        <Button
          variant={"outline"}
          className="absolute bottom-2 left-[50%] z-20 translate-x-[-50%]"
        >
          Load Next
        </Button>
      </div>
    </main>
  );
}
