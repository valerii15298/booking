import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { useApp } from "./app/useApp";

export function LiveSeparator() {
  const { dateToY, startDate, endDate, dateDelimiter } = useApp();
  const isVisible = Date.now() >= startDate && Date.now() <= endDate;
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, dateDelimiter.value);
    return () => {
      clearInterval(interval);
    };
  }, [dateDelimiter.value]);

  if (!isVisible) return null;
  return (
    <Separator
      className="absolute -translate-y-1/2 bg-orange-400 dark:bg-orange-800"
      style={{
        top: dateToY(time),
      }}
    />
  );
}
export function Separators({ dates }: { dates: number[] }) {
  const { dateToY } = useApp();
  return dates.map((date) => (
    <Separator
      key={date}
      className="absolute -translate-y-1/2"
      style={{
        top: dateToY(date),
      }}
    />
  ));
}
