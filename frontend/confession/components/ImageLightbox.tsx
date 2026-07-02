"use client";

import Image from "next/image";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  return (
    <div
      className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-sm text-pink-800 shadow-lg"
      >
        ✕ Close
      </button>
      <div
        className="lightbox-content max-h-[90vh] max-w-[95vw] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          unoptimized
          className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
        />
      </div>
    </div>
  );
}
