import type { privacy as privacyContent } from "@/content/en/privacy";
import type { ReactNode } from "react";

import { formatWorkTitle, WorkTitleText } from "@/components/text/WorkTitleText";

type PrivacyPolicyContent = typeof privacyContent;

type PrivacyPolicyPageProps = {
  content: PrivacyPolicyContent;
};

export function PrivacyPolicyPage({ content }: PrivacyPolicyPageProps) {
  return (
    <article lang={content.locale} className="bg-background text-foreground">
      <section className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-none text-foreground sm:text-7xl xl:text-8xl">
            {content.hero.title}
          </h1>
          <p className="mt-7 max-w-reading text-lg leading-8 text-foreground/78 sm:text-xl sm:leading-9">
            <WorkTitleText>{content.hero.intro}</WorkTitleText>
          </p>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/54">
            {content.updated}
          </p>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-24 xl:px-10">
        <div className="mx-auto max-w-4xl space-y-14">
          {content.sections.map((section, index) => {
            const items = "items" in section ? section.items : undefined;

            return (
              <section
                key={section.title}
                aria-labelledby={sectionId(section.title, index)}
                className="border-t border-border pt-10 first:border-t-0 first:pt-0"
              >
                <h2
                  id={sectionId(section.title, index)}
                  className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl"
                >
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-foreground/76 sm:text-lg sm:leading-8">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      {renderPrivacyText(paragraph)}
                    </p>
                  ))}
                  {items && items.length > 0 ? (
                    <ul className="space-y-3 pl-5">
                      {items.map((item) => (
                        <li key={item} className="list-disc marker:text-primary">
                          <WorkTitleText>{item}</WorkTitleText>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </article>
  );
}

function sectionId(title: string, index: number) {
  return `privacy-${index}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

const privacyEmail = "jonas.teuscher@gmail.com";

function renderPrivacyText(text: string): ReactNode {
  if (!text.includes(privacyEmail)) {
    return formatWorkTitle(text);
  }

  return text.split(privacyEmail).map((part, index, parts) => (
    <span key={`${part}-${index}`}>
      {formatWorkTitle(part)}
      {index < parts.length - 1 ? (
        <a
          href={`mailto:${privacyEmail}`}
          className="text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {privacyEmail}
        </a>
      ) : null}
    </span>
  ));
}
