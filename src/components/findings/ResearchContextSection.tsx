import Link from "next/link";

import { SectionTitle } from "@/components/athletes/SectionTitle";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { FindingChapter } from "@/types/findings";

type ResearchContextSectionProps = {
  chapter: FindingChapter;
  locale: Locale;
};

const researchContextCopy = {
  en: {
    intro:
      "This qualitative exploratory study does not attempt to explain BASE jumping as a whole. It offers in-depth insight into how experienced athletes perceive visibility, sponsorship, risk and safety culture.",
    methodTitle: "How the study was conducted",
    limitationsTitle: "Limitations",
    continueTitle: "Further reading",
    conclusion:
      "Visibility does not change decisions directly. It changes the conditions in which decisions emerge.",
    methodGroups: [
      {
        title: "Design",
        body: "Qualitative exploratory research design with reflexive thematic analysis.",
      },
      {
        title: "Material",
        body: "Guided interviews, participant observation and photo elicitation.",
      },
      {
        title: "Participants",
        body: "Five experienced male BASE athletes.",
      },
    ],
    limitations: [
      {
        title: "Scope",
        body: "The study provides qualitative depth rather than statistical representativeness.",
      },
      {
        title: "Participants",
        body: "The perspectives are limited to experienced male athletes. Beginners and women are not represented in the sample.",
      },
      {
        title: "Generalisability",
        body: "The findings do not make causal claims and cannot be transferred to the whole BASE jumping community as universal rules.",
      },
      {
        title: "Interpretation",
        body: "Survivorship bias cannot be excluded. The findings mainly reflect experienced, safety-oriented athletes and should be read in that context.",
      },
    ],
    continueLinks: [
      {
        href: "/project#bachelor-thesis",
        label: "Complete bachelor thesis",
        description: "Methodology, theory and discussion",
      },
      {
        href: "/project",
        label: "About the project",
        description: "Process and scientific background",
      },
      {
        href: "/athletes",
        label: "The portrayed athletes",
        description: "Perspectives and stories",
      },
    ],
  },
  de: {
    intro:
      "Diese qualitative explorative Studie versucht nicht, BASE Jumping als Ganzes zu erklären. Sie gibt vertieften Einblick darin, wie erfahrene Athleten Sichtbarkeit, Sponsoring, Risiko und Sicherheitskultur wahrnehmen.",
    methodTitle: "Wie die Studie durchgeführt wurde",
    limitationsTitle: "Limitationen",
    continueTitle: "Weiterführende Inhalte",
    conclusion:
      "Zwischen Sichtbarkeit und Sicherheit liegen keine einfachen Antworten - sondern Erfahrung, Verantwortung und eine gelebte Sicherheitskultur.",
    methodGroups: [
      {
        title: "Design",
        body: "Qualitatives exploratives Forschungsdesign mit reflexiver thematischer Analyse.",
      },
      {
        title: "Material",
        body: "Leitfadeninterviews, teilnehmende Beobachtung und Photo Elicitation.",
      },
      {
        title: "Teilnehmende",
        body: "Fünf erfahrene männliche BASE-Athleten.",
      },
    ],
    limitations: [
      {
        title: "Reichweite",
        body: "Die Studie liefert qualitative Tiefe, aber keine statistische Repräsentativität.",
      },
      {
        title: "Teilnehmende",
        body: "Die Perspektiven beschränken sich auf erfahrene männliche Athleten. Anfänger:innen und Frauen sind im Sample nicht vertreten.",
      },
      {
        title: "Generalisierbarkeit",
        body: "Die Ergebnisse formulieren keine Kausalansprüche und lassen sich nicht als allgemeingültige Regeln auf die gesamte BASE-Jumping-Community übertragen.",
      },
      {
        title: "Einordnung",
        body: "Survivorship Bias kann nicht ausgeschlossen werden. Die Ergebnisse spiegeln vor allem erfahrene, sicherheitsorientierte Athleten und müssen in diesem Kontext gelesen werden.",
      },
    ],
    continueLinks: [
      {
        href: "/project#bachelor-thesis",
        label: "Vollständige Bachelorarbeit",
        description: "Methodik, Theorie und Diskussion",
      },
      {
        href: "/project",
        label: "Über das Projekt",
        description: "Entstehung und wissenschaftlicher Hintergrund",
      },
      {
        href: "/athletes",
        label: "Die porträtierten Athleten",
        description: "Perspektiven und Geschichten",
      },
    ],
  },
} as const satisfies Record<
  Locale,
  {
    intro: string;
    methodTitle: string;
    limitationsTitle: string;
    continueTitle: string;
    conclusion: string;
    methodGroups: readonly { title: string; body: string }[];
    limitations: readonly { title: string; body: string }[];
    continueLinks: readonly { href: string; label: string; description: string }[];
  }
>;

export function ResearchContextSection({
  chapter,
  locale,
}: ResearchContextSectionProps) {
  const copy = researchContextCopy[locale];

  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-24 border-t border-border px-4 py-[var(--section-gap-immersive)] sm:px-6 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        <header className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary motion-safe:animate-[fade-in-up_430ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {chapter.eyebrow}
          </p>
          <SectionTitle id={`${chapter.id}-title`} size="interviewSplit">
            {chapter.title}
          </SectionTitle>
          <p className="mt-8 max-w-[39ch] text-lg leading-8 text-foreground/76 motion-safe:animate-[fade-in-up_430ms_ease-out_240ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0">
            {copy.intro}
          </p>
          <p className="sr-only">{chapter.accessibleSummary}</p>
        </header>

        <div className="min-w-0 space-y-16 motion-safe:animate-[fade-in-up_520ms_ease-out_420ms_forwards] motion-safe:translate-y-5 motion-safe:opacity-0">
          <section aria-labelledby={`${chapter.id}-method-title`}>
            <h3
              id={`${chapter.id}-method-title`}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-primary"
            >
              {copy.methodTitle}
            </h3>
            <div className="mt-7 grid gap-7 border-l border-border pl-5 sm:pl-7">
              {copy.methodGroups.map((item) => (
                <article key={item.title}>
                  <h4 className="text-base font-semibold uppercase tracking-[0.12em] text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 max-w-[58ch] leading-7 text-foreground/72">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby={`${chapter.id}-limitations-title`}>
            <h3
              id={`${chapter.id}-limitations-title`}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-primary"
            >
              {copy.limitationsTitle}
            </h3>
            <div className="mt-7 grid gap-7 border-l border-primary/70 pl-5 sm:pl-7">
              {copy.limitations.map((item) => (
                <article key={item.title}>
                  <h4 className="text-base font-semibold uppercase tracking-[0.12em] text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-2 max-w-[62ch] leading-7 text-foreground/74">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <p className="max-w-[42rem] text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {copy.conclusion}
          </p>

          <nav aria-labelledby={`${chapter.id}-continue-title`}>
            <h3
              id={`${chapter.id}-continue-title`}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-primary"
            >
              {copy.continueTitle}
            </h3>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:flex-wrap">
              {copy.continueLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={localizedPath(locale, link.href)}
                  className="group inline-flex max-w-[22rem] items-start gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground/78 transition hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
                  aria-label={`${link.label}. ${link.description}`}
                >
                  <span className="text-primary" aria-hidden="true">
                    -&gt;
                  </span>
                  <span>
                    <span className="block group-hover:underline">{link.label}</span>
                    <span className="mt-1 block text-xs font-normal normal-case leading-5 tracking-normal text-foreground/54">
                      {link.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
