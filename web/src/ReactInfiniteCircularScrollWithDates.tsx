import { useEffect, useRef } from "react";

import { getDates, HOUR_IN_MS } from "./getDates";
import type { UseState } from "./lib/types";

export function ReactInfiniteCircularScrollWithDates({
  onScroll,
  startDate,
  setStartDate,
}: {
  onScroll?: React.DOMAttributes<HTMLDivElement>["onScroll"];
} & UseState<number, "startDate">) {
  const ITEM_HEIGHT = 50;
  const dates = getDates(startDate);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scroll({ top: ITEM_HEIGHT });
  }, []);

  return (
    <div
      ref={listRef}
      className="w-fit overflow-y-auto hide-scrollbar"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight) {
          setStartDate((date) => date + HOUR_IN_MS);
        } else if (scrollTop === 0) {
          const firstItemRef = e.currentTarget.firstElementChild;
          if (!firstItemRef) {
            return;
          }
          setStartDate((date) => date - HOUR_IN_MS);
          setTimeout(() => {
            firstItemRef.scrollIntoView();
          });
        }
        onScroll?.(e);
      }}
    >
      {dates.map((item) => (
        <div
          className="border bg-gray-100"
          style={{ height: ITEM_HEIGHT }}
          key={item}
        >
          {new Date(item).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
