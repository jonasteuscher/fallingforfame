type PullQuoteProps = {
  quote: string;
  attribution?: string;
};

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <figure className="border-l-4 border-primary pl-6">
      <blockquote className="text-2xl font-medium leading-snug text-foreground">
        {quote}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-4 text-sm uppercase tracking-wide text-foreground/60">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
