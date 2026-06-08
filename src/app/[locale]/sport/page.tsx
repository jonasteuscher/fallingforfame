import type { Metadata } from "next";

import { Expandable } from "@/components/ui/Expandable";
import { ChapterIntro, ScrollySection } from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type SportPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: SportPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return {
    title: `${dictionary.site.sport.title} | Falling for Fame`,
    description: dictionary.site.sport.body,
  };
}

export default async function SportPage({ params }: SportPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker="BASE jumping context"
          title={dictionary.site.sport.title}
          body={dictionary.site.sport.body}
        />
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <div className="mx-auto grid max-w-3xl gap-3">
          {dictionary.site.sport.sections.map((section) => (
            <Expandable key={section.title} title={section.title}>
              {section.body}
            </Expandable>
          ))}
        </div>
      </ScrollySection>
    </>
  );
}
