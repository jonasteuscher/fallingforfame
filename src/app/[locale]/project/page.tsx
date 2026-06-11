import type { Metadata } from "next";
import Image from "next/image";

import { InteractiveTimeline, ScrollySection } from "@/components/scrollytelling";
import { ProjectChapterIndicator } from "@/components/project/ProjectChapterIndicator";
import { ProjectDocumentationChapter } from "@/components/project/ProjectDocumentationChapter";
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
      <div className="lg:pr-40 2xl:pr-0">
        <section
          id="project-hero"
          className="relative flex min-h-[calc(100dvh-4rem)] overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
        >
          <Image
            src="/images/project/hero.JPG"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_88%,transparent)_0%,color-mix(in_srgb,var(--background)_62%,transparent)_42%,color-mix(in_srgb,var(--background)_18%,transparent)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/68 to-transparent"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
              {dictionary.site.project.heroKicker}
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-none text-foreground min-[380px]:text-6xl md:text-8xl lg:text-9xl">
              {dictionary.site.project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/78 md:text-2xl md:leading-9">
              {dictionary.site.project.body}
            </p>
          </div>
        </section>
        <ProjectDocumentationChapter content={dictionary.site.project.documentation} />
        <ScrollySection id="project-process" fullHeight={false}>
          <InteractiveTimeline items={dictionary.timeline} />
        </ScrollySection>
      </div>
    </>
  );
}
