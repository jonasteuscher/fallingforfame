import { athletes, athleteExperience, athleteMeta } from "@/content/en/athletes";
import { findings, findingsPage } from "@/content/en/findings";
import { home } from "@/content/en/home";
import { imprint } from "@/content/en/imprint";
import { project, timeline } from "@/content/en/project";
import { sport } from "@/content/en/sport";

export const site = {
  languageName: "English",
  navigation: {
    home: "Home",
    athletes: "Athletes",
    findings: "Findings",
    sport: "About the Sport",
    project: "The Project",
    menu: "Navigation",
    language: "Language",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    openMenuShort: "Open menu",
    closeMenuShort: "Close menu",
  },
  notFound: {
    eyebrow: "404 · Page not found",
    title: "This page has taken a different path",
    description:
      "The page you are looking for does not exist, has been moved or is no longer available.",
    button: "Back to home",
  },
  footer: {
    description:
      "Falling for Fame? prepares a bilingual multimedia documentary structure for thesis research, interviews and field documentation.",
    copyright: "© Jonas Teuscher 2026",
    imprint: "Imprint",
  },
  home,
  athletes,
  project,
  sport,
  findings: findingsPage,
  imprint,
};

export { athleteExperience, athleteMeta, findings, timeline };
