"use client";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  return (
    <div className={`page-enter min-h-screen ${className}`}>{children}</div>
  );
}
