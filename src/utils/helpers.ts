import { format, setMonth, setYear, startOfYear } from "date-fns";

export function wait(timeInMs: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, timeInMs);
  });
}

export function formatDate(date: string | number | Date) {
  return format(new Date(date), "HH:mm dd.MM.yyyy");
}

export const minYear = 2020;

export const minYearDate = startOfYear(setYear(new Date(), minYear));

export function getMonthsOptions() {
  const now = new Date();
  return new Array(12).fill(null).map((_, index) => format(setMonth(now, index), "MMMM"));
}

export function getYearOptions() {
  const now = new Date();
  return new Array(now.getFullYear() - minYear + 1).fill(null).map((_, index) => minYear + index);
}
