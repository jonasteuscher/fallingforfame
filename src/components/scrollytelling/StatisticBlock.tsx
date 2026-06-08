type StatisticBlockProps = {
  value: string;
  label: string;
  detail?: string;
};

export function StatisticBlock({ value, label, detail }: StatisticBlockProps) {
  return (
    <div className="border border-border bg-surface p-6">
      <p className="text-5xl font-semibold text-primary">{value}</p>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{label}</h2>
      {detail ? <p className="mt-3 text-foreground/70">{detail}</p> : null}
    </div>
  );
}
