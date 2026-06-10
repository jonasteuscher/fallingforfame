type ChapterIntroProps = {
  kicker: string;
  title: string;
  body: string;
  meta?: string;
};

export function ChapterIntro({ kicker, title, body, meta }: ChapterIntroProps) {
  return (
    <div className="min-w-0 max-w-3xl">
      <p className="mb-4 break-words text-sm font-semibold uppercase tracking-wide text-primary [overflow-wrap:anywhere]">
        {kicker}
      </p>
      <h1 className="max-w-full hyphens-auto break-words text-3xl font-semibold leading-tight text-foreground [overflow-wrap:anywhere] min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {meta ? (
        <p className="mt-4 break-words text-sm font-semibold uppercase tracking-wide text-accent [overflow-wrap:anywhere]">
          {meta}
        </p>
      ) : null}
      <p className="mt-5 max-w-reading break-words text-base leading-7 text-foreground/78 [overflow-wrap:anywhere] sm:mt-6 sm:text-xl sm:leading-8">
        {body}
      </p>
    </div>
  );
}
