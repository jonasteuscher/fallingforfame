import type { Locale } from "@/i18n/config";
import type { Athlete } from "@/types/athlete";

import { ProjectFeature } from "./ProjectFeature";

type FutureProjectFeatureProps = {
  athlete: Athlete;
  locale: Locale;
};

export function FutureProjectFeature({
  athlete,
  locale,
}: FutureProjectFeatureProps) {
  return (
    <ProjectFeature
      athleteName={athlete.name}
      project={athlete.futureProject}
      status="future"
      locale={locale}
    />
  );
}
