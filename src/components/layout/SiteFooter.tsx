import Link from "next/link";

import { WorkTitleText } from "@/components/text/WorkTitleText";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedImprintPath } from "@/i18n/navigation";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const footer = getDictionary(locale).site.footer;

  return (
    <footer className="border-t border-border bg-background px-4 pt-10 pb-28 text-sm text-foreground/70 sm:px-6 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p>
            <WorkTitleText>{footer.description}</WorkTitleText>
          </p>
          <p className="mt-4">{footer.copyright}</p>
        </div>
        <Link
          href={localizedImprintPath(locale)}
          className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-foreground/72 transition hover:text-primary focus-visible:rounded-sm focus-visible:text-primary"
        >
          {footer.imprint}
        </Link>
      </div>
    </footer>
  );
}
