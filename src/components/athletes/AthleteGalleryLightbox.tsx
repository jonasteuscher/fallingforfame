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

const thumbnailSizes = "(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw";
const lightboxSizes = "(min-width: 1280px) 1280px, (min-width: 768px) 90vw, 100vw";

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
  const activeCaptionId = activeIndex === null ? undefined : `athlete-gallery-caption-${activeIndex}`;
  const text = labels[locale];
  const warmedImages = useRef(new Set<string>());
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const hasHiddenImages =
    initialVisibleCount !== undefined && images.length > initialVisibleCount;
  const visibleImages =
    hasHiddenImages && !isExpanded ? images.slice(0, initialVisibleCount) : images;

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

  const warmImage = useCallback(
    (index: number) => {
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
    },
    [lightboxPreloadProps],
  );

  const closeLightbox = useCallback(() => {
    setActiveIndex((current) => {
      if (current !== null) {
        window.requestAnimationFrame(() => thumbnailRefs.current[current]?.focus());
      }

      return null;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    function getFocusableElements() {
      return Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % images.length,
        );
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + images.length) % images.length,
        );
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, images.length]);

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
        className="grid auto-rows-[minmax(6rem,1fr)] grid-cols-3 gap-2 md:auto-rows-auto md:grid-cols-2 md:gap-5 lg:gap-6 xl:grid-cols-3"
        data-gallery-layout="editorial-grid"
        data-gallery-count={visibleImages.length}
      >
        {visibleImages.map((image, index) => {
          const layout = getGalleryImageLayout(image);

          return (
            <li
              key={image.src}
              className={[
                "min-w-0 motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 md:self-start",
                getGalleryItemClassName(index),
              ].join(" ")}
              style={{ animationDelay: `${(index % 6) * 80}ms` }}
              data-gallery-orientation={layout.orientation}
              data-gallery-featured={image.featured ?? "false"}
            >
              <button
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                className="group block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                aria-label={`${text.open}: ${image.alt[locale]}`}
                onFocus={() => warmImage(index)}
                onClick={() => setActiveIndex(index)}
                onPointerEnter={() => warmImage(index)}
              >
                <span
                  className={[
                    "relative block h-full min-h-24 overflow-hidden border border-border bg-surface md:min-h-0",
                    layout.aspectClassName,
                  ].join(" ")}
                >
                  <Image
                    src={image.src}
                    alt={image.alt[locale]}
                    width={image.width ?? 1200}
                    height={image.height ?? 900}
                    sizes={thumbnailSizes}
                    quality={68}
                    className="h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none"
                    style={{ objectPosition: getObjectPosition(image) }}
                  />
                  <span
                    className="pointer-events-none absolute inset-0 border border-transparent transition duration-300 group-hover:border-primary/60 group-focus-visible:border-primary motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {hasHiddenImages ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          className="mt-8 inline-flex min-h-12 cursor-pointer items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {isExpanded ? (showLessLabel ?? text.previous) : (viewAllLabel ?? text.next)}
        </button>
      ) : null}

      {activeImage ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex min-h-svh items-center justify-center bg-background/94 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt[locale]}
          aria-describedby={
            activeImage.caption || activeImage.credit ? activeCaptionId : undefined
          }
          tabIndex={-1}
        >
          <div
            className="absolute inset-0 cursor-pointer"
            aria-hidden="true"
            onClick={closeLightbox}
          />

          <div className="relative z-10 flex h-full max-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col gap-4 sm:max-h-[calc(100svh-3rem)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground/72">
                {text.counter} {(activeIndex ?? 0) + 1} / {images.length}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-border bg-surface text-xl font-semibold text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={text.close}
                onClick={closeLightbox}
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

            {activeImage.caption || activeImage.credit ? (
              <p
                id={activeCaptionId}
                className="max-w-3xl text-sm leading-relaxed text-foreground/72"
              >
                {activeImage.caption ? activeImage.caption[locale] : null}
                {activeImage.caption && activeImage.credit ? " " : null}
                {activeImage.credit ? activeImage.credit[locale] : null}
              </p>
            ) : null}

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

type GalleryImageLayout = {
  orientation: "landscape" | "portrait";
  aspectClassName: string;
};

function getGalleryImageLayout(image: AthleteImage): GalleryImageLayout {
  const orientation =
    image.orientation ??
    ((image.width ?? 1) >= (image.height ?? 1) ? "landscape" : "portrait");

  return {
    orientation,
    aspectClassName: "aspect-[4/3]",
  };
}

function getGalleryItemClassName(index: number) {
  if (index === 0) {
    return "col-span-2 row-span-2 md:col-span-1 md:row-span-1";
  }

  return "";
}

function getObjectPosition(image: AthleteImage) {
  if (typeof image.objectPosition === "string") {
    return image.objectPosition;
  }

  return image.objectPosition?.desktop ?? image.objectPosition?.tablet ?? "50% 50%";
}
