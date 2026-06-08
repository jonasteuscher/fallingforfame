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
    <article className="grid gap-6 border-t border-border py-8 md:grid-cols-[18rem_1fr]">
      <ImageBlock image={athlete.profileImage} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.chapterKicker}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">{athlete.name}</h2>
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
