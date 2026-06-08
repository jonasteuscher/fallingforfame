import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImageBlock } from "@/components/media/ImageBlock";
import { ImageGallery } from "@/components/media/ImageGallery";
import {
  AthleteExperienceCards,
  ChapterIntro,
  PullQuote,
  ScrollySection,
  StickyMediaBlock,
} from "@/components/scrollytelling";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import type { Athlete } from "@/types/athlete";

type AthletePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: AthletePageProps): Promise<Metadata> {
  const { slug } = await params;
  const athlete = getAthleteBySlug(slug);

  return {
    title: athlete ? athlete.name : "Athlete",
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    athletes.map((athlete) => ({
      locale,
      slug: athlete.slug,
    })),
  );
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const athlete = getAthleteBySlug(slug);

  if (!athlete) {
    notFound();
  }

  const content = athlete.content[locale];
  const dictionary = getDictionary(locale);
  const athleteMeta = formatAthleteMeta(athlete, dictionary.athleteMeta);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker={content.chapterKicker}
          title={content.chapterTitle}
          meta={athleteMeta}
          body={content.biography}
        />
      </ScrollySection>

      <ScrollySection fullHeight={false} className="pt-0">
        <AthleteExperienceCards
          experience={athlete.experience}
          labels={dictionary.athleteExperience}
          locale={locale}
        />
      </ScrollySection>

      <ScrollySection>
        <StickyMediaBlock media={<ImageBlock image={athlete.profileImage} />}>
          <PullQuote quote={content.quote} attribution={athlete.name} />
          <p className="max-w-reading leading-8 text-foreground/76">
            This portrait page is prepared for progressive reveal sections, interview
            excerpts, annotated media and field observation fragments.
          </p>
        </StickyMediaBlock>
      </ScrollySection>

      {athlete.gallery && athlete.gallery.length > 0 ? (
        <ScrollySection fullHeight={false}>
          <ImageGallery images={athlete.gallery} />
        </ScrollySection>
      ) : null}
    </>
  );
}

function formatAthleteMeta(
  athlete: Athlete,
  labels: {
    from: string;
    fromUnknown: string;
    ageUnknown: string;
    years: string;
    countries: Record<string, string>;
  },
) {
  const country = athlete.country
    ? (labels.countries[athlete.country] ?? athlete.country)
    : null;
  const countryText = country ? `${labels.from} ${country}` : labels.fromUnknown;
  const ageText =
    athlete.age === null ? labels.ageUnknown : `${athlete.age} ${labels.years}`;

  return `${countryText} | ${ageText}`;
}
