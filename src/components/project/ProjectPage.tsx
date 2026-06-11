import Image from "next/image";

import type { project as projectContent } from "@/content/en/project";
import { ProjectBehindScenes } from "@/components/project/ProjectDocumentationChapter";

type ProjectContent = typeof projectContent;

type ProjectPageProps = {
  content: ProjectContent;
};

export function ProjectPage({ content }: ProjectPageProps) {
  return (
    <article className="bg-background text-foreground">
      <ProjectHero content={content} />
      <DocumentaryChapter content={content.documentary} />
      <section id="behind-the-scenes">
        <ProjectBehindScenes content={content.documentation.gallery} />
      </section>
      <ResearchChapter content={content.research} />
      <ResearchJourney content={content.journey} />
      <ProjectGoals content={content.goals} />
      <ThesisChapter content={content.thesis} />
      <Credits content={content.credits} />
    </article>
  );
}

function ProjectHero({ content }: { content: ProjectContent }) {
  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] overflow-hidden px-4 py-20 sm:px-6 lg:px-10">
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
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_76%,transparent)_44%,color-mix(in_srgb,var(--background)_16%,transparent)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/72 to-transparent"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
          {content.heroKicker}
        </p>
        <h1 className="max-w-5xl text-5xl font-semibold leading-none text-foreground min-[380px]:text-6xl md:text-8xl lg:text-9xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/78 md:text-2xl md:leading-9">
          {content.body}
        </p>
        <div className="mt-12 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
          <span className="h-px w-12 bg-primary" aria-hidden="true" />
          <span>{content.scrollCta}</span>
        </div>
      </div>
    </section>
  );
}

function DocumentaryChapter({
  content,
}: {
  content: ProjectContent["documentary"];
}) {
  return (
    <section id="the-documentary" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.48fr_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {content.title}
          </h2>
        </aside>
        <div className="space-y-10">
          <div className="max-w-reading space-y-5 text-lg leading-8 text-foreground/76">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid gap-4">
            {content.statements.map((statement, index) => (
              <p
                key={statement}
                className="border-t border-primary pt-5 text-3xl font-semibold leading-tight text-foreground sm:text-5xl"
              >
                <span className="mb-3 block font-mono text-sm text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {statement}
              </p>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {content.cards.map((card) => (
              <article key={card.title} className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {card.label}
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-foreground">
                  {card.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-foreground/72">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchChapter({ content }: { content: ProjectContent["research"] }) {
  return (
    <section
      id="the-research"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <Image
        src="/images/sport/hero1.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-28"
      />
      <div className="absolute inset-0 bg-background/84" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.5fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {content.label}
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
              {content.title}
            </h2>
          </div>
          <p className="max-w-reading text-lg leading-8 text-foreground/76">
            {content.intro}
          </p>
        </div>
        <div className="my-14 border-y border-primary py-10 sm:my-20 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.questionLabel}
          </p>
          <blockquote className="mt-5 max-w-6xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.question}
          </blockquote>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.context.map((item) => (
            <article key={item.title} className="border border-border bg-surface/80 p-5">
              <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-foreground/72">
                {item.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-12 max-w-4xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
          {content.objective}
        </p>
      </div>
    </section>
  );
}

function ThesisChapter({ content }: { content: ProjectContent["thesis"] }) {
  return (
    <section id="bachelor-thesis" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.52fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {content.title}
          </h2>
          <div className="mt-6 max-w-reading space-y-5 text-lg leading-8 text-foreground/76">
            {content.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <article className="border border-primary bg-surface p-4 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[0.42fr_1fr]">
            <div className="flex aspect-[3/4] flex-col justify-between border border-border bg-background p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                {content.fileType}
              </div>
              <div className="text-6xl font-semibold leading-none text-primary">
                {content.pdfLabel}
              </div>
              <div className="h-2 w-2/3 bg-primary" aria-hidden="true" />
            </div>
            <div className="flex flex-col justify-between gap-8 p-1">
              <div>
                <h3 className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                  {content.fileName}
                </h3>
                <p className="mt-4 text-base leading-7 text-foreground/68">
                  {content.fileMeta}
                </p>
              </div>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed border border-primary bg-primary px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide text-background opacity-70 md:w-fit"
              >
                {content.button}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function ResearchJourney({ content }: { content: ProjectContent["journey"] }) {
  return (
    <section id="research-journey" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {content.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-foreground/72">{content.intro}</p>
        </aside>
        <ol className="grid gap-5 border-l border-border">
          {content.steps.map((step, index) => (
            <li key={step.title} className="relative pl-6 sm:pl-8">
              <span
                className="absolute -left-[9px] top-1 grid size-4 place-items-center bg-primary"
                aria-hidden="true"
              />
              <article className="grid min-h-40 gap-4 border border-border bg-surface/72 p-5 md:grid-cols-[9rem_1fr] md:items-start">
                <p className="font-mono text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="text-3xl font-semibold leading-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/72">
                    {step.body}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectGoals({ content }: { content: ProjectContent["goals"] }) {
  return (
    <section id="project-goals" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.label}
        </p>
        <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
          {content.title}
        </h2>
        <div className="mt-12 grid gap-5">
          {content.statements.map((statement) => (
            <p
              key={statement}
              className="border-t border-border pt-5 text-3xl font-semibold leading-tight text-foreground sm:text-5xl"
            >
              {statement}
            </p>
          ))}
        </div>
        <p className="mt-20 max-w-5xl text-5xl font-semibold leading-tight text-primary sm:text-7xl lg:text-8xl">
          {content.closing}
        </p>
      </div>
    </section>
  );
}

function Credits({ content }: { content: ProjectContent["credits"] }) {
  return (
    <section id="credits" className="border-t border-border px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {content.label}
        </p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
          {content.title}
        </h2>
        <dl className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          {content.items.map((item) => (
            <div key={item.label} className="bg-background p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.label}
              </dt>
              <dd className="mt-2 text-lg leading-7 text-foreground/78">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
