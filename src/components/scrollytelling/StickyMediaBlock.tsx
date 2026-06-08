import type { ReactNode } from "react";

type StickyMediaBlockProps = {
  media: ReactNode;
  children: ReactNode;
};

export function StickyMediaBlock({ media, children }: StickyMediaBlockProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,32rem)]">
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">{media}</div>
      <div className="space-y-8 py-4">{children}</div>
    </div>
  );
}
