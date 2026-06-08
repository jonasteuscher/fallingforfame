import type { Finding, StoryChapter, TimelineItem } from "@/types/story";

export const site = {
  languageName: "Deutsch",
  navigation: {
    home: "Start",
    athletes: "Athleten",
    about: "Projekt",
    findings: "Erkenntnisse",
  },
  home: {
    kicker: "Multimedia-Dokumentation",
    title: "Falling for Fame",
    subtitle: "Mythos oder Realität im modernen BASE Jumping?",
    intro:
      "Eine Scrollytelling-Dokumentation über Social Media, Risikoverhalten, Sicherheitskultur und Athletenidentität im zeitgenoessischen BASE Jumping.",
  },
  athletes: {
    title: "Athletenportraits",
    intro:
      "Drei Platzhalterportraits bereiten die Struktur für Interviews, Field Recordings, Fotografie und dokumentarisches Video vor.",
  },
  about: {
    title: "Über das Projekt",
    body: "Dieses Bachelorarbeitsprojekt verbindet akademische Forschung, Feldbeobachtungen, Interviews und multimediale Dokumentation zu einer zweisprachigen Longform-Webdokumentation.",
  },
  findings: {
    title: "Forschungserkenntnisse",
    intro:
      "Eine erste Struktur für die Auseinandersetzung mit digitaler Sichtbarkeit, Sponsoring, Risiko und Sicherheitskultur.",
  },
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
    body: "BASE Jumper bewegen sich zwischen technischer Meisterschaft, persoenlicher Bedeutung und dem Druck, sichtbar zu sein.",
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
      "Fotografie, Audio, Video und Feldnotizen koennen pro Kapitel kombiniert werden.",
  },
];

export const findings: Finding[] = [
  {
    id: "sichtbarkeit-druck",
    theme: "visibility",
    title: "Sichtbarkeit kann zur Teilnahmebedingung werden",
    summary:
      "Digitale Aufmerksamkeit beeinflusst Dokumentationspraktiken und kann verändern, was als erfolgreicher Sprung gilt.",
  },
  {
    id: "community-sicherheit",
    theme: "safety",
    title: "Sicherheitskultur ist sozial, nicht nur technisch",
    summary:
      "Platzhalter aus Beobachtung und Interview verweisen auf Mentoring, Peer Feedback und geteilte Normen.",
  },
  {
    id: "sponsoring-risiko",
    theme: "sponsorship",
    title: "Sponsoring erschwert Risikokommunikation",
    summary:
      "Die spätere Analyse kann Markenpräsenz, Autonomie der Athleten und die oeffentliche Rahmung von Gefahr verbinden.",
  },
];

export const timeline: TimelineItem[] = [
  {
    date: "Forschung",
    title: "Literatur und Thesis-Framing",
    body: "Akademischer Kontext, Forschungsfragen und Interviewdesign.",
  },
  {
    date: "Feldarbeit",
    title: "Beobachtung und Dokumentation",
    body: "Fotografie, Notizen, Audiointerviews und Videomaterial.",
  },
  {
    date: "Publikation",
    title: "Interaktive Dokumentation",
    body: "Zweisprachige Scrollytelling-Kapitel mit barrierefreien Medien.",
  },
];
