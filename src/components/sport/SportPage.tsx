import type { sport as sportContent } from "@/content/en/sport";
import { ScrollySection } from "@/components/scrollytelling";

type SportContent = typeof sportContent;
type SportSection = SportContent["sections"][number];

type SportPageProps = {
  content: SportContent;
};

export function SportPage({ content }: SportPageProps) {
  const sectionById = new Map(content.sections.map((section) => [section.id, section]));

  return (
    <article>
      <ScrollySection className="overflow-hidden">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.7fr)] lg:items-center">
          <div className="min-w-0">
            <p className="mb-4 break-words text-sm font-semibold uppercase tracking-wide text-primary [overflow-wrap:anywhere]">
              {content.kicker}
            </p>
            <h1 className="max-w-full hyphens-auto break-words text-4xl font-semibold leading-tight text-foreground [overflow-wrap:anywhere] min-[380px]:text-5xl md:text-7xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/78">
              {content.body}
            </p>
          </div>
          <BaseAcronymHero content={content.acronym} />
        </div>
      </ScrollySection>

      <EditorialSection
        section={
          sectionById.get("what-is-base-jumping") ??
          sectionById.get("was-ist-base-jumping")
        }
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <HistoryTimeline content={content.historyTimeline} />
      </ScrollySection>
      <EditorialSection
        section={sectionById.get("history") ?? sectionById.get("geschichte")}
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <SkydivingVsBase content={content.comparison} />
      </ScrollySection>
      <EditorialSection section={sectionById.get("skydiving-vs-base")} />

      <ScrollySection fullHeight={false} className="pt-0">
        <EquipmentSystem content={content.equipmentVisual} />
      </ScrollySection>
      <EditorialSection
        section={sectionById.get("equipment") ?? sectionById.get("ausruestung")}
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <SafetyPyramid content={content.safetyPyramid} />
      </ScrollySection>
      <EditorialSection
        section={
          sectionById.get("risk-and-safety-culture") ??
          sectionById.get("risiko-und-sicherheitskultur")
        }
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <EthicsNetwork content={content.ethicsNetwork} />
      </ScrollySection>
      <EditorialSection
        section={
          sectionById.get("community-and-ethics") ??
          sectionById.get("gemeinschaft-und-ethik")
        }
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <DisciplinesGallery content={content.disciplines} />
      </ScrollySection>
      <EditorialSection
        section={sectionById.get("disciplines") ?? sectionById.get("disziplinen")}
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <ThenVsNow content={content.thenVsNow} />
      </ScrollySection>
      <EditorialSection
        section={
          sectionById.get("modern-developments") ??
          sectionById.get("moderne-entwicklungen")
        }
      />

      <ScrollySection fullHeight={false} className="pt-0">
        <SourcesSection content={content.sources} disclaimer={content.disclaimer} />
      </ScrollySection>
    </article>
  );
}

function EditorialSection({ section }: { section?: SportSection }) {
  if (!section) {
    return null;
  }

  return (
    <ScrollySection id={section.id} fullHeight={false} className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.45fr)_minmax(0,1fr)]">
        <div>
          <h2 className="max-w-lg text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
            {section.title}
          </h2>
        </div>
        <div className="max-w-reading space-y-5 text-base leading-8 text-foreground/78 sm:text-lg">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list?.length ? (
            <div className="border-l-2 border-primary pl-5">
              {section.listTitle ? (
                <h3 className="text-base font-semibold text-foreground">
                  {section.listTitle}
                </h3>
              ) : null}
              <ul className="mt-3 grid gap-2">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3 h-1.5 w-1.5 shrink-0 bg-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </ScrollySection>
  );
}

function BaseAcronymHero({ content }: { content: SportContent["acronym"] }) {
  return (
    <section aria-labelledby="base-acronym-title" className="min-w-0">
      <h2 id="base-acronym-title" className="sr-only">
        {content.title}
      </h2>
      <ol className="grid grid-cols-2 gap-3 sm:gap-4">
        {content.items.map((item) => (
          <li
            key={item.letter}
            className="group min-w-0 border border-border bg-surface/80 p-4 transition hover:border-primary focus-within:border-primary sm:p-5"
          >
            <div className="aspect-[4/3] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-muted)_76%,transparent),color-mix(in_srgb,var(--primary)_24%,transparent))] p-4">
              <span className="block text-5xl font-semibold leading-none text-primary sm:text-7xl">
                {item.letter}
              </span>
              <span className="mt-3 block text-lg font-semibold text-foreground">
                {item.term}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground/72">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HistoryTimeline({ content }: { content: SportContent["historyTimeline"] }) {
  return (
    <section aria-labelledby="history-timeline-title">
      <SectionHeading title={content.title} />
      <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {content.items.map((item) => (
          <li
            key={`${item.date}-${item.title}`}
            className="min-w-0 border-t border-primary/70 bg-surface p-4"
          >
            <p className="text-2xl font-semibold text-primary">{item.date}</p>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/72">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SkydivingVsBase({ content }: { content: SportContent["comparison"] }) {
  return (
    <section aria-labelledby="comparison-title">
      <SectionHeading title={content.title} />
      <div className="mt-8 overflow-hidden border border-border bg-surface">
        <div className="grid grid-cols-2 border-b border-border text-center text-lg font-semibold md:grid-cols-[220px_1fr_1fr] sm:text-2xl">
          <div
            className="hidden border-r border-border bg-background/40 md:block"
            aria-hidden="true"
          />
          <div className="p-4 text-foreground">{content.skydivingLabel}</div>
          <div className="border-l border-border p-4 text-primary">
            {content.baseLabel}
          </div>
        </div>
        <dl className="divide-y divide-border">
          {content.rows.map((row) => (
            <div key={row.label} className="grid gap-0 md:grid-cols-[220px_1fr_1fr]">
              <dt className="bg-background/40 p-4 text-sm font-semibold uppercase tracking-wide text-foreground/62">
                {row.label}
              </dt>
              <dd className="p-4 text-foreground/82">{row.skydiving}</dd>
              <dd className="border-t border-border p-4 font-medium text-primary md:border-l md:border-t-0 md:font-normal md:text-foreground">
                {row.base}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function EquipmentSystem({ content }: { content: SportContent["equipmentVisual"] }) {
  return (
    <section aria-labelledby="equipment-title">
      <SectionHeading title={content.title} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(240px,0.7fr)_1fr] lg:items-center">
        <div className="relative aspect-[3/4] min-h-80 overflow-hidden bg-surface-muted">
          <div className="absolute inset-6 border border-primary/70" />
          <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full border border-border bg-background/80" />
          <div className="absolute left-1/2 top-28 h-40 w-28 -translate-x-1/2 border border-border bg-background/70" />
          <div className="absolute bottom-10 left-1/2 h-28 w-44 -translate-x-1/2 border border-primary/50 bg-primary/10" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.items.map((item) => (
            <details
              key={item.name}
              className="group border border-border bg-surface p-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground">
                <span>{item.name}</span>
                <span
                  aria-hidden="true"
                  className="text-primary transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-foreground/72">
                {item.description}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetyPyramid({ content }: { content: SportContent["safetyPyramid"] }) {
  return (
    <section aria-labelledby="safety-title">
      <SectionHeading title={content.title} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <p className="max-w-reading border-l-2 border-primary pl-5 text-xl leading-8 text-foreground/82">
          {content.message}
        </p>
        <ol className="grid gap-2">
          {content.levels.map((level, index) => (
            <li
              key={level}
              className="mx-auto border border-border bg-surface px-5 py-4 text-center font-semibold text-foreground"
              style={{ width: `${100 - index * 12}%` }}
            >
              {level}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EthicsNetwork({ content }: { content: SportContent["ethicsNetwork"] }) {
  return (
    <section aria-labelledby="ethics-network-title">
      <SectionHeading title={content.title} />
      <ol className="mt-8 grid gap-3 sm:grid-cols-5">
        {content.nodes.map((node, index) => (
          <li
            key={node}
            className="relative border border-border bg-surface p-4 text-center font-semibold text-foreground"
          >
            <span className="text-primary">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-2 block">{node}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DisciplinesGallery({ content }: { content: SportContent["disciplines"] }) {
  return (
    <section aria-labelledby="disciplines-title">
      <SectionHeading title={content.title} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, index) => (
          <article key={item.title} className="min-w-0 border border-border bg-surface">
            <div className="aspect-[4/3] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_20%,transparent),color-mix(in_srgb,var(--surface-muted)_80%,transparent))] p-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-foreground/72">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ThenVsNow({ content }: { content: SportContent["thenVsNow"] }) {
  return (
    <section aria-labelledby="then-now-title">
      <SectionHeading title={content.title} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ColumnList
          label={content.thenLabel}
          items={content.rows.map((row) => row.then)}
        />
        <ColumnList
          label={content.nowLabel}
          items={content.rows.map((row) => row.now)}
          accent
        />
      </div>
    </section>
  );
}

function SourcesSection({
  content,
  disclaimer,
}: {
  content: SportContent["sources"];
  disclaimer: string;
}) {
  return (
    <section
      aria-labelledby="sources-title"
      className="grid gap-8 lg:grid-cols-[0.6fr_1fr]"
    >
      <div>
        <h2
          id="sources-title"
          className="text-2xl font-semibold leading-tight text-foreground sm:text-4xl"
        >
          {content.title}
        </h2>
        <p className="mt-5 border-l-2 border-primary pl-5 text-sm leading-6 text-foreground/72">
          {disclaimer}
        </p>
      </div>
      <div className="max-w-reading space-y-5 text-base leading-8 text-foreground/78">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <div>
          <h3 className="font-semibold text-foreground">{content.listTitle}</h3>
          <ul className="mt-3 grid gap-2">
            {content.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-3 h-1.5 w-1.5 shrink-0 bg-primary"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p>{content.closing}</p>
      </div>
    </section>
  );
}

function ColumnList({
  label,
  items,
  accent = false,
}: {
  label: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <h3
        className={
          accent
            ? "text-2xl font-semibold text-primary"
            : "text-2xl font-semibold text-foreground"
        }
      >
        {label}
      </h3>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="border-t border-border pt-3 text-foreground/78">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
      {title}
    </h2>
  );
}
