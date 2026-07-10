import Image from "next/image";

import type { Athlete } from "@/types/athlete";

type AthleteHeroProps = {
  athlete: Athlete;
  title: string;
  meta: string;
  quote?: string;
  scrollHint: string;
};

export function AthleteHero({
  athlete,
  title,
  meta,
  quote,
  scrollHint,
}: AthleteHeroProps) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-end overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 xl:px-10">
      <div className="absolute inset-0 -z-20 bg-surface" aria-hidden="true">
        {athlete.images.hero ? (
          <Image
            src={athlete.images.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,var(--surface-muted),transparent_32%),linear-gradient(135deg,var(--background)_0%,var(--surface)_52%,var(--accent)_100%)]" />
        )}
      </div>
      <div className="absolute inset-0 -z-10 bg-background/62" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-background via-background/82 to-background/0" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 sm:gap-9">
        <div className="max-w-5xl min-[700px]:pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {title}
          </p>
          <h1 className="mt-4 break-words text-5xl font-semibold leading-[0.95] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_90ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-5 sm:text-7xl xl:text-8xl">
            {athlete.name}
          </h1>
          <p className="mt-5 break-words text-sm font-semibold uppercase tracking-wide text-foreground/76 [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_180ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-6">
            {meta}
          </p>
          {quote ? (
            <blockquote className="relative mt-6 max-w-[42rem] border-l-2 border-primary pl-5 text-foreground/82 motion-safe:animate-[fade-in-up_700ms_ease-out_270ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 sm:mt-8 sm:pl-7">
              <span
                className="pointer-events-none absolute -left-1 top-0 -translate-x-full text-[clamp(3.5rem,12vw,7.5rem)] font-semibold leading-none text-primary/38"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="max-w-full break-words text-[clamp(1.25rem,2.2vw,2rem)] font-medium leading-[1.35] [overflow-wrap:anywhere]">
                {quote}
              </p>
            </blockquote>
          ) : null}
        </div>
        <div className="flex max-w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/72 motion-safe:animate-[fade-in-up_700ms_ease-out_360ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
          <span className="h-px w-12 bg-primary" aria-hidden="true" />
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">
            {scrollHint}
          </span>
        </div>
      </div>
    </section>
  );
}
