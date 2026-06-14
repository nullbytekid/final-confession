"use client";

import { useEffect, useState } from "react";
import { formatYesSince } from "@/lib/formatYesSince";

interface YesSinceMessageProps {
  saidYesAt: string;
  className?: string;
}

export default function YesSinceMessage({
  saidYesAt,
  className = "",
}: YesSinceMessageProps) {
  const [message, setMessage] = useState(() =>
    formatYesSince(saidYesAt).fullMessage
  );

  useEffect(() => {
    const update = () => {
      setMessage(formatYesSince(saidYesAt).fullMessage);
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [saidYesAt]);

  return (
    <p
      className={`max-w-md text-base leading-relaxed text-pink-700/90 sm:text-lg ${className}`}
      style={{ fontFamily: "var(--font-cedarville)" }}
    >
      {message}
    </p>
  );
}
