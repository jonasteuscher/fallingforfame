"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const mobileExperienceNoticeStorageKey =
  "falling-for-fame-mobile-notice-dismissed";

const mobileViewportQuery = "(max-width: 767px)";

export type MobileExperienceNoticeContent = {
  eyebrow: string;
  title: string;
  body: string;
  supportingText: string;
  button: string;
  closeLabel: string;
};

type MobileExperienceNoticeProps = {
  content: MobileExperienceNoticeContent;
};

export function MobileExperienceNotice({ content }: MobileExperienceNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dismissedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;

    try {
      localStorage.setItem(mobileExperienceNoticeStorageKey, "true");
    } catch {
      // Storage can fail in private browsing or strict privacy modes. The
      // notice should still close for the current view.
    }

    setIsOpen(false);
  }, []);

  useEffect(() => {
    try {
      dismissedRef.current =
        localStorage.getItem(mobileExperienceNoticeStorageKey) === "true";
    } catch {
      dismissedRef.current = false;
    }

    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(mobileViewportQuery);

    const syncVisibility = () => {
      setIsOpen(mediaQuery.matches && !dismissedRef.current);
    };

    syncVisibility();
    mediaQuery.addEventListener("change", syncVisibility);

    return () => {
      mediaQuery.removeEventListener("change", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const currentScrollY = window.scrollY;
    const rootElement = document.documentElement;
    const previousRootOverflow = rootElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    rootElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = "100%";

    primaryButtonRef.current?.focus();

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
        dismiss();
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
        primaryButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInside);

    return () => {
      rootElement.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, currentScrollY);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
      restoreFocusRef.current?.focus();
    };
  }, [dismiss, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex min-h-[100dvh] items-end justify-center overflow-hidden bg-black/72 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 backdrop-blur-sm sm:hidden">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-notice-title"
        aria-describedby="mobile-notice-description"
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[28rem] overflow-y-auto border border-white/18 bg-[#0A1A2F] px-5 pb-5 pt-6 text-foreground shadow-2xl outline-none motion-safe:animate-[fade-in-up_260ms_ease-out_forwards]"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={content.closeLabel}
          className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-2xl leading-none text-foreground/72 transition hover:bg-white/8 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true">×</span>
        </button>

        <p className="pr-12 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {content.eyebrow}
        </p>
        <h2
          id="mobile-notice-title"
          className="mt-4 max-w-[12ch] text-4xl font-semibold uppercase leading-[0.95] text-foreground"
        >
          {content.title}
        </h2>
        <div
          id="mobile-notice-description"
          className="mt-5 space-y-4 text-base leading-7 text-foreground/78"
        >
          <p>{content.body}</p>
          <p>{content.supportingText}</p>
        </div>
        <button
          ref={primaryButtonRef}
          type="button"
          onClick={dismiss}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-primary bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {content.button}
        </button>
      </div>
    </div>
  );
}
