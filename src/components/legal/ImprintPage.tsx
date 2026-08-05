import type { imprint as imprintContent } from "@/content/en/imprint";
import { WorkTitleText } from "@/components/text/WorkTitleText";

type ImprintContent = typeof imprintContent;

type ImprintPageProps = {
  content: ImprintContent;
};

export function ImprintPage({ content }: ImprintPageProps) {
  const sections = [
    content.project,
    content.responsible,
    content.university,
    content.copyright,
    content.imageCredits,
    content.videoCredits,
    content.audioCredits,
    content.sources,
    content.liability,
    content.riskNotice,
    content.contact,
  ];

  return (
    <article className="bg-background text-foreground">
      <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-none text-foreground sm:text-7xl xl:text-8xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
            {content.hero.subtitle}
          </p>
          <p className="mt-6 max-w-reading text-lg leading-8 text-foreground/78 sm:text-xl sm:leading-9">
            <WorkTitleText>{content.hero.body}</WorkTitleText>
          </p>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-24 xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <LegalSection key={section.title} section={section} />
          ))}
        </div>
      </section>
    </article>
  );
}

function LegalSection({ section }: { section: ImprintContent[keyof ImprintContent] }) {
  if (!("title" in section)) {
    return null;
  }

  return (
    <section
      aria-labelledby={sectionId(section.title)}
      className={`border border-border bg-surface/42 p-5 sm:p-7 ${
        "categories" in section ? "lg:col-span-2" : ""
      }`}
    >
      <h2
        id={sectionId(section.title)}
        className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl"
      >
        {section.title}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-7 text-foreground/74">
        {"name" in section ? (
          <p className="text-lg font-semibold text-foreground">{section.name}</p>
        ) : null}

        {"description" in section ? (
          <p>
            <WorkTitleText>{section.description}</WorkTitleText>
          </p>
        ) : null}
        {"body" in section ? (
          <p>
            <WorkTitleText>{section.body}</WorkTitleText>
          </p>
        ) : null}

        {"address" in section ? (
          <address className="not-italic">
            {section.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        ) : null}

        {"lines" in section ? (
          <div>
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        {"emailLabel" in section ? (
          <dl className="grid gap-2">
            <div>
              <dt className="font-semibold uppercase tracking-wide text-foreground/58">
                {section.emailLabel}
              </dt>
              <dd className="mt-1 text-foreground">{section.email}</dd>
            </div>
            {"websiteLabel" in section ? (
              <div>
                <dt className="font-semibold uppercase tracking-wide text-foreground/58">
                  {section.websiteLabel}
                </dt>
                <dd className="mt-1 text-foreground">{section.website}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {"categories" in section ? (
          <div className="space-y-8">
            {section.categories.map((category) => (
              <section
                key={category.title}
                aria-labelledby={sectionId(`${section.title}-${category.title}`)}
                className="border-t border-border pt-6 first:border-t-0 first:pt-0"
              >
                <h3
                  id={sectionId(`${section.title}-${category.title}`)}
                  className="text-lg font-semibold leading-tight text-foreground sm:text-xl"
                >
                  {category.title}
                </h3>
                {"note" in category ? (
                  <p className="mt-3 max-w-reading text-foreground/78">
                    {category.note}
                  </p>
                ) : null}
                {category.items.length > 0 ? (
                  <ul className="mt-4 grid gap-4 md:grid-cols-2">
                    {category.items.map((credit) => (
                      <li
                        key={`${category.title}-${credit.title}`}
                        className="border border-border/80 bg-background/26 p-4"
                      >
                        <h4 className="text-base font-semibold leading-tight text-foreground">
                          {credit.title}
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-foreground/72">
                          {credit.description}
                        </p>
                        <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
                          {credit.credit}
                        </p>
                        <a
                          href={credit.source}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.16em] text-primary underline-offset-4 transition hover:text-primary/80 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                          {section.sourceLabel}: {credit.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function sectionId(title: string) {
  return `imprint-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}
