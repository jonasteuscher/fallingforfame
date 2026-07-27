import { athletes, athleteExperience, athleteMeta } from "@/content/de/athletes";
import { findings, findingsPage } from "@/content/de/findings";
import { home } from "@/content/de/home";
import { imprint } from "@/content/de/imprint";
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
  notFound: {
    eyebrow: "404 · Seite nicht gefunden",
    title: "Diese Seite ist einen anderen Weg gegangen",
    description:
      "Die gesuchte Seite existiert nicht, wurde verschoben oder ist nicht mehr verfügbar.",
    button: "Zur Startseite",
  },
  footer: {
    description:
      "'Falling for Fame?' bereitet eine bilinguale multimediale Dokumentationsstruktur für Bachelorarbeit, Interviews und Felddokumentation vor.",
    copyright: "© Jonas Teuscher 2026",
    imprint: "Impressum",
  },
  home,
  athletes,
  project,
  sport,
  findings: findingsPage,
  imprint,
};

export { athleteExperience, athleteMeta, findings, timeline };
