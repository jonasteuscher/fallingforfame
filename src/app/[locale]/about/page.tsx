import type { Metadata } from "next";

import { Expandable } from "@/components/ui/Expandable";
import {
  ChapterIntro,
  InteractiveTimeline,
  ScrollySection,
} from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker="Research design"
          title={dictionary.site.about.title}
          body={dictionary.site.about.body}
        />
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <div className="mx-auto max-w-3xl">
          <Expandable title="Academic research">
            Literature review, research questions and thesis argumentation can live in
            structured chapter content.
          </Expandable>
          <Expandable title="Field documentation">
            Observation notes, photography, audio interviews and documentary video can
            be attached to chapters and athlete profiles.
          </Expandable>
          <Expandable title="Accessibility">
            Media components include native controls, captions and transcript slots so
            content can stay accessible as it grows.
          </Expandable>
        </div>
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <InteractiveTimeline items={dictionary.timeline} />
      </ScrollySection>
    </>
  );
}
