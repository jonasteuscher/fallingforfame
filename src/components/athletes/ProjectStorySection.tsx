import { ProjectFeature } from "@/components/athletes/ProjectFeature";
import type { Locale } from "@/i18n/config";
import type { AthleteCurrentProject } from "@/types/athlete";

type ProjectStorySectionProps = {
  project?: AthleteCurrentProject;
  locale: Locale;
};

export function ProjectStorySection({
  project,
  locale,
}: ProjectStorySectionProps) {
  return (
    <ProjectFeature
      athleteName="Lukas Loibl"
      project={project}
      status="current"
      locale={locale}
    />
  );
}
