import Image from "next/image";

import type { Athlete } from "@/types/athlete";

type AthleteHeroProps = {
  athlete: Athlete;
  title: string;
  meta: string;
  scrollHint: string;
};

export function AthleteHero({ athlete, title, meta, scrollHint }: AthleteHeroProps) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-end overflow-hidden px-4 pb-14 pt-28 sm:px-6 xl:px-10">
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
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background to-background/0" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <div className="max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {title}
          </p>
          <h1 className="mt-5 break-words text-5xl font-semibold leading-[0.95] text-foreground [overflow-wrap:anywhere] sm:text-7xl xl:text-8xl">
            {athlete.name}
          </h1>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-foreground/72">
            {meta}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
          <span className="h-px w-12 bg-primary" aria-hidden="true" />
          <span>{scrollHint}</span>
        </div>
      </div>
    </section>
  );
}
