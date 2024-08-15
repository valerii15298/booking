import { Fragment } from "react";

import { useApp } from "@/app/useApp";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { trpc } from "@/trpc";

import { Booking } from "./Booking";
import { CreateBooking } from "./CreateBooking";
import { Settings } from "./Settings";

export function AssetsBookings() {
  const [assets] = trpc.assets.list.useSuspenseQuery();

  const { dates, dateItemHeight, scrollableContainerRef, preload } = useApp();

  return (
    <main
      ref={scrollableContainerRef}
      className="h-full overflow-y-auto hide-scrollbar"
    >
      <div className="relative">
        <Button
          variant={"outline"}
          className="absolute left-[50%] top-2 z-20 translate-x-[-50%]"
          onClick={preload}
        >
          Load Previous
        </Button>
        <ResizablePanelGroup
          tagName="header"
          direction="horizontal"
          style={{ overflow: "visible" }}
        >
          <ResizablePanel style={{ overflow: "visible" }}>
            <Settings />

            <ul>
              {dates.map((item) => (
                <li style={{ height: dateItemHeight }} key={item}>
                  {new Date(item).toLocaleString()}
                </li>
              ))}
            </ul>
          </ResizablePanel>

          {assets.map((a) => (
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
                  {a.bookings.map((b) => (
                    <Booking key={b.id} {...b} />
                  ))}
                </section>
              </ResizablePanel>
            </Fragment>
          ))}
        </ResizablePanelGroup>
        <Button
          variant={"outline"}
          className="absolute bottom-2 left-[50%] z-20 translate-x-[-50%]"
          onClick={preload}
        >
          Load Next
        </Button>
      </div>
    </main>
  );
}
