type MediaCaptionProps = {
  caption?: string;
  credit?: string;
};

export function MediaCaption({ caption, credit }: MediaCaptionProps) {
  if (!caption && !credit) {
    return null;
  }

  return (
    <figcaption className="mt-3 text-sm leading-6 text-foreground/65">
      {caption}
      {caption && credit ? " " : null}
      {credit ? <span>Credit: {credit}</span> : null}
    </figcaption>
  );
}
