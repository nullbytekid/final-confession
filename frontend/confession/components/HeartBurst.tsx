"use client";

import { useEffect, useState } from "react";

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface HeartBurstProps {
  active: boolean;
}

export default function HeartBurst({ active }: HeartBurstProps) {
  const [hearts, setHearts] = useState<BurstHeart[]>([]);

  useEffect(() => {
    if (!active) return;

    const burst: BurstHeart[] = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 1.2,
      };
    });

    setHearts(burst);
    const timer = setTimeout(() => setHearts([]), 1200);
    return () => clearTimeout(timer);
  }, [active]);

  if (hearts.length === 0) return null;

  return (
    <div className="heart-burst pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="burst-heart"
          style={
            {
              "--burst-x": `${heart.x}px`,
              "--burst-y": `${heart.y}px`,
              "--burst-rotation": `${heart.rotation}deg`,
              "--burst-scale": heart.scale,
            } as React.CSSProperties
          }
        >
          💖
        </span>
      ))}
    </div>
  );
}
