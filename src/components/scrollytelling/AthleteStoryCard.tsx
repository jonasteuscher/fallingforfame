import Link from "next/link";
import Image from "next/image";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { Athlete } from "@/types/athlete";

type AthleteStoryCardProps = {
  athlete: Athlete;
  locale: Locale;
};

export function AthleteStoryCard({ athlete, locale }: AthleteStoryCardProps) {
  const content = athlete.content[locale];

  return (
    <article className="grid min-w-0 gap-5 border-t border-border py-6 sm:gap-6 sm:py-8 md:grid-cols-[minmax(14rem,18rem)_1fr]">
      <figure className="w-full min-w-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
          {athlete.images.portrait ? (
            <Image
              src={athlete.images.portrait}
              alt=""
              fill
              sizes="(min-width: 768px) 18rem, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm uppercase tracking-wide text-foreground/60">
              Image placeholder
            </div>
          )}
        </div>
      </figure>
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.title}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
          {athlete.name}
        </h2>
        <p className="mt-4 max-w-reading leading-7 text-foreground/74">
          {content.shortBio}
        </p>
        <Link
          href={localizedPath(locale, `/athletes/${athlete.slug}`)}
          className="mt-6 inline-flex border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary"
        >
          Open portrait
        </Link>
      </div>
    </article>
  );
}
