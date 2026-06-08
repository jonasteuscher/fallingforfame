import type { Finding } from "@/types/story";

type FindingCardProps = {
  finding: Finding;
};

export function FindingCard({ finding }: FindingCardProps) {
  return (
    <article className="min-w-0 border border-border bg-surface p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {finding.theme}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
        {finding.title}
      </h2>
      <p className="mt-4 leading-7 text-foreground/72">{finding.summary}</p>
    </article>
  );
}
