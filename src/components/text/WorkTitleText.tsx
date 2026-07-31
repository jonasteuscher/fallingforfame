import type { ReactNode } from "react";

const workTitle = "Falling for Fame?";

type WorkTitleTextProps = {
  children: string;
};

export function WorkTitleText({ children }: WorkTitleTextProps) {
  return <>{formatWorkTitle(children)}</>;
}

export function formatWorkTitle(text: string): ReactNode {
  const segments = text.split(workTitle);

  if (segments.length === 1) {
    return text;
  }

  return segments.flatMap((segment, index) => {
    if (index === segments.length - 1) {
      return segment;
    }

    return [
      segment,
      <em key={`${workTitle}-${index}`} className="italic">
        {workTitle}
      </em>,
    ];
  });
}
