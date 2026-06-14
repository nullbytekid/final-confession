export function formatYesSince(iso: string): {
  dateLabel: string;
  agoLabel: string;
  fullMessage: string;
} {
  const then = new Date(iso);
  const now = new Date();

  const dateLabel = then.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let months =
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth());
  let days = now.getDate() - then.getDate();
  let hours = now.getHours() - then.getHours();
  let minutes = now.getMinutes() - then.getMinutes();

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  if (hours < 0) {
    days -= 1;
    hours += 24;
  }
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).getDate();
    days += prevMonthDays;
  }

  const parts: string[] = [];
  if (months > 0) {
    parts.push(`${months} month${months === 1 ? "" : "s"}`);
  }
  if (days > 0) {
    parts.push(`${days} day${days === 1 ? "" : "s"}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (parts.length === 0) {
    const totalMinutes = Math.max(
      1,
      Math.floor((now.getTime() - then.getTime()) / 60000)
    );
    parts.push(
      `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`
    );
  }

  const agoLabel = `${parts.join(", ")} ago`;
  const fullMessage = `(${dateLabel}) ${agoLabel} since you said yes to let marlon court you`;

  return { dateLabel, agoLabel, fullMessage };
}
