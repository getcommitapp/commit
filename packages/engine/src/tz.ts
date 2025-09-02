import { Temporal } from "@js-temporal/polyfill";

export function toZonedDateTime(
  date: Date,
  tz: string
): Temporal.ZonedDateTime {
  return Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO(tz);
}

export function fromLocalParts(
  localDate: string, // YYYY-MM-DD
  timeHHmm: string, // HH:mm
  tz: string
): Date {
  const [year, month, day] = localDate.split("-").map((p) => parseInt(p, 10));
  const [hour, minute] = timeHHmm.split(":").map((p) => parseInt(p, 10));
  const zdt = Temporal.ZonedDateTime.from({
    timeZone: tz,
    year,
    month,
    day,
    hour,
    minute,
    second: 0,
    millisecond: 0,
  });
  return new Date(zdt.toInstant().epochMilliseconds);
}

export function formatLocalDate(date: Date, tz: string): string {
  const z = Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO(tz);
  const y = z.year.toString().padStart(4, "0");
  const m = z.month.toString().padStart(2, "0");
  const d = z.day.toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatLocalTimeHHmm(date: Date, tz: string): string {
  const z = Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO(tz);
  const hh = z.hour.toString().padStart(2, "0");
  const mm = z.minute.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
