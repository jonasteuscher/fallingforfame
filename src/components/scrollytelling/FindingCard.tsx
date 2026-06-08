import type { Finding } from "@/types/story";

type FindingCardProps = {
  finding: Finding;
};

export function FindingCard({ finding }: FindingCardProps) {
  return (
    <article className="border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {finding.theme}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">{finding.title}</h2>
      <p className="mt-4 leading-7 text-foreground/72">{finding.summary}</p>
    </article>
  );
}
