"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type DocumentationImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ProjectDocumentationContent = {
  label: string;
  title: string;
  introEyebrow: string;
  introBody: string;
  scrollIndicator: string;
  why: {
    title: string;
    excerpt: string;
    paragraphs: string[];
    image: DocumentationImage;
  };
  people: {
    quote: string;
    body: string;
    image: DocumentationImage;
  };
  approach: {
    title: string;
    intro: string;
    items: string[];
  };
  interactive: {
    title: string;
    paragraphs: string[];
    examples: Array<{
      label: string;
      title: string;
      body: string;
    }>;
  };
  gallery: {
    title: string;
    intro: string;
    countLabel: string;
    closeLabel: string;
    previousLabel: string;
    nextLabel: string;
    images: DocumentationImage[];
  };
  closing: {
    lines: string[];
  };
  heroImage: DocumentationImage;
};

type ProjectDocumentationChapterProps = {
  content: ProjectDocumentationContent;
};

export type ProjectBehindScenesContent = ProjectDocumentationContent["gallery"];

export function ProjectDocumentationChapter({
  content,
}: ProjectDocumentationChapterProps) {
  return (
    <article id="project-documentation" className="bg-background text-foreground">
      <DocumentationIntro content={content} />
      <DocumentationWhy content={content.why} />
      <DocumentationPeople content={content.people} />
      <DocumentationApproach content={content.approach} />
      <DocumentationInteractive content={content.interactive} />
      <ProjectBehindScenes content={content.gallery} />
      <DocumentationClosing content={content.closing} />
    </article>
  );
}

function DocumentationIntro({ content }: { content: ProjectDocumentationContent }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 border-y border-border py-12 lg:grid-cols-[0.42fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.introEyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-semibold uppercase leading-none text-foreground min-[380px]:text-5xl md:text-6xl">
            {content.title}
          </h2>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.label}
          </p>
          <p className="mt-4 max-w-3xl text-xl leading-8 text-foreground/78 md:text-2xl md:leading-9">
            {content.introBody}
          </p>
        </div>
      </div>
    </section>
  );
}

function DocumentationWhy({
  content,
}: {
  content: ProjectDocumentationContent["why"];
}) {
  return (
    <section
      aria-labelledby="documentation-why-title"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <Image
        src={content.image.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-24"
      />
      <div className="absolute inset-0 bg-background/82" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="documentation-why-title"
            className="mt-5 text-3xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {content.excerpt}
          </h2>
        </div>
        <div className="max-w-reading space-y-5 text-lg leading-8 text-foreground/76">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentationPeople({
  content,
}: {
  content: ProjectDocumentationContent["people"];
}) {
  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <Image
        src={content.image.src}
        alt=""
        fill
        sizes="100vw"
        className="scale-105 object-cover opacity-42"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--background)_92%,transparent)_0%,color-mix(in_srgb,var(--background)_72%,transparent)_55%,color-mix(in_srgb,var(--background)_50%,transparent)_100%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <blockquote className="w-full">
          <p className="text-3xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.quote}
          </p>
          <footer className="mt-8 max-w-2xl text-lg leading-8 text-foreground/74">
            {content.body}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

function DocumentationApproach({
  content,
}: {
  content: ProjectDocumentationContent["approach"];
}) {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => {
        setVisibleItems(new Set(content.items.map((_, index) => index)));
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index);

          if (entry.isIntersecting) {
            setVisibleItems((current) => new Set(current).add(index));
          }
        });
      },
      { threshold: 0.35 },
    );

    itemRefs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, [content.items]);

  return (
    <section
      aria-labelledby="documentation-approach-title"
      className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.62fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="documentation-approach-title"
            className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-5xl"
          >
            {content.intro}
          </h2>
        </div>
        <ol className="grid gap-4">
          {content.items.map((item, index) => (
            <li
              key={item}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              data-index={index}
              className={
                visibleItems.has(index)
                  ? "grid min-h-24 translate-y-0 grid-cols-[auto_1fr] items-center gap-5 border border-border bg-surface/72 p-5 opacity-100 transition duration-700 hover:border-primary motion-reduce:transition-none"
                  : "grid min-h-24 translate-y-8 grid-cols-[auto_1fr] items-center gap-5 border border-border bg-surface/72 p-5 opacity-0 transition duration-700 hover:border-primary motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
              }
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="font-mono text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DocumentationInteractive({
  content,
}: {
  content: ProjectDocumentationContent["interactive"];
}) {
  return (
    <section
      aria-labelledby="documentation-interactive-title"
      className="px-4 py-24 sm:px-6 lg:px-10 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {content.title}
          </p>
          <h2
            id="documentation-interactive-title"
            className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-6xl"
          >
            {content.paragraphs[0]}
          </h2>
          <div className="mt-6 max-w-reading space-y-5 text-lg leading-8 text-foreground/74">
            {content.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {content.examples.map((example, index) => (
            <article
              key={example.title}
              className="border border-border bg-surface p-5"
            >
              <div className="aspect-[16/10] border border-primary/45 bg-background/48 p-4">
                <div className="flex h-full flex-col justify-between border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {example.label}
                  </p>
                  <p className="max-w-md text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
                    {example.title}
                  </p>
                  <div
                    className="h-2 bg-primary"
                    style={{ width: `${44 + index * 18}%` }}
                  />
                </div>
              </div>
              <p className="mt-4 text-base leading-7 text-foreground/72">
                {example.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectBehindScenes({
  content,
}: {
  content: ProjectBehindScenesContent;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const activeImage =
    activeImageIndex === null ? null : content.images[activeImageIndex] ?? null;

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((current) =>
          current === null
            ? current
            : (current - 1 + content.images.length) % content.images.length,
        );
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((current) =>
          current === null ? current : (current + 1) % content.images.length,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, content.images.length]);

  return (
    <section
      aria-labelledby="documentation-gallery-title"
      className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {content.title}
            </p>
            <h2
              id="documentation-gallery-title"
              className="mt-4 max-w-5xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl"
            >
              {content.intro}
            </h2>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {String(content.images.length).padStart(2, "0")} {content.countLabel}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {content.images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={
                index === 0 || index === 7
                  ? "group col-span-2 row-span-2 cursor-pointer overflow-hidden border border-border bg-surface text-left"
                  : "group cursor-pointer overflow-hidden border border-border bg-surface text-left"
              }
              aria-label={image.alt}
            >
              <div className="relative h-full min-h-24 overflow-hidden sm:min-h-28 lg:min-h-32">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 14vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
      {activeImage ? (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/84 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 grid size-11 cursor-pointer place-items-center border border-white/35 bg-background/80 text-2xl leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
            onClick={() => setActiveImageIndex(null)}
            aria-label={content.closeLabel}
          >
            ×
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 cursor-pointer place-items-center border border-white/35 bg-background/80 text-4xl leading-none text-foreground transition-colors hover:border-primary hover:text-primary sm:left-6 sm:size-14"
            onClick={(event) => {
              event.stopPropagation();
              setActiveImageIndex((current) =>
                current === null
                  ? current
                  : (current - 1 + content.images.length) % content.images.length,
              );
            }}
            aria-label={content.previousLabel}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 cursor-pointer place-items-center border border-white/35 bg-background/80 text-4xl leading-none text-foreground transition-colors hover:border-primary hover:text-primary sm:right-6 sm:size-14"
            onClick={(event) => {
              event.stopPropagation();
              setActiveImageIndex((current) =>
                current === null ? current : (current + 1) % content.images.length,
              );
            }}
            aria-label={content.nextLabel}
          >
            ›
          </button>
          <div
            className="relative h-[86dvh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DocumentationClosing({
  content,
}: {
  content: ProjectDocumentationContent["closing"];
}) {
  return (
    <section className="px-4 py-28 sm:px-6 lg:px-10 lg:py-44">
      <div className="mx-auto max-w-7xl">
        <p className="max-w-5xl whitespace-pre-line text-5xl font-semibold leading-tight text-foreground sm:text-7xl lg:text-8xl">
          {content.lines.join("\n")}
        </p>
      </div>
    </section>
  );
}
