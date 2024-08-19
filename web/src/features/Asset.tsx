import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import type { Types } from "@/zod";

import { Booking } from "./Booking";
import { CreateBooking } from "./CreateBooking";

export function Asset(a: Types.Asset & { bookings: Types.Booking[] }) {
  return (
    <>
      <ResizableHandle />
      <ResizablePanel className="flex flex-col" style={{ overflow: "visible" }}>
        <CreateBooking {...a} />
        <section key={a.id} className="relative flex-1 overflow-y-hidden">
          {a.bookings.map((b) => (
            <Booking key={b.id} {...b} />
          ))}
        </section>
      </ResizablePanel>
    </>
  );
}
