import Image from "next/image";

import type { Locale } from "@/i18n/config";
import type { Athlete } from "@/types/athlete";

type AthletePortraitIntroProps = {
  athlete: Athlete;
  locale: Locale;
  placeholder: string;
  country: string | null;
  labels: {
    age: string;
    country: string;
    residence: string;
    profession: string;
    role: string;
    platforms: string;
    disciplines: string;
  };
  sponsoredLabels: {
    unknown: string;
    yes: string;
    no: string;
    labels: {
      sponsored: string;
    };
  };
  unknown: string;
};

export function AthletePortraitIntro({
  athlete,
  locale,
  placeholder,
  country,
  labels,
  sponsoredLabels,
  unknown,
}: AthletePortraitIntroProps) {
  const content = athlete.content[locale];
  const meta = [
    { label: labels.age, value: athlete.age?.toString() ?? unknown },
    { label: labels.country, value: country ?? unknown },
    { label: labels.residence, value: content.residence },
    { label: labels.profession, value: content.profession },
    { label: labels.role, value: content.role },
    {
      label: labels.platforms,
      value: athlete.platforms.length > 0 ? athlete.platforms.join(", ") : unknown,
    },
    { label: labels.disciplines, value: content.primaryDisciplines.join(", ") },
    {
      label: sponsoredLabels.labels.sponsored,
      value: formatSponsored(athlete.experience.sponsored, sponsoredLabels),
    },
  ];

  return (
    <section
      id="portrait-introduction"
      className="px-4 py-20 sm:px-6 sm:py-28 xl:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[0.48fr_1fr] xl:items-end">
        <figure className="min-w-0">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
            {athlete.images.portrait ? (
              <Image
                src={athlete.images.portrait}
                alt=""
                fill
                sizes="(min-width: 1280px) 42vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-end bg-[linear-gradient(145deg,var(--surface-muted)_0%,var(--surface)_48%,var(--background)_100%)] p-6">
                <span className="max-w-40 text-sm font-semibold uppercase tracking-[0.22em] text-foreground/62">
                  {placeholder}
                </span>
              </div>
            )}
          </div>
        </figure>

        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {content.title}
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            {athlete.name}
          </h2>
          <p className="mt-6 max-w-reading text-xl leading-9 text-foreground/82">
            {content.shortBio}
          </p>
          <dl className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {meta.map((item) => (
              <div key={item.label} className="bg-surface p-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/54">
                  {item.label}
                </dt>
                <dd className="mt-2 text-lg font-semibold leading-tight text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function formatSponsored(
  value: boolean | null,
  labels: AthletePortraitIntroProps["sponsoredLabels"],
) {
  if (value === null) {
    return labels.unknown;
  }

  return value ? labels.yes : labels.no;
}
