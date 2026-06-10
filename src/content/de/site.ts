import { athletes, athleteExperience, athleteMeta } from "@/content/de/athletes";
import { findings, findingsPage } from "@/content/de/findings";
import { chapters, home, statistics } from "@/content/de/home";
import { project, timeline } from "@/content/de/project";
import { sport } from "@/content/de/sport";

export const site = {
  languageName: "Deutsch",
  navigation: {
    home: "Start",
    athletes: "Athleten",
    findings: "Erkenntnisse",
    sport: "Über den Sport",
    project: "Das Projekt",
    menu: "Navigation",
    language: "Sprache",
    openMenu: "Navigationsmenü öffnen",
    closeMenu: "Navigationsmenü schliessen",
    openMenuShort: "Menü öffnen",
    closeMenuShort: "Menü schliessen",
  },
  home,
  athletes,
  project,
  sport,
  findings: findingsPage,
};

export { athleteExperience, athleteMeta, chapters, findings, statistics, timeline };
