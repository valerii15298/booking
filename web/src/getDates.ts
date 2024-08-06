export const HOUR_IN_MS = 60 * 60 * 1000;
export const DAY_IN_MS = 24 * HOUR_IN_MS;

export function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  date.setMinutes(0, 0, 0);
  return date.getTime();
}

export function roundDateToHours(ts: number) {
  return Math.round(ts / HOUR_IN_MS) * HOUR_IN_MS;
}

export function getDates(
  startDate: number,
  endDate: number,
  dateDelimiter: number,
) {
  const dates = [];
  let currentDate = startDate;
  while (currentDate < endDate) {
    dates.push(currentDate);
    currentDate += dateDelimiter;
  }
  return dates;
}
