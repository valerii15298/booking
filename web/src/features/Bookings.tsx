import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";

import { Asset } from "./Asset";
import { LoadPreviousNextButtons } from "./LoadPreviousNextButtons";
import { Settings } from "./settings/Settings";

function DateItem({ date }: { date: Date }) {
  const { dateItemHeight, menuPosition } = useApp();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isBreakpoint = hours === 0;

  const top =
    menuPosition === "top" ? 56 - dateItemHeight : 20 - dateItemHeight;
  return (
    <li
      className={`flex items-end justify-end border-b bg-background px-2 ${isBreakpoint ? "sticky" : ""}`}
      style={{ height: dateItemHeight, top }}
    >
      {isBreakpoint && (
        <b>
          {day}/{month}
        </b>
      )}
      {!isBreakpoint && (
        <>
          {hours}:{minutes}
        </>
      )}
    </li>
  );
}

export function AssetsBookings() {
  const { dates, scrollableContainerRef, startDate, endDate, menuPosition } =
    useApp();
  function betweenStartAndEnd(date: Date) {
    return date.getTime() >= startDate && date.getTime() <= endDate;
  }
  const [assets] = trpc.assets.list.useSuspenseQuery(undefined, {
    select(assets) {
      return assets.map((a) => ({
        ...a,
        bookings: a.bookings.filter(
          (b) => betweenStartAndEnd(b.from) || betweenStartAndEnd(b.to),
        ),
      }));
    },
  });
  const utils = trpc.useUtils();

  trpc.bookings.updated.useSubscription(undefined, {
    onData(data) {
      utils.assets.list.setData(undefined, (prev) => {
        if (!prev) return prev;
        return prev.map((a) => ({
          ...a,
          bookings: a.bookings.map((b) => (b.id === data.id ? data : b)),
        }));
      });
    },
  });

  return (
    <main
      ref={scrollableContainerRef}
      className="h-full overflow-y-auto hide-scrollbar"
    >
      <LoadPreviousNextButtons />
      <div className="relative w-fit">
        <ResizablePanelGroup
          direction="horizontal"
          style={{ overflow: "visible" }}
        >
          <ResizablePanel
            className="sticky left-0 z-20"
            style={{ overflow: "visible" }}
          >
            {menuPosition === "top" && <Settings />}
            <ul className="bg-background">
              {dates.map((date) => (
                <DateItem key={date} date={new Date(date)} />
              ))}
            </ul>
            {menuPosition === "bottom" && <Settings />}
          </ResizablePanel>

          {assets.map((a) => (
            <Asset {...a} key={a.id} />
          ))}
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
