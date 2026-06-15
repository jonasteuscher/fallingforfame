import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { Athlete } from "@/types/athlete";

type AthleteCardProps = {
  athlete: Athlete;
  locale: Locale;
  country: string | null;
  cta: string;
  placeholder: string;
  labels: {
    profession: string;
    role: string;
    primary: string;
  };
  compact?: boolean;
};

export function AthleteCard({
  athlete,
  locale,
  country,
  cta,
  placeholder,
  labels,
  compact = false,
}: AthleteCardProps) {
  const content = athlete.content[locale];

  return (
    <article className="group flex h-full min-w-0 flex-col border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary motion-reduce:transition-none">
      <Link
        href={localizedPath(locale, `/athletes/${athlete.slug}`)}
        className="flex h-full min-w-0 flex-col focus-visible:rounded-sm"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
          {athlete.images.portrait ? (
            <Image
              src={athlete.images.portrait}
              alt=""
              fill
              sizes={
                compact
                  ? "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  : "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              }
              className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 flex items-end bg-[linear-gradient(145deg,var(--surface-muted)_0%,var(--surface)_48%,var(--background)_100%)] p-5">
              <span className="max-w-32 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/62">
                {placeholder}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {country}
          </p>
          <h2 className="mt-3 break-words text-2xl font-semibold leading-tight text-foreground [overflow-wrap:anywhere]">
            {athlete.name}
          </h2>
          <dl className="mt-5 grid gap-3 text-sm text-foreground/76">
            <div>
              <dt className="font-semibold uppercase tracking-wide text-foreground/54">
                {labels.profession}
              </dt>
              <dd className="mt-1">{content.profession}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-wide text-foreground/54">
                {labels.role}
              </dt>
              <dd className="mt-1">{content.role}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-wide text-foreground/54">
                {labels.primary}
              </dt>
              <dd className="mt-1">{content.primaryDisciplines.join(", ")}</dd>
            </div>
          </dl>
          <p className="mt-4 leading-7 text-foreground/74">{content.shortBio}</p>
          <span className="mt-auto pt-8 text-sm font-semibold uppercase tracking-wide text-primary">
            {cta}
          </span>
        </div>
      </Link>
    </article>
  );
}
