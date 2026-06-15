import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AudioPlayer } from "@/components/media/AudioPlayer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { PullQuote } from "@/components/scrollytelling";
import type { Locale } from "@/i18n/config";
import type {
  Athlete,
  AthleteArticle,
  AthleteAudio,
  AthleteLink,
  AthleteSponsor,
  AthleteVideo,
} from "@/types/athlete";
import { AthleteCard } from "@/components/athletes/AthleteCard";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

function SectionShell({ eyebrow, title, children }: SectionShellProps) {
  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
      <div className="mx-auto max-w-7xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border border-border bg-surface/60 p-6 text-lg leading-8 text-foreground/72 sm:p-8">
      {children}
    </div>
  );
}

export function AthleteBaseStory({
  athlete,
  locale,
  title,
}: {
  athlete: Athlete;
  locale: Locale;
  title: string;
}) {
  const content = athlete.content[locale];

  return (
    <SectionShell title={title}>
      <div className="grid gap-8 xl:grid-cols-[0.42fr_1fr]">
        <h3 className="text-2xl font-semibold leading-tight text-primary sm:text-4xl">
          {content.baseStoryTitle}
        </h3>
        <p className="max-w-3xl text-2xl font-semibold leading-snug text-foreground sm:text-4xl">
          {content.baseStory}
        </p>
      </div>
    </SectionShell>
  );
}

export function AthleteQuoteSection({
  athlete,
  locale,
  title,
  emptyText,
}: {
  athlete: Athlete;
  locale: Locale;
  title: string;
  emptyText: string;
}) {
  return (
    <SectionShell title={title}>
      {athlete.quotes.length > 0 ? (
        <div className="grid gap-8">
          {athlete.quotes.map((quote, index) => (
            <PullQuote
              key={`${athlete.slug}-quote-${index}`}
              quote={quote.text[locale]}
              attribution={athlete.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </SectionShell>
  );
}

export function AthleteMediaSection({
  locale,
  title,
  emptyText,
  audio,
  video,
}: {
  locale: Locale;
  title: string;
  emptyText: string;
  audio?: AthleteAudio[];
  video?: AthleteVideo[];
}) {
  const audioWithSources = audio?.filter((item) => item.src) ?? [];
  const videoWithSources = video?.filter((item) => item.src) ?? [];
  const hasMedia = audioWithSources.length > 0 || videoWithSources.length > 0;

  return (
    <SectionShell title={title}>
      {hasMedia ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {audioWithSources.map((item) => (
            <AudioPlayer
              key={item.title.en}
              audio={{
                src: item.src ?? "",
                title: item.title[locale],
                caption: item.description?.[locale] ?? item.duration ?? undefined,
              }}
            />
          ))}
          {videoWithSources.map((item) => (
            <VideoPlayer
              key={item.title.en}
              video={{
                src: item.src ?? "",
                poster: item.poster ?? undefined,
                title: item.title[locale],
                caption: item.description?.[locale],
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </SectionShell>
  );
}

export function AthleteLinksSection({
  links,
  title,
  emptyText,
}: {
  links: AthleteLink[];
  title: string;
  emptyText: string;
}) {
  const confirmedLinks = links.filter((link) => link.url);

  return (
    <SectionShell title={title}>
      {confirmedLinks.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {confirmedLinks.map((link) => (
            <li key={`${link.type}-${link.label}`}>
              <Link
                href={link.url ?? ""}
                target="_blank"
                rel="noreferrer"
                className="block border border-border bg-surface p-5 font-semibold text-foreground transition hover:border-primary focus-visible:rounded-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </SectionShell>
  );
}

export function AthleteArticlesSection({
  articles,
  locale,
  title,
  emptyText,
}: {
  articles: AthleteArticle[];
  locale: Locale;
  title: string;
  emptyText: string;
}) {
  const confirmedArticles = articles.filter((article) => article.url);

  return (
    <SectionShell title={title}>
      {confirmedArticles.length > 0 ? (
        <ul className="grid gap-4">
          {confirmedArticles.map((article) => (
            <li key={article.title.en}>
              <Link
                href={article.url ?? ""}
                target="_blank"
                rel="noreferrer"
                className="block border border-border bg-surface p-5 transition hover:border-primary focus-visible:rounded-sm"
              >
                <span className="block text-xl font-semibold text-foreground">
                  {article.title[locale]}
                </span>
                {article.publisher ? (
                  <span className="mt-2 block text-sm uppercase tracking-wide text-foreground/62">
                    {article.publisher}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </SectionShell>
  );
}

export function AthleteSponsorsSection({
  sponsors,
  title,
  emptyText,
  summary,
}: {
  sponsors: AthleteSponsor[];
  title: string;
  emptyText: string;
  summary: string | null;
}) {
  const confirmedSponsors = sponsors.filter((sponsor) => sponsor.name);

  return (
    <SectionShell title={title}>
      {confirmedSponsors.length > 0 || summary ? (
        <div className="space-y-5">
          {summary ? (
            <p className="max-w-reading text-xl leading-8 text-foreground/78">
              {summary}
            </p>
          ) : null}
          {confirmedSponsors.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {confirmedSponsors.map((sponsor) => (
                <li
                  key={sponsor.name}
                  className="border border-border bg-surface p-5 text-lg font-semibold text-foreground"
                >
                  <div className="flex min-h-20 items-center justify-center">
                    {sponsor.logo ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={160}
                        height={80}
                        className="max-h-16 w-auto object-contain"
                      />
                    ) : sponsor.url ? (
                      <Link href={sponsor.url} target="_blank" rel="noreferrer">
                        {sponsor.name}
                      </Link>
                    ) : (
                      sponsor.name
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <EmptyState>{emptyText}</EmptyState>
      )}
    </SectionShell>
  );
}

export function MoreAthletes({
  athletes,
  locale,
  title,
  cta,
  placeholder,
  countryLabels,
  cardLabels,
}: {
  athletes: Athlete[];
  locale: Locale;
  title: string;
  cta: string;
  placeholder: string;
  countryLabels: Record<string, string>;
  cardLabels: {
    profession: string;
    role: string;
    primary: string;
  };
}) {
  return (
    <section className="border-t border-border bg-surface/45 px-4 py-20 sm:px-6 sm:py-28 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
          {title}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {athletes.map((athlete) => (
            <AthleteCard
              key={athlete.slug}
              athlete={athlete}
              locale={locale}
              country={
                athlete.country
                  ? (countryLabels[athlete.country] ?? athlete.country)
                  : null
              }
              cta={cta}
              placeholder={placeholder}
              labels={cardLabels}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
