import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";

import { Asset } from "./Asset";
import { LoadPreviousNextButtons } from "./LoadPreviousNextButtons";
import { Settings } from "./settings/Settings";

function DateItem({ date }: { date: Date }) {
  const { dateItemHeight } = useApp();
  const hours = date.getHours();
  const isBreakpoint = hours === 0;
  const breakpointDate = date.toLocaleDateString();
  const minutes = date.getMinutes();
  return (
    <li
      className={`mr-2 flex justify-end bg-background ${isBreakpoint ? "sticky top-9" : ""}`}
      style={{ height: dateItemHeight }}
    >
      {isBreakpoint
        ? breakpointDate
        : `${hours}:${minutes.toString().padStart(2, "0")}`}
    </li>
  );
}

export function AssetsBookings() {
  const { dates, scrollableContainerRef, startDate, endDate } = useApp();
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
            <Settings />
            <ul className="bg-background">
              {dates.map((date) => (
                <DateItem date={new Date(date)} />
              ))}
            </ul>
          </ResizablePanel>

          {assets.map((a) => (
            <Asset {...a} key={a.id} />
          ))}
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
