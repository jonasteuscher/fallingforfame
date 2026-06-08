type ChapterIntroProps = {
  kicker: string;
  title: string;
  body: string;
};

export function ChapterIntro({ kicker, title, body }: ChapterIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
        {kicker}
      </p>
      <h1 className="text-5xl font-semibold leading-tight text-foreground md:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-reading text-xl leading-8 text-foreground/78">{body}</p>
    </div>
  );
}
