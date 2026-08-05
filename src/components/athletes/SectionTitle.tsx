import type { ReactNode } from "react";

type SectionTitleSize =
  | "standard"
  | "standardStatic"
  | "interviewSplit"
  | "project"
  | "scroll";

const sectionTitleClassNames: Record<SectionTitleSize, string> = {
  standard:
    "mt-5 max-w-5xl whitespace-pre-line break-words text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0",
  standardStatic:
    "mt-5 max-w-5xl whitespace-pre-line break-words text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere]",
  interviewSplit:
    "mt-5 max-w-4xl whitespace-pre-line break-normal text-[clamp(2.75rem,4.8vw,5.25rem)] font-semibold uppercase leading-[0.9] text-foreground [overflow-wrap:normal] [text-wrap:balance] [word-break:normal] motion-safe:animate-[fade-in-up_700ms_ease-out_forwards] motion-safe:translate-y-4 motion-safe:opacity-0 max-sm:text-[2.5rem] max-sm:[overflow-wrap:anywhere] min-[1700px]:text-[5.5rem]",
  project:
    "mt-5 max-w-6xl whitespace-pre-line break-words text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.88] text-foreground [overflow-wrap:anywhere] motion-safe:animate-[fade-in-up_700ms_ease-out_100ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0",
  scroll:
    "mt-4 max-w-4xl whitespace-pre-line text-[clamp(3.25rem,9vw,8rem)] font-semibold uppercase leading-[0.88] text-foreground motion-safe:animate-[fade-in-up_700ms_ease-out_120ms_forwards] motion-safe:translate-y-4 motion-safe:opacity-0",
};

type SectionTitleProps = {
  id: string;
  children: ReactNode;
  size?: SectionTitleSize;
};

export function SectionTitle({ id, children, size = "standard" }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={`athlete-section-title ${sectionTitleClassNames[size]}`}
    >
      {children}
    </h2>
  );
}
