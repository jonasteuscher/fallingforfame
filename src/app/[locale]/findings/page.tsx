import type { Metadata } from "next";

import { ChapterIntro, FindingCard, ScrollySection } from "@/components/scrollytelling";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

type FindingsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "Findings",
};

export default async function FindingsPage({ params }: FindingsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ScrollySection>
        <ChapterIntro
          kicker="Research findings"
          title={dictionary.site.findings.title}
          body={dictionary.site.findings.intro}
        />
      </ScrollySection>
      <ScrollySection fullHeight={false}>
        <div className="grid gap-4 md:grid-cols-3">
          {dictionary.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </ScrollySection>
    </>
  );
}
