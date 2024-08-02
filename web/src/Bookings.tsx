import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "./components/ui/button";
import { trpc } from "./trpc";
import type { Types } from "./zod";

const DAY_FULL = 24 * 60 * 60 * 1000; // 100 in panel size is 1 day
// const DAY_HALF = DAY_FULL / 2;
// const DAY_QUARTER = DAY_FULL / 4;
const PANEL_MAX_SIZE = 100;
const startDate = new Date();
startDate.setHours(0, 0, 0, 0);
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

function panelSizeMsToPercentage(interval: number) {
  return (interval * PANEL_MAX_SIZE) / DAY_FULL;
}

export function Bookings({ id: assetId, name }: Types.Asset) {
  const bookingsQuery = trpc.bookings.list.useQuery();
  if (bookingsQuery.isPending) {
    return <>Loading...</>;
  }
  if (bookingsQuery.isError) {
    return <>{bookingsQuery.error.message}</>;
  }
  const assetBookings = bookingsQuery.data.filter(
    (booking) => booking.assetId === assetId,
  );
  const panelsSizesInMs = assetBookings.reduce<number[]>(
    (acc, { from, to }, i) => [
      ...acc,
      to - from,
      (assetBookings[i + 1]?.from ?? endDate.getTime()) - to,
    ],
    [],
  );
  const panelsSizes = panelsSizesInMs.map(panelSizeMsToPercentage);

  const panelsJsx = panelsSizes
    .map((size, i) => (
      <ResizablePanel
        key={i}
        order={i}
        defaultSize={size}
        className={i % 2 ? undefined : "bg-slate-600"}
      />
    ))
    .flatMap((panel, i) => [<ResizableHandle key={-i - 1} />, panel]);

  return (
    <section className="inline-block h-full px-2">
      <Button className="m-auto w-fit text-center">{name}</Button>
      <ResizablePanelGroup
        className="h-full rounded-lg border"
        direction="vertical"
      >
        <ResizablePanel />
        {panelsJsx}
      </ResizablePanelGroup>
    </section>
  );
}

export function AssetsBookings() {
  const assetsQuery = trpc.assets.list.useQuery();
  if (assetsQuery.isPending) {
    return <>Loading...</>;
  }
  if (assetsQuery.isError) {
    return <>{assetsQuery.error.message}</>;
  }
  return (
    <main className="h-full">
      {assetsQuery.data.map((asset) => (
        <Bookings key={asset.id} {...asset} />
      ))}
    </main>
  );
}
