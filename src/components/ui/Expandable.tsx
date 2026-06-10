import type { ReactNode } from "react";

type ExpandableProps = {
  title: string;
  children: ReactNode;
};

export function Expandable({ title, children }: ExpandableProps) {
  return (
    <details className="group border-t border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
        <span>{title}</span>
        <span className="shrink-0 text-primary transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-foreground/75">{children}</div>
    </details>
  );
}
