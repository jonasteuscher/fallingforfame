import type { Finding, StoryChapter, TimelineItem } from "@/types/story";

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
  home: {
    kicker: "Multimedia-Dokumentation",
    title: "Falling for Fame",
    subtitle: "Mythos oder Realität im modernen BASE Jumping?",
    intro:
      "Eine Scrollytelling-Dokumentation über Social Media, Risikoverhalten, Sicherheitskultur und Athletenidentität im zeitgenössischen BASE Jumping.",
  },
  athletes: {
    title: "Athletenportraits",
    intro:
      "Drei Platzhalterportraits bereiten die Struktur für Interviews, Field Recordings, Fotografie und dokumentarisches Video vor.",
  },
  project: {
    title: "Das Projekt",
    body: "Dieses Bachelorarbeitsprojekt verbindet akademische Forschung, Feldbeobachtungen, Interviews und multimediale Dokumentation zu einer zweisprachigen Longform-Webdokumentation.",
    sections: [
      {
        title: "Die Dokumentation",
        body: "Platzhalterinhalt für das dokumentarische Konzept, die Erzählstruktur und den multimedialen Ansatz von Falling for Fame.",
      },
      {
        title: "Forschungshintergrund",
        body: "Platzhalterinhalt für den akademischen Kontext, die Literaturrecherche und die leitenden Forschungsfragen.",
      },
      {
        title: "Bachelorarbeitskontext",
        body: "Platzhalterinhalt für den Rahmen der Thesis, den Produktionsumfang und die Verbindung von Forschung und Gestaltung.",
      },
      {
        title: "Methodik",
        body: "Platzhalterinhalt für qualitative Methoden, Scrollytelling-Entscheidungen und Dokumentationsstrategie.",
      },
      {
        title: "Interviews",
        body: "Platzhalterinhalt für Athleteninterviews, Expertengespräche und redaktionelle Auswahl.",
      },
      {
        title: "Beobachtungen",
        body: "Platzhalterinhalt für Feldbeobachtungen, Notizen an Sprungtagen und kontextuelle Dokumentation.",
      },
      {
        title: "Photo Elicitation",
        body: "Platzhalterinhalt dazu, wie Bilder als Gesprächsimpulse in Interviews und Reflexionen eingesetzt werden.",
      },
      {
        title: "Projektziele",
        body: "Platzhalterinhalt für Kommunikationsziele, Bedürfnisse des Publikums und erwartete Lernergebnisse.",
      },
      {
        title: "Credits",
        body: "Platzhalterinhalt für Mitwirkende, Interviewpartner, Fotografie, Video, Audio und fachliche Betreuung.",
      },
    ],
  },
  sport: {
    title: "Über den Sport",
    body: "Ein Platzhalterüberblick über BASE Jumping für Leserinnen und Leser, die Kontext vor den Athletenportraits und Forschungserkenntnissen benötigen.",
    sections: [
      {
        title: "Was ist BASE Jumping?",
        body: "Platzhalterinhalt zur Erklärung von Fallschirmsprüngen von festen Objekten und der Bedeutung von Building, Antenna, Span und Earth.",
      },
      {
        title: "Geschichte des BASE Jumpings",
        body: "Platzhalterinhalt für frühe Entwicklungen, Pioniersprünge und die Evolution des Sports.",
      },
      {
        title: "Unterschied zwischen Skydiving und BASE Jumping",
        body: "Platzhalterinhalt zum Vergleich von Flugzeugausstieg, Ausstieg von festen Objekten, Höhe, Reaktionszeit und Ausbildungswegen.",
      },
      {
        title: "Ausrüstung",
        body: "Platzhalterinhalt für Schirme, Container, Pilot Chutes, Schutzausrüstung und spezialisierte Konfigurationen.",
      },
      {
        title: "Risiko- und Sicherheitskultur",
        body: "Platzhalterinhalt für Risikoabwägung, Wetter, Objektauswahl, Mentoring und Entscheidungsnormen.",
      },
      {
        title: "Community und Ethik",
        body: "Platzhalterinhalt für Zugang, Diskretion, lokale Beziehungen und Verantwortung innerhalb der BASE-Community.",
      },
      {
        title: "Wingsuit Flying",
        body: "Platzhalterinhalt zu Wingsuit-Flug, Geländenähe und der zusätzlichen Skill-Progression.",
      },
      {
        title: "Moderne Entwicklungen",
        body: "Platzhalterinhalt für mediale Sichtbarkeit, Technologie, Training, Sponsoring und aktuelle Debatten.",
      },
    ],
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

export const athleteMeta = {
  from: "Aus",
  fromUnknown: "Aus unbekannt",
  ageUnknown: "Alter unbekannt",
  years: "Jahre",
  countries: {
    Austria: "Österreich",
    Germany: "Deutschland",
    Switzerland: "der Schweiz",
    "United Kingdom": "dem Vereinigten Königreich",
  },
};

export const athleteExperience = {
  unknown: "Unbekannt",
  yes: "Ja",
  no: "Nein",
  labels: {
    skydiveSeasons: "Skydive Saisons",
    skydives: "Skydives",
    baseSeasons: "BASE Saisons",
    basejumps: "BASE Jumps",
    sponsored: "Gesponsert",
    socialMediaReach: "Gesamtreichweite Social Media",
  },
};

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
      "Die spätere Analyse kann Markenpräsenz, Autonomie der Athleten und die öffentliche Rahmung von Gefahr verbinden.",
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
