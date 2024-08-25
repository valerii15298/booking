import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";

import { Asset } from "./Asset";
import { DateItem } from "./DateItem";
import { LoadPreviousNextButtons } from "./LoadMoreButton";
import { Settings } from "./settings/Settings";

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
              <DateItem key={dates[0]} date={new Date(dates[0]!)} first />
              {dates.slice(1).map((date) => (
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
