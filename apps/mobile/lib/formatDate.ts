export function formatTimestamp(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "";
  let date: Date;
  if (typeof value === "number") {
    // assume seconds since epoch if small, ms if large
    date = new Date(value < 10_000_000_000 ? value * 1000 : value);
  } else if (/^\d+$/.test(value)) {
    const num = Number(value);
    date = new Date(num < 10_000_000_000 ? num * 1000 : num);
  } else {
    date = new Date(value);
  }
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const dd = pad(date.getDate());
  const MM = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  return `${hh}h${mm} ${dd}:${MM}:${yyyy}`;
}
