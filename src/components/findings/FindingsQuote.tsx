type FindingsQuoteProps = {
  quote: string;
  source: string;
  className?: string;
};

export function FindingsQuote({ quote, source, className = "" }: FindingsQuoteProps) {
  return (
    <figure className={["border-l-2 border-primary pl-5", className].join(" ")}>
      <blockquote className="text-2xl font-semibold leading-tight text-foreground sm:text-4xl">
        <span aria-hidden="true">“</span>
        {quote}
        <span aria-hidden="true">”</span>
      </blockquote>
      <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/58">
        {source}
      </figcaption>
    </figure>
  );
}
