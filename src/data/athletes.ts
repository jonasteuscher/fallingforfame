import type { Athlete, AthleteExperience } from "@/types/athlete";

const unknownExperience: AthleteExperience = {
  skydiveSeasons: null,
  skydives: null,
  baseSeasons: null,
  basejumps: null,
  sponsored: null,
  socialMediaReach: null,
};

export const athletes: Athlete[] = [
  {
    id: "marcel-geser",
    slug: "marcel-geser",
    name: "Marcel Geser",
    age: null,
    country: "Switzerland",
    experience: unknownExperience,
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Marcel Geser",
        biography:
          "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
        quote: "The camera changes the atmosphere, even when nobody says it out loud.",
      },
      de: {
        chapterKicker: "Portraet",
        chapterTitle: "Marcel Geser",
        biography:
          "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
        quote: "Die Kamera veraendert die Stimmung, auch wenn es niemand ausspricht.",
      },
    },
  },
  {
    id: "niclas-strohmeier",
    slug: "niclas-strohmeier",
    name: "Niclas Strohmeier",
    age: null,
    country: "Germany",
    experience: unknownExperience,
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Niclas Strohmeier",
        biography:
          "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
        quote: "Most decisions happen before the jump day even begins.",
      },
      de: {
        chapterKicker: "Portraet",
        chapterTitle: "Niclas Strohmeier",
        biography:
          "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
        quote: "Die meisten Entscheidungen fallen, bevor der Sprungtag beginnt.",
      },
    },
  },
  {
    id: "lukas-loibl",
    slug: "lukas-loibl",
    name: "Lukas Loibl",
    age: null,
    country: "Austria",
    experience: unknownExperience,
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Lukas Loibl",
        biography:
          "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
        quote: "I want the story to show the work, not only the moment of impact.",
      },
      de: {
        chapterKicker: "Portraet",
        chapterTitle: "Lukas Loibl",
        biography:
          "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
        quote:
          "Die Geschichte soll die Arbeit zeigen, nicht nur den Moment des Aufpralls.",
      },
    },
  },
  {
    id: "josef-braun",
    slug: "josef-braun",
    name: "Josef Braun",
    age: null,
    country: "Germany",
    experience: unknownExperience,
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Josef Braun",
        biography:
          "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
        quote:
          "This page is ready for the athlete's voice once the interview content is edited.",
      },
      de: {
        chapterKicker: "Portraet",
        chapterTitle: "Josef Braun",
        biography:
          "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
        quote:
          "Diese Seite ist bereit fuer die Stimme des Athleten, sobald das Interviewmaterial redigiert ist.",
      },
    },
  },
  {
    id: "tim-howell",
    slug: "tim-howell",
    name: "Tim Howell",
    age: null,
    country: "United Kingdom",
    experience: unknownExperience,
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Tim Howell",
        biography:
          "A placeholder athlete profile prepared for future interview material, observation notes and multimedia documentation.",
        quote:
          "This page is ready for the athlete's voice once the interview content is edited.",
      },
      de: {
        chapterKicker: "Portraet",
        chapterTitle: "Tim Howell",
        biography:
          "Ein Platzhalterprofil fuer zukuenftiges Interviewmaterial, Beobachtungsnotizen und multimediale Dokumentation.",
        quote:
          "Diese Seite ist bereit fuer die Stimme des Athleten, sobald das Interviewmaterial redigiert ist.",
      },
    },
  },
];

export function getAthleteBySlug(slug: string) {
  return athletes.find((athlete) => athlete.slug === slug);
}
