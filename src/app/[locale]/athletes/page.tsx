import type { Metadata } from "next";

import {
  AthleteStoryCard,
  ChapterIntro,
  ScrollySection,
} from "@/components/scrollytelling";
import { athletes } from "@/data/athletes";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type AthletesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Athletes",
};

export default async function AthletesPage({ params }: AthletesPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker={dictionary.site.home.kicker}
          title={dictionary.site.athletes.title}
          body={dictionary.site.athletes.intro}
        />
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <div className="space-y-6">
          {athletes.map((athlete) => (
            <AthleteStoryCard key={athlete.slug} athlete={athlete} locale={locale} />
          ))}
        </div>
      </ScrollySection>
    </>
  );
}
