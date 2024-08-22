import { useState } from "react";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import type { Types } from "@/zod";

import { useApp } from "./app/useApp";
import { Booking } from "./Booking";
import { CreateBooking } from "./CreateBooking";

export function Asset(a: Types.Asset & { bookings: Types.Booking[] }) {
  const { yToDate, menuPosition } = useApp();
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  return (
    <>
      <ResizableHandle />
      <ResizablePanel className="flex flex-col" style={{ overflow: "visible" }}>
        {menuPosition === "top" && (
          <CreateBooking {...a} {...{ initialDate, setInitialDate }} />
        )}
        <section
          key={a.id}
          className="relative flex-1 overflow-y-hidden"
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget)
              setInitialDate(new Date(yToDate(e.nativeEvent.offsetY)));
          }}
        >
          {a.bookings
            .toSorted((a, b) => a.from.getTime() - b.from.getTime())
            .map((b) => (
              <Booking key={b.id} {...b} tabIndex={a.id + 1} />
            ))}
        </section>
        {menuPosition === "bottom" && (
          <CreateBooking {...a} {...{ initialDate, setInitialDate }} />
        )}
      </ResizablePanel>
    </>
  );
}
