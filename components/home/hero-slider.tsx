"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Button } from "@/components/ui/button";
import type { CartProduct } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export type HeroSlide =
  | {
      kind: "intro";
      title: string;
      text: string;
      cta: { label: string; href: string };
      secondary?: { label: string; href: string };
      images: { src: string; alt: string }[];
    }
  | {
      kind: "product";
      eyebrow: string;
      title: string;
      text: string;
      href: string;
      image: { src: string; alt: string };
      product: CartProduct;
      inStock: boolean;
    };

const INTERVAL_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const autoplay = playing && !hovered && !focused && !reducedMotion && count > 1;
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, go]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative overflow-hidden border-b border-line bg-ivory"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      {/* All slides share one grid cell, so the section takes the tallest slide's height. */}
      <div className="grid">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "transition-opacity duration-700 ease-out [grid-area:1/1]",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <SlideContent slide={slide} priority={i === 0} />
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="container-site relative -mt-16 flex h-16 items-center gap-3 pb-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="inline-flex size-9 items-center justify-center border border-navy/20 bg-white/80 text-navy hover:border-navy"
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="inline-flex size-9 items-center justify-center border border-navy/20 bg-white/80 text-navy hover:border-navy"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="inline-flex size-9 items-center justify-center border border-navy/20 bg-white/80 text-navy hover:border-navy"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <div className="ml-2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="flex h-9 items-center"
              >
                <span
                  className={cn(
                    "block h-1 transition-all duration-300",
                    i === index ? "w-8 bg-navy" : "w-4 bg-navy/25 hover:bg-navy/50",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SlideContent({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  return (
    <div className="container-site grid items-center gap-8 pt-10 pb-20 sm:pt-14 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pt-16 lg:pb-24">
      <div className="max-w-xl">
        {slide.kind === "product" && <p className="text-sm text-muted">{slide.eyebrow}</p>}
        {priority ? (
          <h1 className="mt-2 font-serif text-[2.5rem] leading-[1.05] font-medium text-navy sm:text-6xl">
            {slide.title}
          </h1>
        ) : (
          <h2 className="mt-2 font-serif text-[2.5rem] leading-[1.05] font-medium text-navy sm:text-6xl">
            {slide.title}
          </h2>
        )}
        <p className="mt-5 text-lg leading-relaxed text-muted">{slide.text}</p>

        {slide.kind === "intro" ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={slide.cta.href}>{slide.cta.label}</Link>
            </Button>
            {slide.secondary && (
              <Button asChild size="lg" variant="outline">
                <Link href={slide.secondary.href}>{slide.secondary.label}</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="mt-6 text-3xl font-semibold text-navy tabular-nums">{formatPrice(slide.product.price)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton product={slide.product} size="lg" disabled={!slide.inStock} />
              <Button asChild size="lg" variant="outline">
                <Link href={slide.href}>View details</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {slide.kind === "intro" ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {slide.images.slice(0, 4).map((img, i) => (
            <div
              key={img.src + i}
              className={cn(
                "relative aspect-square border border-line bg-white",
                slide.images.length === 3 && i === 0 && "row-span-2 aspect-auto",
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-contain p-4"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative mx-auto aspect-square w-full max-w-lg border border-line bg-white">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-contain p-6 sm:p-10"
          />
        </div>
      )}
    </div>
  );
}
