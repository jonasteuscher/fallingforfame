import type { Metadata } from "next";

import { ProjectChapterIndicator } from "@/components/project/ProjectChapterIndicator";
import { ProjectPage as ProjectPageContent } from "@/components/project/ProjectPage";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createLocalizedMetadata } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: "/project",
    title: dictionary.site.project.title,
    description: dictionary.site.project.body,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <ProjectChapterIndicator
        chapters={dictionary.site.project.chapterIndicator}
        hiddenUntilId="the-documentary"
      />
      <ProjectPageContent content={dictionary.site.project} />
    </>
  );
}
