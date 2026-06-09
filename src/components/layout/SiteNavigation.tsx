"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import brandMark from "@/app/icon.png";
import { locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";

type NavigationLink = {
  href: string;
  label: string;
};

type SiteNavigationProps = {
  locale: Locale;
  links: NavigationLink[];
  labels: {
    menu: string;
    language: string;
    openMenu: string;
    closeMenu: string;
    openMenuShort: string;
    closeMenuShort: string;
  };
};

export function SiteNavigation({ locale, links, labels }: SiteNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => buttonRef.current?.focus());
    }
  };
  const languageLinks = locales.map((nextLocale) => ({
    locale: nextLocale,
    href: localizedCurrentPath(pathname, nextLocale),
  }));
  const openMenu = () => {
    setPortalContainer(document.body);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusableElements?.[0];
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || !focusableElements?.length) {
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const mobileMenu =
    isOpen && portalContainer
      ? createPortal(
          <div
            className="fixed left-0 top-0 z-[100] h-[100dvh] w-screen overflow-y-auto bg-background text-foreground md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={labels.menu}
          >
            <div
              id={menuId}
              ref={menuRef}
              className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6">
                <Link
                  href={links[0]?.href ?? localizedPath(locale)}
                  onClick={() => closeMenu()}
                  className="inline-flex min-w-0 items-center gap-2 font-semibold uppercase focus-visible:rounded-sm"
                >
                  <Image
                    src={brandMark}
                    alt=""
                    width={34}
                    height={34}
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                  <span className="truncate">Falling for Fame?</span>
                </Link>
                <button
                  type="button"
                  onClick={() => closeMenu(true)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-2xl leading-none text-foreground transition hover:border-primary focus-visible:border-primary"
                  aria-label={labels.closeMenu}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6">
                <section aria-labelledby={`${menuId}-navigation`}>
                  <h2
                    id={`${menuId}-navigation`}
                    className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground/62"
                  >
                    {labels.menu}
                  </h2>
                  <div className="grid gap-3">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => closeMenu()}
                        className="rounded-sm border border-border bg-surface px-4 py-4 text-base font-medium text-foreground transition hover:border-primary focus-visible:border-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <section
                  className="border-t border-border pt-6"
                  aria-labelledby={`${menuId}-language`}
                >
                  <h2
                    id={`${menuId}-language`}
                    className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground/62"
                  >
                    {labels.language}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {languageLinks.map((link) => (
                      <Link
                        key={link.locale}
                        href={link.href}
                        onClick={() => closeMenu()}
                        aria-current={link.locale === locale ? "page" : undefined}
                        className="rounded-sm border border-border px-4 py-4 text-center font-semibold uppercase text-foreground/80 aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                      >
                        {link.locale.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>,
          portalContainer,
        )
      : null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="hidden items-center gap-3 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-sm px-2 py-1 text-foreground/80 transition hover:text-foreground focus-visible:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <div className="flex gap-1 border-l border-border pl-3">
          {languageLinks.map((link) => (
            <Link
              key={link.locale}
              href={link.href}
              aria-current={link.locale === locale ? "page" : undefined}
              className="rounded-sm px-2 py-1 uppercase text-foreground/70 aria-[current=page]:bg-surface aria-[current=page]:text-foreground"
            >
              {link.locale.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => {
          if (isOpen) {
            closeMenu(true);
          } else {
            openMenu();
          }
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground transition hover:border-primary focus-visible:border-primary md:hidden"
      >
        <span className="sr-only">
          {isOpen ? labels.closeMenuShort : labels.openMenuShort}
        </span>
        <span aria-hidden="true" className="flex h-4 w-5 flex-col justify-between">
          <span
            className={`h-0.5 w-full bg-current transition ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-current transition ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-current transition ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>
      {mobileMenu}
    </div>
  );
}

function localizedCurrentPath(pathname: string | null, locale: Locale) {
  if (!pathname) {
    return localizedPath(locale);
  }

  const pathWithoutLocale = pathname.replace(/^\/(en|de)(?=\/|$)/, "");
  return localizedPath(locale, pathWithoutLocale || "/");
}
