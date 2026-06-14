"use client";

import { useMemo } from "react";

interface Heart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingHeartsProps {
  count?: number;
}

export default function FloatingHearts({ count = 18 }: FloatingHeartsProps) {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 12 + Math.random() * 20,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <div className="floating-hearts pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          💕
        </span>
      ))}
    </div>
  );
}
