import type { Metadata } from "next";

import { ImageBlock } from "@/components/media/ImageBlock";
import {
  ChapterDivider,
  ChapterIntro,
  ImageStoryBlock,
  InteractiveTimeline,
  ScrollySection,
  StatisticBlock,
  StickyMediaBlock,
} from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Falling for Fame",
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker={dictionary.site.home.kicker}
          title={dictionary.site.home.title}
          body={`${dictionary.site.home.subtitle} ${dictionary.site.home.intro}`}
        />
      </ScrollySection>

      <ChapterDivider label="Scrollytelling framework" />

      <ScrollySection>
        <StickyMediaBlock
          media={<ImageBlock image={dictionary.chapters[0].image} priority />}
        >
          {dictionary.chapters.map((chapter) => (
            <article key={chapter.id} className="min-h-[60vh]">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {chapter.kicker}
              </p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground">
                {chapter.title}
              </h2>
              <p className="mt-5 leading-8 text-foreground/76">{chapter.body}</p>
            </article>
          ))}
        </StickyMediaBlock>
      </ScrollySection>

      <ScrollySection fullHeight={false}>
        <div className="grid gap-4 md:grid-cols-3">
          {dictionary.statistics.map((statistic) => (
            <StatisticBlock
              key={statistic.label}
              value={statistic.value}
              label={statistic.label}
              detail={statistic.detail}
            />
          ))}
        </div>
      </ScrollySection>

      <ScrollySection fullHeight={false}>
        <InteractiveTimeline items={dictionary.timeline} />
      </ScrollySection>

      <ScrollySection>
        <ImageStoryBlock
          title={dictionary.chapters[1].title}
          body={dictionary.chapters[1].body}
        />
      </ScrollySection>
    </>
  );
}
