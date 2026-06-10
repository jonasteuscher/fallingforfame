import Link from "next/link";

import { ImageBlock } from "@/components/media/ImageBlock";
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
      <ImageBlock image={athlete.profileImage} />
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.chapterKicker}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
          {athlete.name}
        </h2>
        <p className="mt-4 max-w-reading leading-7 text-foreground/74">
          {content.biography}
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
