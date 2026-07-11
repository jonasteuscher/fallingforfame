import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AthleteArticleList } from "@/components/athletes/AthleteArticleList";
import { AudioPlayer } from "@/components/media/AudioPlayer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { PullQuote } from "@/components/scrollytelling";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type {
  Athlete,
  AthleteArticle,
  AthleteAudio,
  AthleteImage,
  AthleteLink,
  AthleteSponsor,
  AthleteVideo,
} from "@/types/athlete";
import { AthleteCard } from "@/components/athletes/AthleteCard";
import { AthleteGalleryLightbox } from "@/components/athletes/AthleteGalleryLightbox";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  compact?: boolean;
};

function SectionShell({ eyebrow, title, children, compact = false }: SectionShellProps) {
  return (
    <section
      className={[
        "border-t border-border px-4 sm:px-6 xl:px-10",
        compact ? "py-14 sm:py-18" : "py-20 sm:py-28",
      ].join(" ")}
    >
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
  const beats = athlete.originStory.length > 0 ? athlete.originStory : null;

  return (
    <section
      id="origin-story"
      className="relative border-t border-border px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[0.34fr_1fr]">
        <header className="xl:sticky xl:top-28 xl:max-h-[calc(100svh-8rem)] xl:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {title}
          </p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {content.baseStoryTitle}
          </h2>
        </header>

        {beats ? (
          <div className="relative">
            <div
              className="absolute left-3 top-0 hidden h-full w-px bg-border sm:block"
              aria-hidden="true"
            />
            <ol className="space-y-16 sm:pl-12">
              {beats.map((beat, index) => (
                <li
                  key={`${beat.phase.en}-${beat.title.en}`}
                  className="relative motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span
                    className="absolute -left-[3.25rem] top-1 hidden h-6 w-6 border border-primary bg-background sm:block"
                    aria-hidden="true"
                  />
                  <article className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      {beat.phase[locale]}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                      {beat.title[locale]}
                    </h3>
                    <p className="mt-5 text-lg leading-8 text-foreground/76">
                      {beat.body[locale]}
                    </p>
                  </article>

                  {beat.quote ? (
                    <figure className="my-12 border-l-4 border-primary pl-6 sm:pl-10">
                      <blockquote className="max-w-4xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                        {beat.quote[locale]}
                      </blockquote>
                    </figure>
                  ) : null}

                  {beat.media ? (
                    <figure className="my-12 overflow-hidden border border-border bg-surface">
                      {beat.media.src && beat.media.type === "image" ? (
                        <Image
                          src={beat.media.src}
                          alt={beat.media.alt?.[locale] ?? ""}
                          width={1600}
                          height={900}
                          className="aspect-video w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-video items-end bg-[linear-gradient(145deg,var(--surface-muted)_0%,var(--surface)_52%,var(--background)_100%)] p-6">
                          <span className="max-w-40 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/62">
                            Documentary media pending
                          </span>
                        </div>
                      )}
                    </figure>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="max-w-3xl text-2xl font-semibold leading-snug text-foreground sm:text-4xl">
            {content.baseStory}
          </p>
        )}
      </div>
    </section>
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

export function AthleteGallerySection({
  images,
  locale,
  title,
  emptyText,
  initialVisibleCount,
  viewAllLabel,
  showLessLabel,
  variant,
}: {
  images: AthleteImage[];
  locale: Locale;
  title: string;
  emptyText: string;
  initialVisibleCount?: number;
  viewAllLabel?: string;
  showLessLabel?: string;
  variant?: "grid" | "editorial";
}) {
  const confirmedImages = images.filter((image) => image.src);

  return (
    <SectionShell title={title}>
      {confirmedImages.length > 0 ? (
        <AthleteGalleryLightbox
          images={confirmedImages}
          locale={locale}
          initialVisibleCount={initialVisibleCount}
          viewAllLabel={viewAllLabel}
          showLessLabel={showLessLabel}
          variant={variant}
        />
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
  compact = false,
}: {
  links: AthleteLink[];
  title: string;
  compact?: boolean;
}) {
  const confirmedLinks = links.filter(
    (link): link is AthleteLink & { url: string } => Boolean(link.url),
  );

  if (confirmedLinks.length === 0) {
    return null;
  }

  return (
    <SectionShell title={title} compact={compact}>
      <ul className={compact ? "flex flex-wrap gap-3" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
        {confirmedLinks.map((link) => (
          <li key={`${link.type}-${link.label}-${link.url}`}>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center gap-4 border border-border bg-surface font-semibold text-foreground transition hover:border-primary focus-visible:rounded-sm",
                compact ? "min-h-12 px-4 py-3" : "min-h-24 p-5",
              ].join(" ")}
            >
              <span
                className={[
                  "flex shrink-0 items-center justify-center",
                  compact ? "h-8 w-8" : "h-14 w-14",
                ].join(" ")}
              >
                <Image
                  src={getSocialIcon(link)}
                  alt=""
                  width={44}
                  height={44}
                  className={compact ? "max-h-7 w-auto object-contain" : "max-h-11 w-auto object-contain"}
                />
              </span>
              <span className="min-w-0">
                <span className={compact ? "sr-only" : "block text-xs uppercase tracking-wide text-foreground/54"}>
                  {getSocialPlatformLabel(link.type)}
                </span>
                <span className={compact ? "block break-words text-sm leading-tight" : "mt-1 block break-words text-lg leading-tight"}>
                  {link.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function AthleteArticlesSection({
  articles,
  locale,
  title,
  viewAllLabel,
  showLessLabel,
  compact = false,
  initialVisibleCount,
}: {
  articles: AthleteArticle[];
  locale: Locale;
  title: string;
  viewAllLabel: string;
  showLessLabel: string;
  compact?: boolean;
  initialVisibleCount?: number;
}) {
  const confirmedArticles = articles.filter(
    (article): article is AthleteArticle & { url: string } =>
      Boolean(article.url),
  );

  if (confirmedArticles.length === 0) {
    return null;
  }

  return (
    <SectionShell title={title} compact={compact}>
      <AthleteArticleList
        articles={confirmedArticles}
        locale={locale}
        viewAllLabel={viewAllLabel}
        showLessLabel={showLessLabel}
        initialVisibleCount={initialVisibleCount}
        compact={compact}
      />
    </SectionShell>
  );
}

export function AthleteFindingsLinkSection({
  locale,
  eyebrow,
  title,
  body,
  cta,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 sm:py-24 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_auto] lg:items-end">
          <div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/76">
              {body}
            </p>
          </div>
          <Link
            href={localizedPath(locale, "/findings")}
            className="inline-flex min-h-12 w-fit items-center border border-primary bg-primary px-5 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-transparent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

const socialIcons: Record<AthleteLink["type"], string> = {
  facebook: "/socials/facebook.png",
  instagram: "/socials/instagram.png",
  other: "/socials/website.svg",
  tiktok: "/socials/tiktok.png",
  website: "/socials/website.svg",
  youtube: "/socials/youtube.png",
};

function getSocialIcon(link: AthleteLink) {
  return link.icon ?? socialIcons[link.type];
}

function getSocialPlatformLabel(type: AthleteLink["type"]) {
  if (type === "website") {
    return "Website";
  }

  if (type === "other") {
    return "Link";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function AthleteSponsorsSection({
  sponsors,
  title,
  summary,
  compact = false,
}: {
  sponsors: AthleteSponsor[];
  title: string;
  summary: string | null;
  compact?: boolean;
}) {
  const confirmedSponsors = sponsors.filter(
    (
      sponsor,
    ): sponsor is AthleteSponsor & { logo: string; url: string } =>
      Boolean(sponsor.name && sponsor.logo && sponsor.url),
  );

  if (confirmedSponsors.length === 0) {
    return null;
  }

  return (
    <SectionShell title={title} compact={compact}>
      <div className="space-y-5">
        {summary ? (
          <p className={compact ? "max-w-3xl text-base leading-7 text-foreground/72" : "max-w-reading text-xl leading-8 text-foreground/78"}>
            {summary}
          </p>
        ) : null}
        <ul className={compact ? "flex flex-wrap gap-3" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"}>
          {confirmedSponsors.map((sponsor) => (
            <li
              key={sponsor.name}
              className={compact ? "border border-border bg-surface px-4 py-3 text-lg font-semibold text-foreground" : "border border-border bg-surface p-5 text-lg font-semibold text-foreground"}
            >
              <Link
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={compact ? "flex min-h-12 items-center justify-center transition opacity-80 hover:opacity-100 focus-visible:rounded-sm" : "flex min-h-20 items-center justify-center transition opacity-80 hover:opacity-100 focus-visible:rounded-sm"}
              >
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={260}
                  height={130}
                  className={compact ? "max-h-12 w-auto object-contain" : "max-h-24 w-auto object-contain"}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
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
