import { useState } from "react";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import type { Types } from "@/zod";

import { useApp } from "./app/useApp";
import { Booking } from "./Booking";
import { CreateBooking } from "./CreateBooking";

export function Asset(a: Types.Asset & { bookings: Types.Booking[] }) {
  const { yToDate } = useApp();
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  return (
    <>
      <ResizableHandle />
      <ResizablePanel className="flex flex-col" style={{ overflow: "visible" }}>
        <CreateBooking {...a} {...{ initialDate, setInitialDate }} />
        <section
          key={a.id}
          className="relative flex-1 overflow-y-hidden"
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget)
              setInitialDate(new Date(yToDate(e.nativeEvent.offsetY)));
          }}
        >
          {a.bookings.map((b) => (
            <Booking key={b.id} {...b} />
          ))}
        </section>
      </ResizablePanel>
    </>
  );
}
