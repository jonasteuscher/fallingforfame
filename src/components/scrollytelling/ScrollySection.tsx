import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScrollySectionProps = {
  id?: string;
  children: ReactNode;
  fullHeight?: boolean;
  className?: string;
};

export function ScrollySection({
  id,
  children,
  fullHeight = true,
  className,
}: ScrollySectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative flex scroll-mt-20 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20",
        fullHeight && "min-h-[calc(100dvh-4rem)] md:min-h-screen",
        className,
      )}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
    </section>
  );
}
