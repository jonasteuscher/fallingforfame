import { athletes, athleteExperience, athleteMeta } from "@/content/en/athletes";
import { findings, findingsPage } from "@/content/en/findings";
import { chapters, home, statistics } from "@/content/en/home";
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
  home,
  athletes,
  project,
  sport,
  findings: findingsPage,
};

export { athleteExperience, athleteMeta, chapters, findings, statistics, timeline };
