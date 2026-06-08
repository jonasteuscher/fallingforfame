import type { Metadata } from "next";

import { Expandable } from "@/components/ui/Expandable";
import {
  ChapterIntro,
  InteractiveTimeline,
  ScrollySection,
} from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type ProjectPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.site.project.title} | Falling for Fame`,
    description: dictionary.site.project.body,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker="Research design"
          title={dictionary.site.project.title}
          body={dictionary.site.project.body}
        />
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <div className="mx-auto grid max-w-3xl gap-3">
          {dictionary.site.project.sections.map((section) => (
            <Expandable key={section.title} title={section.title}>
              {section.body}
            </Expandable>
          ))}
        </div>
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <InteractiveTimeline items={dictionary.timeline} />
      </ScrollySection>
    </>
  );
}
