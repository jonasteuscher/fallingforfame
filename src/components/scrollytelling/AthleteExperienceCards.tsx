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
  const numberFormatter = new Intl.NumberFormat(locale);
  const cards: Array<{
    key: keyof AthleteExperience;
    value: string;
    label: string;
  }> = [
    {
      key: "skydiveSeasons",
      value: formatNullableNumber(experience.skydiveSeasons, numberFormatter, labels),
      label: labels.labels.skydiveSeasons,
    },
    {
      key: "skydives",
      value: formatNullableNumber(experience.skydives, numberFormatter, labels),
      label: labels.labels.skydives,
    },
    {
      key: "baseSeasons",
      value: formatNullableNumber(experience.baseSeasons, numberFormatter, labels),
      label: labels.labels.baseSeasons,
    },
    {
      key: "basejumps",
      value: formatNullableNumber(experience.basejumps, numberFormatter, labels),
      label: labels.labels.basejumps,
    },
    {
      key: "sponsored",
      value: formatSponsored(experience.sponsored, labels),
      label: labels.labels.sponsored,
    },
    {
      key: "socialMediaReach",
      value: formatNullableNumber(experience.socialMediaReach, numberFormatter, labels),
      label: labels.labels.socialMediaReach,
    },
  ];

  return (
    <section aria-label="Athlete experience statistics">
      <dl className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
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
  numberFormatter: Intl.NumberFormat,
  labels: AthleteExperienceLabels,
) {
  return value === null ? labels.unknown : numberFormatter.format(value);
}

function formatSponsored(value: boolean | null, labels: AthleteExperienceLabels) {
  if (value === null) {
    return labels.unknown;
  }

  return value ? labels.yes : labels.no;
}
