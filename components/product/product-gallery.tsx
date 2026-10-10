"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Main image with hover zoom (pointer devices) and a thumbnail strip when there is more than one image. */
export function ProductGallery({ images, badge }: { images: ProductImage[]; badge?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const image = images[index];

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div className="relative flex-1 rounded-lg border border-line bg-blue-tint p-4 sm:p-6">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-md bg-white"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setZoom(null)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain transition-transform duration-200 ease-out"
            style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
        {badge && <div className="absolute top-3 left-3">{badge}</div>}
      </div>

      {images.length > 1 && (
        <ul className="flex gap-3 lg:w-20 lg:flex-col" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.src + i} className="w-20">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-md border bg-white",
                  i === index ? "border-blue ring-1 ring-blue" : "border-line hover:border-black/40",
                )}
              >
                <Image src={img.src} alt="" fill sizes="5rem" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
