import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/media/ImageGallery";
import {
  AudioStoryBlock,
  ChapterIntro,
  PullQuote,
  ScrollySection,
  StickyMediaBlock,
  VideoStoryBlock,
} from "@/components/scrollytelling";
import { athletes, getAthleteBySlug } from "@/data/athletes";
import { isLocale, locales, type Locale } from "@/i18n/config";

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

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker={content.chapterKicker}
          title={content.chapterTitle}
          body={content.biography}
        />
      </ScrollySection>

      <ScrollySection>
        <StickyMediaBlock media={<ImageGallery images={[athlete.profileImage]} />}>
          <PullQuote quote={content.quote} attribution={athlete.name} />
          <p className="max-w-reading leading-8 text-foreground/76">
            This portrait page is prepared for progressive reveal sections, interview
            excerpts, annotated media and field observation fragments.
          </p>
        </StickyMediaBlock>
      </ScrollySection>

      <ScrollySection fullHeight={false}>
        <ImageGallery images={athlete.gallery} />
      </ScrollySection>

      <ScrollySection fullHeight={false}>
        <AudioStoryBlock
          title="Audio interview"
          body="Reusable audio storytelling block with native controls and transcript support."
          audio={athlete.featuredAudio}
        />
      </ScrollySection>

      <ScrollySection fullHeight={false}>
        <VideoStoryBlock
          title="Documentary video"
          body="Reusable video storytelling block prepared for documentary excerpts, drone footage and observation material."
          video={athlete.featuredVideo}
        />
      </ScrollySection>
    </>
  );
}
