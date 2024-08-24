import { Interval } from "@/atoms/interval";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useApp } from "@/features/app/useApp";
import { trpc } from "@/trpc";

import { Asset } from "./Asset";
import { LoadPreviousNextButtons } from "./LoadPreviousNextButtons";
import { Settings } from "./settings/Settings";

const INTERVAL_BREAKPOINT = {
  [Interval.MILLISECOND]: "getMilliseconds",
  [Interval.SECOND]: "getSeconds",
  [Interval.MINUTE]: "getMinutes",
  [Interval.HOUR]: "getHours",
  [Interval.WEEK]: "getMonth",
} as const;

function dateInfoWithPaddings(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
  return { year, month, day, hours, minutes, seconds, milliseconds };
}

function getBreakpoint(interval: Interval, date: Date, first = false) {
  if (!first) {
    const dateMethod = INTERVAL_BREAKPOINT[interval];
    if (dateMethod && date[dateMethod]() !== 0) return null;

    if (interval === Interval.WEEK && date.getDate() > 7) return null;
    if (interval === Interval.DAY && date.getDate() !== 1) return null;
    if (interval === Interval.MINUTE && date.getHours() !== 0) return null;
    if (interval === Interval.MILLISECOND && date.getSeconds() !== 0)
      return null;
  }

  const { year, month, day, hours, minutes } = dateInfoWithPaddings(date);

  switch (interval) {
    case Interval.MILLISECOND:
    case Interval.SECOND:
      return (
        <>
          <i>
            {day}/{month}
          </i>
          <b>
            {hours}:{minutes}
          </b>
        </>
      );
    case Interval.MINUTE:
    case Interval.HOUR:
      return (
        <>
          <i>{year}</i>
          <b>
            {day}/{month}
          </b>
        </>
      );

    case Interval.DAY:
      return (
        <>
          <i>{year}</i>
          <b>{date.toLocaleString("default", { month: "short" })}</b>
        </>
      );
    case Interval.WEEK:
      return (
        <>
          <i>
            {month}/{day}
          </i>
          <b>{year}</b>
        </>
      );
    default:
      return null;
  }
}

function getDateItemValue(interval: Interval, date: Date) {
  const { month, day, hours, minutes, seconds, milliseconds } =
    dateInfoWithPaddings(date);

  switch (interval) {
    case Interval.MILLISECOND:
      return (
        <>
          {seconds}.{milliseconds}
        </>
      );
    case Interval.SECOND:
      return (
        <>
          {minutes}:{seconds}
        </>
      );
    case Interval.MINUTE:
    case Interval.HOUR:
      return (
        <>
          {hours}:{minutes}
        </>
      );
    case Interval.DAY:
    case Interval.WEEK:
      return (
        <>
          {month}/{day}
        </>
      );
    default:
      return null;
  }
}

function DateItem({ date, first = false }: { date: Date; first?: boolean }) {
  const { dateItemHeight, menuPosition, dateDelimiter } = useApp();

  const dateBreakpoint = getBreakpoint(dateDelimiter, date, first);

  const top =
    menuPosition === "top" ? 56 - dateItemHeight : 20 - dateItemHeight;

  return (
    <li
      className={`flex flex-col items-end justify-end overflow-hidden border-b bg-background px-2 ${dateBreakpoint ? "sticky" : ""}`}
      style={{ height: dateItemHeight, top }}
    >
      {dateBreakpoint}
      {!dateBreakpoint && getDateItemValue(dateDelimiter, date)}
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
