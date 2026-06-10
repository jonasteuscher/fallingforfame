type StatisticBlockProps = {
  value: string;
  label: string;
  detail?: string;
};

export function StatisticBlock({ value, label, detail }: StatisticBlockProps) {
  return (
    <div className="min-w-0 border border-border bg-surface p-4 sm:p-6">
      <p className="break-words text-4xl font-semibold text-primary sm:text-5xl">
        {value}
      </p>
      <h2 className="mt-4 text-lg font-semibold text-foreground sm:text-xl">{label}</h2>
      {detail ? <p className="mt-3 text-foreground/70">{detail}</p> : null}
    </div>
  );
}
