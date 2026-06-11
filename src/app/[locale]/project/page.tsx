import type { Metadata } from "next";

import { ProjectChapterIndicator } from "@/components/project/ProjectChapterIndicator";
import { ProjectPage as ProjectPageContent } from "@/components/project/ProjectPage";
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
    title: `${dictionary.site.project.title} | Falling for Fame?`,
    description: dictionary.site.project.body,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const dictionary = getDictionary(locale);

  return (
    <>
      <ProjectChapterIndicator chapters={dictionary.site.project.chapterIndicator} />
      <ProjectPageContent content={dictionary.site.project} />
    </>
  );
}
