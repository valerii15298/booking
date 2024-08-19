import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";

import { Asset } from "./Asset";
import { Settings } from "./settings/Settings";

export function AssetsBookings() {
  const [assets] = trpc.assets.list.useSuspenseQuery();

  const { dates, dateItemHeight, scrollableContainerRef, preload } = useApp();
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
            <Asset {...a} key={a.id} />
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
