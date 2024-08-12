import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { z } from "zod";

import { type AppContext, appContext } from "@/appContext/app";
import { Interval, intervalSchema } from "@/interval";
import { AssetsBookings } from "@/pages/Bookings";
import { trpcUtils } from "@/trpc";

const validateSearch = z.object({
  maxItemsCount: z.number().catch(100),
  dateItemHeight: z.number().catch(50),
  dateDelimiter: intervalSchema.catch(Interval.HOUR),
  date: z.number().catch(Date.now()),
  selectedBookingId: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/")({
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  component: Index,
  validateSearch,
  loader: async () => trpcUtils.assets.list.ensureData(),
});

function roundDate(ts: number, interval: Interval) {
  return Math.round(ts / interval) * interval;
}

function getDates(startDate: number, endDate: number, dateDelimiter: number) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    dates.push(currentDate);
    currentDate += dateDelimiter;
  }
  return dates;
}

function Index() {
  const navigate = Route.useNavigate();
  const { date, dateDelimiter, dateItemHeight, maxItemsCount } =
    Route.useSearch();

  function getStartDateFor(ts: number) {
    return roundDate(ts - maxItemsCount * dateDelimiter, dateDelimiter);
  }

  const minItemsCount = 2 * Math.ceil(window.outerHeight / dateItemHeight);

  if (maxItemsCount < minItemsCount) {
    // TODO refactor
    throw new Error(
      `maxItemsCount should be greater than or equal to ${minItemsCount}`,
    );
  }

  const startDate = getStartDateFor(date);
  const endDate = roundDate(
    date + maxItemsCount * dateDelimiter,
    dateDelimiter,
  );

  const dates = getDates(startDate, endDate, dateDelimiter);

  // eslint-disable-next-line func-style
  const dateToY: AppContext["dateToY"] = function dateToY(ts, params) {
    const p = {
      startDate,
      dateDelimiter,
      dateItemHeight,
      ...params,
    };
    // (date milliseconds diff) multiple by (pixels per millisecond ratio)
    return ((ts - p.startDate) * p.dateItemHeight) / p.dateDelimiter;
  };

  // TODO fix rule func-style which is currently set to ["error", "declaration"],
  // eslint-disable-next-line func-style
  const yToDate = function yToDate(y: number, params?: Partial<AppContext>) {
    const p = {
      startDate,
      dateDelimiter,
      dateItemHeight,
      ...params,
    };
    // startDate + milliseconds diff
    // startDate + ((pixels diff) multiple by (milliseconds per pixel ratio))
    return p.startDate + (y * p.dateDelimiter) / p.dateItemHeight;
  };

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  function scrollPositionMs() {
    return yToDate(scrollableContainerRef.current?.scrollTop ?? 0);
  }

  // if ((endDate - startDate) % dateDelimiter !== 0) {
  //   // eslint-disable-next-line no-console
  //   console.log((endDate - startDate) % dateDelimiter);
  //   console.error(
  //     `Error: (endDate - startDate) should be always dividable by dateDelimiter. Current values: startDate=${startDate}, endDate=${endDate}, dateDelimiter=${dateDelimiter}`,
  //   );
  // }

  // eslint-disable-next-line func-style
  const scroll: AppContext["scroll"] = async function scroll({
    toDate,
    fromDate,
    behavior,
    // TODO type: 'top' | 'bottom' | 'center'
  }) {
    // state should be pushed to url search params so that user should be able to go back to previous position
    // so before doing this current position should be saved to url search params
    // also this function should be used for jump to date user functionality

    // TODO navigate
    return navigate({
      search: (prev) => ({ ...prev, date: toDate }),
    }).then(() => {
      const newStartDate = getStartDateFor(toDate);
      if (behavior === "smooth" && fromDate) {
        scrollableContainerRef.current?.scrollTo({
          top: dateToY(fromDate, { startDate: newStartDate }),
          behavior: "instant",
        });
      }
      scrollableContainerRef.current?.scrollTo({
        top: dateToY(toDate, { startDate: newStartDate }),
        ...(behavior ? { behavior } : {}),
      });
    });
  };

  return (
    <appContext.Provider
      value={{
        dateDelimiter,
        dates,
        startDate,
        dateItemHeight,
        dateToY,
        scrollPositionMs,
        scroll,
        scrollableContainerRef,
      }}
    >
      <AssetsBookings />
    </appContext.Provider>
  );
}
