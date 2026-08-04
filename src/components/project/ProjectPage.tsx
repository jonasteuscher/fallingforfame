import Image from "next/image";

import type { project as projectContent } from "@/content/en/project";
import { ProjectBehindScenes } from "@/components/project/ProjectDocumentationChapter";
import { WorkTitleText } from "@/components/text/WorkTitleText";

type ProjectContent = typeof projectContent;

type ProjectPageProps = {
  content: ProjectContent;
};

export function ProjectPage({ content }: ProjectPageProps) {
  return (
    <article className="bg-background text-foreground">
      <ProjectHero content={content} />
      <DocumentaryChapter content={content.documentary} />
      <ProjectMotivation content={content.motivation} />
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

function ProjectMotivation({ content }: { content: ProjectContent["motivation"] }) {
  return (
    <section id="why-this-project" className="border-y border-border bg-background">
      <div className="mx-auto grid min-h-[140svh] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:px-10 lg:py-20">
        <div className="lg:sticky lg:top-20 lg:h-[calc(100svh-5rem)]">
          <figure className="relative aspect-[4/5] h-[min(78svh,48rem)] overflow-hidden bg-surface lg:h-full lg:aspect-auto">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              priority
              quality={92}
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_18%,transparent),transparent_42%),linear-gradient(180deg,transparent_48%,color-mix(in_srgb,var(--background)_54%,transparent)_100%)]"
              aria-hidden="true"
            />
          </figure>
        </div>

        <div className="flex flex-col gap-16 lg:gap-20">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {content.label}
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
              {content.title}
            </h2>
          </header>

          <div className="grid gap-10 sm:gap-12">
            {content.blocks.map((block, index) => (
              <article key={block} className="max-w-reading">
                <p className="mb-4 font-mono text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="text-xl leading-9 text-foreground/78 sm:text-2xl sm:leading-10">
                  <WorkTitleText>{block}</WorkTitleText>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-24 sm:px-6 lg:px-10 lg:py-36">
        <blockquote className="mx-auto max-w-6xl text-center text-4xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
          “{content.quote}”
        </blockquote>
      </div>
    </section>
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
          <WorkTitleText>{content.body}</WorkTitleText>
        </p>
        <div className="mt-12 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-foreground/62">
          <span className="h-px w-12 bg-primary" aria-hidden="true" />
          <span>{content.scrollCta}</span>
        </div>
      </div>
    </section>
  );
}

function DocumentaryChapter({ content }: { content: ProjectContent["documentary"] }) {
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
              <p key={paragraph}>
                <WorkTitleText>{paragraph}</WorkTitleText>
              </p>
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
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <h2 className="mt-3 max-w-6xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="mt-8 max-w-5xl text-lg leading-8 text-foreground/76 md:text-xl md:leading-9">
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
            <article
              key={item.title}
              className="border border-border bg-surface/80 p-5"
            >
              <h3 className="text-2xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-foreground/72">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 max-w-6xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
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
            <div className="relative aspect-[210/297] overflow-hidden border border-border bg-background">
              <Image
                src="/document/thesis/Thesis_Cover.jpg"
                alt={content.coverAlt}
                fill
                sizes="(min-width: 768px) 18rem, 90vw"
                className="object-cover object-top"
              />
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
              <a
                href="/document/thesis/Thesis_Zwischen_Sichtbarkeit_und_Sicherheit.pdf"
                download
                className="w-full border border-primary bg-primary px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide text-background transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:w-fit"
              >
                {content.button}
              </a>
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
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
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
    <section
      id="credits"
      className="border-t border-border px-4 py-16 sm:px-6 lg:px-10"
    >
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
