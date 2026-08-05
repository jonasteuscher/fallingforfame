import type { ReactNode } from "react";

type StickyMediaBlockProps = {
  media: ReactNode;
  children: ReactNode;
};

export function StickyMediaBlock({ media, children }: StickyMediaBlockProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)] xl:gap-10">
      <div className="min-w-0 xl:sticky xl:top-24 xl:h-[calc(100dvh-8rem)] motion-reduce:xl:static motion-reduce:xl:h-auto">
        {media}
      </div>
      <div className="min-w-0 space-y-6 py-2 sm:space-y-8 sm:py-4">{children}</div>
    </div>
  );
}
