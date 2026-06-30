"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { AthleteImage } from "@/types/athlete";

type AthleteGalleryLightboxProps = {
  images: AthleteImage[];
  locale: Locale;
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

export function AthleteGalleryLightbox({
  images,
  locale,
}: AthleteGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const text = labels[locale];

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
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <li
            key={image.src}
            className="overflow-hidden border border-border bg-surface"
          >
            <button
              type="button"
              className="group block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`${text.open}: ${image.alt[locale]}`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

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
                sizes="100vw"
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
