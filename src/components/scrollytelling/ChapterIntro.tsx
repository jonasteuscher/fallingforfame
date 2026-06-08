type ChapterIntroProps = {
  kicker: string;
  title: string;
  body: string;
  meta?: string;
};

export function ChapterIntro({ kicker, title, body, meta }: ChapterIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
        {kicker}
      </p>
      <h1 className="text-5xl font-semibold leading-tight text-foreground md:text-7xl">
        {title}
      </h1>
      {meta ? (
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-accent">
          {meta}
        </p>
      ) : null}
      <p className="mt-6 max-w-reading text-xl leading-8 text-foreground/78">{body}</p>
    </div>
  );
}
