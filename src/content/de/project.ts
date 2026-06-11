import type { TimelineItem } from "@/types/story";

export const project = {
  title: "Das Projekt",
  body: "Dieses Bachelorarbeitsprojekt verbindet akademische Forschung, Feldbeobachtungen, Interviews und multimediale Dokumentation zu einer zweisprachigen Longform-Webdokumentation.",
  heroKicker: "Dokumentarischer Ansatz",
  chapterIndicator: [
    { id: "project-documentation", label: "Dokumentation" },
    { id: "project-process", label: "Prozess" },
  ],
  documentation: {
    label: "Dokumentation",
    title: "Die Dokumentation",
    introEyebrow: "Mehr als ein Forschungsprojekt",
    introBody:
      "Falling for Fame entstand als Bachelorarbeit, doch die Fragen dahinter brauchten Bilder, Stimmen, Beobachtungen und interaktives Storytelling.",
    scrollIndicator: "Weiter scrollen",
    heroImage: {
      src: "/images/project/hero.JPG",
      alt: "Kameraaufbau in einem verschneiten Bergtal während der dokumentarischen Feldarbeit.",
      caption: "Dreh- und Beobachtungsort während der Produktion.",
    },
    why: {
      title: "Warum diese Dokumentation?",
      excerpt:
        "Text allein konnte die Umgebungen, Entscheidungen und Emotionen hinter dem Sport nicht vollständig vermitteln.",
      paragraphs: [
        "Falling for Fame entstand ursprünglich als Bachelorarbeit über den Einfluss von Social Media und Sponsoring auf Risikowahrnehmung und Sicherheitskultur im modernen BASE Jumping. Während der Recherche wurde jedoch deutlich, dass das Projekt über eine klassische wissenschaftliche Publikation hinausgehen musste.",
        "BASE Jumping ist visuell geprägt und erfahrungsbasiert. Entscheidungen, Emotionen und soziale Dynamiken entstehen in Situationen und Umgebungen, die für die meisten Menschen unsichtbar bleiben.",
        "Durch die Verbindung von wissenschaftlicher Forschung, Fotografie, Video, Interviews, Beobachtungen und interaktivem Storytelling soll ein umfassenderes Verständnis für die Menschen hinter dem Sport und die Realität ihrer Entscheidungen entstehen.",
      ],
      image: {
        src: "/images/project/hero.JPG",
        alt: "",
      },
    },
    people: {
      quote:
        "Obwohl BASE Jumping den Ausgangspunkt bildet, steht im Zentrum dieser Dokumentation der Mensch.",
      body: "Die Geschichten beleuchten den Umgang mit Risiko, Sichtbarkeit, Verantwortung, Gemeinschaft und persönlichen Zielen in einer zunehmend digitalisierten Welt.",
      image: {
        src: "/images/sport/hero1.jpg",
        alt: "",
      },
    },
    approach: {
      title: "Dokumentarischer Ansatz",
      intro:
        "Das Projekt verbindet mehrere Formen der Dokumentation zu einer vielschichtigen Perspektive.",
      items: [
        "Interviews",
        "Beobachtungen",
        "Fotografie",
        "Video",
        "Forschung",
        "Photo Elicitation",
      ],
    },
    interactive: {
      title: "Warum interaktiv?",
      paragraphs: [
        "Eine interaktive Dokumentation ermöglicht es Besuchenden, sich eigenständig durch Geschichten, Bilder, Interviews und Forschungserkenntnisse zu bewegen.",
        "Anstatt eine einzige Sichtweise vorzugeben, lädt das Projekt dazu ein, unterschiedliche Perspektiven zu entdecken und kritisch zu reflektieren.",
        "Jede gezeigte Person, jeder Ort und jede Erfahrung repräsentiert nur einen kleinen Ausschnitt einer vielfältigen und internationalen Community.",
      ],
      examples: [
        {
          label: "Story-Ebene",
          title: "Athletenportraits",
          body: "Individuelle Geschichten schaffen Kontext zu Motivation, Druck, Können und persönlichen Entscheidungen.",
        },
        {
          label: "Forschungsebene",
          title: "Erkenntnisse im Kontext",
          body: "Wissenschaftliche Fragen werden in zugängliche Momente übersetzt und mit Bildern und Interviews verbunden.",
        },
        {
          label: "Bildebene",
          title: "Feldokumentation",
          body: "Fotografie, Video und Beobachtungsnotizen zeigen den Produktionsprozess als Teil der Geschichte.",
        },
      ],
    },
    gallery: {
      title: "Hinter den Kulissen",
      intro:
        "Ein Einblick in Planung, Reisen, Gespräche, Feldarbeit und jene Momente, die ausserhalb des Kamerabilds stattfinden.",
      countLabel: "Bilder",
      closeLabel: "Bild schliessen",
      images: [
        {
          src: "/images/project/bts/me.jpg",
          alt: "Autor der Dokumentation auf einem Bergpfad während der Feldarbeit.",
        },
        {
          src: "/images/project/bts/DSC_1849.JPG",
          alt: "Hinter-den-Kulissen-Moment aus dem dokumentarischen Prozess.",
        },
        {
          src: "/images/project/bts/DSC_1894.JPG",
          alt: "Feldarbeitsfoto aus der Produktion der Dokumentation.",
        },
        {
          src: "/images/project/bts/DSC_1947.JPG",
          alt: "Hinter-den-Kulissen-Foto aus der Feldarbeit.",
        },
        {
          src: "/images/project/bts/DSC_1959.JPG",
          alt: "Via-Ferrata- und Sicherheitsschild während der dokumentarischen Feldarbeit.",
        },
        {
          src: "/images/project/bts/IMG_0226 2.JPG",
          alt: "Reise- und Produktionsmoment während der Dokumentation.",
        },
        {
          src: "/images/project/bts/IMG_0230 2.JPG",
          alt: "Hinter-den-Kulissen-Bild aus Reise und Feldarbeit.",
        },
        {
          src: "/images/project/bts/IMG_0232 2.JPG",
          alt: "Produktionsfoto aus dem Forschungsprozess.",
        },
        {
          src: "/images/project/bts/IMG_0935 2.JPG",
          alt: "Hinter-den-Kulissen-Bild der Produktionsumgebung.",
        },
        {
          src: "/images/project/bts/IMG_0942 2.JPG",
          alt: "Feldarbeitsfoto aus dem Dokumentationsprojekt.",
        },
        {
          src: "/images/project/bts/IMG_1169.jpg",
          alt: "Produktionsdetail aus der Dokumentation.",
        },
        {
          src: "/images/project/bts/IMG_9235.JPG",
          alt: "Hinter-den-Kulissen-Moment während der Dreharbeiten.",
        },
        {
          src: "/images/project/bts/IMG_9244.JPG",
          alt: "Produktionsfoto aus der dokumentarischen Feldarbeit.",
        },
        {
          src: "/images/project/bts/IMG_9262.JPG",
          alt: "Hinter-den-Kulissen-Foto aus der Projektproduktion.",
        },
        {
          src: "/images/project/bts/DSC_1908.JPG",
          alt: "Wingsuit-Athlet über einem Tal während der dokumentarischen Feldarbeit.",
        },
      ],
    },
    closing: {
      lines: [
        "Jeder Sprung erzählt eine Geschichte.",
        "Jede Geschichte hat einen Kontext.",
      ],
    },
  },
  sections: [
    {
      title: "Die Dokumentation",
      body: "Platzhalterinhalt für das dokumentarische Konzept, die Erzählstruktur und den multimedialen Ansatz von 'Falling for Fame?'.",
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
};

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
