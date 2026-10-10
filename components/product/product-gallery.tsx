"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Main image with hover zoom (pointer devices) and a thumbnail strip when there is more than one image. */
export function ProductGallery({ images }: { images: ProductImage[] }) {
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
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden border border-line bg-ivory"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setZoom(null)}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-200 ease-out"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
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
                  "relative block aspect-square w-full overflow-hidden border bg-ivory",
                  i === index ? "border-navy" : "border-line hover:border-navy/50",
                )}
              >
                <Image src={img.src} alt="" fill sizes="5rem" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
