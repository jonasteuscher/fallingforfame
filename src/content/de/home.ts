import type { StoryChapter } from "@/types/story";

export const home = {
  kicker: "Multimedia-Dokumentation",
  title: "Falling for Fame",
  subtitle: "Mythos oder Realität im modernen BASE Jumping?",
  intro:
    "Eine Scrollytelling-Dokumentation über Social Media, Risikoverhalten, Sicherheitskultur und Athletenidentität im zeitgenössischen BASE Jumping.",
};

export const chapters: StoryChapter[] = [
  {
    id: "sichtbarkeit",
    kicker: "Kapitel 01",
    title: "Sichtbarkeit verändert den Sprung, bevor er passiert",
    body: "Die Dokumentation beginnt vor dem Exit Point. Kameras, Follower und Sponsorenerwartungen prägen, wie Risiko besprochen, inszeniert und erinnert wird.",
    image: {
      src: "/images/chapters/visibility.jpg",
      alt: "Berglandschaft als Platzhalter für spätere Dokumentarfotografie",
      caption: "Platzhalter für Kapitelfotografie.",
    },
  },
  {
    id: "sicherheit",
    kicker: "Kapitel 02",
    title: "Sicherheitskultur wird von Menschen getragen",
    body: "Regeln, Mentoring und informelle Community-Normen bilden eine soziale Infrastruktur rund um Entscheidungen, die von aussen oft nur als individuelles Risiko erscheinen.",
  },
  {
    id: "identitaet",
    kicker: "Kapitel 03",
    title: "Athletenidentität liegt zwischen Handwerk und Publikum",
    body: "BASE Jumper bewegen sich zwischen technischer Meisterschaft, persönlicher Bedeutung und dem Druck, sichtbar zu sein.",
  },
];

export const statistics = [
  {
    value: "5",
    label: "Athletenportraits",
    detail: "Vorbereitet für interviewbasierte Multimedia-Kapitel.",
  },
  {
    value: "2",
    label: "Sprachen",
    detail: "Englische und deutsche Inhaltsstrukturen sind von Beginn an verfügbar.",
  },
  {
    value: "∞",
    label: "Medienebenen",
    detail:
      "Fotografie, Audio, Video und Feldnotizen können pro Kapitel kombiniert werden.",
  },
];
