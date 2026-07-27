"use client";

import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { AthleteImage } from "@/types/athlete";

type AthleteGalleryLightboxProps = {
  images: AthleteImage[];
  locale: Locale;
  initialVisibleCount?: number;
  viewAllLabel?: string;
  showLessLabel?: string;
};

const labels = {
  en: {
    close: "Close full-size image",
    next: "Next image",
    previous: "Previous image",
    open: "Open image full size",
    counter: "Image",
  },
  de: {
    close: "Bildansicht schliessen",
    next: "Naechstes Bild",
    previous: "Vorheriges Bild",
    open: "Bild in voller Groesse oeffnen",
    counter: "Bild",
  },
} as const;

const thumbnailSizes =
  "(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw";
const lightboxSizes =
  "(min-width: 1280px) 1280px, (min-width: 768px) 90vw, 100vw";

export function AthleteGalleryLightbox({
  images,
  locale,
  initialVisibleCount,
  viewAllLabel,
  showLessLabel,
}: AthleteGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const text = labels[locale];
  const warmedImages = useRef(new Set<string>());
  const hasHiddenImages =
    initialVisibleCount !== undefined && images.length > initialVisibleCount;
  const visibleImages =
    hasHiddenImages && !isExpanded
      ? images.slice(0, initialVisibleCount)
      : images;

  const lightboxPreloadProps = useMemo(
    () =>
      images.map((image) => {
        const { props } = getImageProps({
          src: image.src,
          alt: "",
          width: 1600,
          height: 1200,
          quality: 72,
          sizes: lightboxSizes,
        });

        return {
          src: props.src,
          srcSet: props.srcSet,
          sizes: props.sizes,
        };
      }),
    [images],
  );

  const warmImage = useCallback((index: number) => {
    if (typeof window === "undefined") {
      return;
    }

    const image = lightboxPreloadProps[index];

    if (!image || warmedImages.current.has(image.src)) {
      return;
    }

    warmedImages.current.add(image.src);

    const preloadImage = new window.Image();
    preloadImage.decoding = "async";
    preloadImage.sizes = image.sizes ?? lightboxSizes;
    preloadImage.srcset = image.srcSet ?? "";
    preloadImage.src = image.src;
  }, [lightboxPreloadProps]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? current
            : (current - 1 + images.length) % images.length,
        );
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (activeIndex === null || images.length <= 1) {
      return;
    }

    warmImage((activeIndex + 1) % images.length);
    warmImage((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, warmImage]);

  function showPrevious() {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length,
    );
  }

  return (
    <>
      <ul
        className="grid grid-cols-1 items-start gap-5 md:grid-cols-12"
        data-gallery-layout="editorial-grid"
        data-gallery-count={visibleImages.length}
      >
        {visibleImages.map((image, index) => (
          <li
            key={image.src}
            className={[
              "self-start overflow-hidden border border-border bg-surface motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0",
              getGalleryItemClassName(visibleImages.length, index),
            ].join(" ")}
            style={{ animationDelay: `${(index % 6) * 80}ms` }}
          >
            <button
              type="button"
              className={[
                "group block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                visibleImages.length === 6 ? "aspect-[2/3] overflow-hidden" : "h-auto",
              ].join(" ")}
              aria-label={`${text.open}: ${image.alt[locale]}`}
              onFocus={() => warmImage(index)}
              onClick={() => setActiveIndex(index)}
              onPointerEnter={() => warmImage(index)}
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                width={image.width ?? 1200}
                height={image.height ?? 900}
                sizes={thumbnailSizes}
                quality={68}
                className={
                  visibleImages.length === 6
                    ? "h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                    : "h-auto w-full cursor-pointer object-contain transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                }
              />
            </button>
          </li>
        ))}
      </ul>

      {hasHiddenImages ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          className="mt-8 inline-flex min-h-12 cursor-pointer items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {isExpanded
            ? (showLessLabel ?? text.previous)
            : (viewAllLabel ?? text.next)}
        </button>
      ) : null}

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex min-h-svh items-center justify-center bg-background/94 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt[locale]}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer"
            aria-label={text.close}
            onClick={() => setActiveIndex(null)}
          />

          <div className="relative z-10 flex h-full max-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col gap-4 sm:max-h-[calc(100svh-3rem)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground/72">
                {text.counter} {(activeIndex ?? 0) + 1} / {images.length}
              </p>
              <button
                type="button"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-border bg-surface text-xl font-semibold text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={text.close}
                onClick={() => setActiveIndex(null)}
              >
                X
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Image
                src={activeImage.src}
                alt={activeImage.alt[locale]}
                fill
                sizes={lightboxSizes}
                quality={72}
                loading="eager"
                fetchPriority="high"
                className="object-contain"
              />
            </div>

            {images.length > 1 ? (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-1 sm:px-3">
                <button
                  type="button"
                  className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center border border-border bg-surface/92 text-2xl font-semibold text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label={text.previous}
                  onClick={showPrevious}
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center border border-border bg-surface/92 text-2xl font-semibold text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label={text.next}
                  onClick={showNext}
                >
                  {">"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function getGalleryItemClassName(count: number, index: number) {
  const patterns: Record<number, string[]> = {
    6: [
      "md:col-span-6 xl:col-span-4",
      "md:col-span-6 xl:col-span-4",
      "md:col-span-6 xl:col-span-4",
      "md:col-span-6 xl:col-span-4",
      "md:col-span-6 xl:col-span-4",
      "md:col-span-6 xl:col-span-4",
    ],
    8: [
      "md:col-span-7",
      "md:col-span-5",
      "md:col-span-4",
      "md:col-span-4",
      "md:col-span-4",
      "md:col-span-6",
      "md:col-span-6",
      "md:col-span-12",
    ],
    9: [
      "md:col-span-7",
      "md:col-span-5",
      "md:col-span-4",
      "md:col-span-4",
      "md:col-span-4",
      "md:col-span-6",
      "md:col-span-6",
      "md:col-span-5",
      "md:col-span-7",
    ],
  };

  return patterns[count]?.[index] ?? "md:col-span-4";
}
