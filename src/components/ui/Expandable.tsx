import type { ReactNode } from "react";

type ExpandableProps = {
  title: string;
  children: ReactNode;
};

export function Expandable({ title, children }: ExpandableProps) {
  return (
    <details className="group border-t border-border py-4">
      <summary className="cursor-pointer list-none font-medium text-foreground">
        {title}
        <span className="float-right text-primary group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-foreground/75">{children}</div>
    </details>
  );
}
