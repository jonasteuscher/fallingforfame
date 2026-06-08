type ChapterDividerProps = {
  label: string;
};

export function ChapterDivider({ label }: ChapterDividerProps) {
  return (
    <div className="border-y border-border py-6 text-center text-sm font-semibold uppercase tracking-wide text-foreground/70">
      {label}
    </div>
  );
}
