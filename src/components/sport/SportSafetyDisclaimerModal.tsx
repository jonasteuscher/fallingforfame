"use client";

import { useEffect, useId, useRef, useState } from "react";

const safetyWarningStorageKey = "sport-safety-warning-accepted";

type SportSafetyDisclaimerModalProps = {
  content: {
    warningLabel: string;
    headline: string;
    projectTitle: string;
    paragraphs: string[];
    confirmLabel: string;
  };
};

export function SportSafetyDisclaimerModal({
  content,
}: SportSafetyDisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    // sessionStorage is intentionally read only after hydration. The modal is
    // rendered by default on the server so first-time visitors are gated before
    // interacting with the page, while accepted sessions are released client-side.
    let frame = 0;

    try {
      if (sessionStorage.getItem(safetyWarningStorageKey) === "true") {
        frame = window.requestAnimationFrame(() => setIsOpen(false));
      }
    } catch {
      // If storage is unavailable, keep the warning visible and require acknowledgement.
    }

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const currentScrollY = window.scrollY;
    const rootElement = document.documentElement;
    const previousRootOverflow = rootElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    rootElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.requestAnimationFrame(() => dialogRef.current?.focus());

    function getFocusableElements() {
      return Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
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

    function keepFocusInside(event: FocusEvent) {
      const nextTarget = event.target;

      if (
        nextTarget instanceof Node &&
        dialogRef.current &&
        !dialogRef.current.contains(nextTarget)
      ) {
        confirmButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInside);

    return () => {
      rootElement.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, currentScrollY);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
    };
  }, [isOpen]);

  const acknowledgeWarning = () => {
    try {
      // The acknowledgement lasts only for the current browser session.
      sessionStorage.setItem(safetyWarningStorageKey, "true");
    } catch {
      // Storage failures should not prevent visitors from acknowledging the warning.
    }

    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black/76 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[880px] flex-col overflow-hidden border border-white/18 bg-[#06172b] text-foreground shadow-2xl outline-none sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="shrink-0 border-b border-[#DC2626]/65 bg-[#2a1325] px-5 py-6 sm:px-8 sm:py-8">
          <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-[#FCA5A5]">
            <span className="text-4xl leading-none sm:text-5xl" aria-hidden="true">
              ⚠
            </span>
            <span>{content.warningLabel}</span>
          </p>
          <h2
            id={titleId}
            className="mt-4 text-4xl font-semibold uppercase leading-none text-[#FCA5A5] sm:text-5xl lg:text-6xl"
          >
            {content.headline}
          </h2>
        </div>
        <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-base font-semibold leading-7 text-foreground sm:text-lg">
            {content.projectTitle}
          </p>
          <div
            id={descriptionId}
            className="mt-6 space-y-5 text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8"
          >
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex justify-start">
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={acknowledgeWarning}
              className="cursor-pointer border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {content.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
