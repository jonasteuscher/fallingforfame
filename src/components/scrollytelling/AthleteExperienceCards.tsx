import type { AthleteExperience } from "@/types/athlete";

type AthleteExperienceLabels = {
  unknown: string;
  yes: string;
  no: string;
  labels: Record<keyof AthleteExperience, string>;
};

type AthleteExperienceCardsProps = {
  experience: AthleteExperience;
  labels: AthleteExperienceLabels;
  locale: string;
};

export function AthleteExperienceCards({
  experience,
  labels,
  locale,
}: AthleteExperienceCardsProps) {
  const cards: Array<{
    key: keyof AthleteExperience;
    value: string;
    label: string;
  }> = [
    {
      key: "skydiveSeasons",
      value: formatNullableNumber(experience.skydiveSeasons, locale, labels),
      label: labels.labels.skydiveSeasons,
    },
    {
      key: "skydives",
      value: formatNullableNumber(experience.skydives, locale, labels),
      label: labels.labels.skydives,
    },
    {
      key: "baseSeasons",
      value: formatNullableNumber(experience.baseSeasons, locale, labels),
      label: labels.labels.baseSeasons,
    },
    {
      key: "basejumps",
      value: formatNullableNumber(experience.basejumps, locale, labels),
      label: labels.labels.basejumps,
    },
    {
      key: "socialMediaReach",
      value: formatNullableNumber(experience.socialMediaReach, locale, labels),
      label: labels.labels.socialMediaReach,
    },
  ];

  return (
    <section aria-label="Athlete experience statistics">
      <dl className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.key} className="min-w-0 border border-border bg-surface p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/62">
              {card.label}
            </dt>
            <dd className="mt-3 break-words text-2xl font-semibold leading-tight text-primary md:text-3xl">
              {card.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatNullableNumber(
  value: number | null,
  locale: string,
  labels: AthleteExperienceLabels,
) {
  if (value === null) {
    return labels.unknown;
  }

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, locale === "de" ? "’" : ",");
}
