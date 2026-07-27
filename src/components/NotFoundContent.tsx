import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";

type NotFoundCopy = {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
};

type NotFoundContentProps = {
  locale: Locale;
  copy: NotFoundCopy;
  as?: "main" | "section";
};

export function NotFoundContent({
  locale,
  copy,
  as = "section",
}: NotFoundContentProps) {
  const Wrapper = as;

  return (
    <Wrapper
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/18 bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {copy.eyebrow}
          </p>
          <p
            className="mt-8 text-[clamp(5rem,20vw,14rem)] font-semibold leading-none text-foreground/8"
            aria-hidden="true"
          >
            404
          </p>
          <h1
            id="not-found-title"
            className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
          >
            {copy.title}
          </h1>
          <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/78 sm:text-xl sm:leading-9">
            {copy.description}
          </p>
          <Link
            href={localizedPath(locale)}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/88 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {copy.button}
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}
