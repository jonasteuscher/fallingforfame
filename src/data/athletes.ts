import type { Athlete, AthleteExperience } from "@/types/athlete";

const emptyMedia = {
  audio: [],
  video: [],
  quotes: [],
  links: [],
  articles: [],
};

function images(
  hero: string | null = null,
  portrait: string | null = null,
): Athlete["images"] {
  return {
    hero,
    portrait,
    gallery: [],
  };
}

function experience(
  skydiveSeasons: number,
  skydives: number,
  baseSeasons: number,
  basejumps: number,
  sponsored: boolean,
  socialMediaReach: number | null,
): AthleteExperience {
  return {
    skydiveSeasons,
    skydives,
    baseSeasons,
    basejumps,
    sponsored,
    socialMediaReach,
  };
}

export const athletes: Athlete[] = [
  {
    id: "marcel-geser",
    slug: "marcel-geser",
    name: "Marcel Geser",
    age: 45,
    country: "Switzerland",
    platforms: [],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(
      "/images/athletes/marcel-geser/hero.jpg",
      "/images/athletes/marcel-geser/profile.jpg",
    ),
    experience: experience(14, 850, 13, 1500, false, null),
    content: {
      en: {
        title: "Hobby BASE Jumper",
        shortBio:
          "Swiss paragliding pilot and experienced BASE jumper with more than a decade of experience in the sport. A former Swiss BASE Association president for over 10 years, his focus spans terminal, wingsuit and tracking jumps while maintaining a hobby-based approach to BASE jumping.",
        intro:
          "Swiss paragliding pilot, experienced BASE jumper and former Swiss BASE Association president for over 10 years.",
        baseStoryTitle: "Story in development",
        baseStory:
          "The detailed story will be added once interview material has been reviewed.",
        profession: "Paragliding Pilot",
        role: "Hobby BASE Jumper",
        residence: "Switzerland",
        primaryDisciplines: ["Terminal", "Wingsuit", "Tracking"],
      },
      de: {
        title: "Hobby BASE Jumper",
        shortBio:
          "Schweizer Gleitschirmpilot und erfahrener BASE Jumper mit über einem Jahrzehnt Erfahrung im Sport. Als ehemaliger Präsident der Swiss BASE Association über mehr als 10 Jahre liegt sein Schwerpunkt auf Terminal-, Wingsuit- und Tracking-Sprüngen, die er als ambitionierter Hobbysportler ausübt.",
        intro:
          "Schweizer Gleitschirmpilot, erfahrener BASE Jumper und ehemaliger Präsident der Swiss BASE Association über mehr als 10 Jahre.",
        baseStoryTitle: "Geschichte in Entwicklung",
        baseStory:
          "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
        profession: "Gleitschirmpilot",
        role: "Hobby BASE Jumper",
        residence: "Schweiz",
        primaryDisciplines: ["Terminal", "Wingsuit", "Tracking"],
      },
    },
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "niclas-strohmeier",
    slug: "niclas-strohmeier",
    name: "Niclas Strohmeier",
    age: 28,
    country: "Germany",
    platforms: ["Instagram", "YouTube"],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(),
    experience: experience(12, 630, 9, 1000, false, 500000),
    content: {
      en: {
        title: "Hobby / Semiprofessional",
        shortBio:
          "German athlete living in Switzerland with a background in tourism. Active on Instagram and YouTube, he combines a strong online presence with nearly a decade of BASE jumping experience.",
        intro:
          "German athlete living in Switzerland with a background in tourism.",
        baseStoryTitle: "Story in development",
        baseStory:
          "The detailed story will be added once interview material has been reviewed.",
        profession: "Tourism Professional",
        role: "Hobby / Semiprofessional",
        residence: "Switzerland",
        primaryDisciplines: ["Terminal"],
      },
      de: {
        title: "Hobby / Semiprofessionell",
        shortBio:
          "Deutscher Athlet mit Wohnsitz in der Schweiz und beruflichem Hintergrund im Tourismus. Mit einer grossen Reichweite auf Instagram und YouTube verbindet er digitale Sichtbarkeit mit langjähriger BASE-Erfahrung.",
        intro:
          "Deutscher Athlet mit Wohnsitz in der Schweiz und beruflichem Hintergrund im Tourismus.",
        baseStoryTitle: "Geschichte in Entwicklung",
        baseStory:
          "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
        profession: "Tourismusfachmann",
        role: "Hobby / Semiprofessionell",
        residence: "Schweiz",
        primaryDisciplines: ["Terminal"],
      },
    },
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "josef-braun",
    slug: "josef-braun",
    name: "Josef Braun",
    age: 27,
    country: "Germany",
    platforms: ["Instagram"],
    sponsorship: {
      en: null,
      de: null,
    },
    images: images(),
    experience: experience(8, 800, 5, 1500, false, 280000),
    content: {
      en: {
        title: "Semiprofessional",
        shortBio:
          "German athlete based in Switzerland working as a wind tunnel instructor, BASE coach and video creator. His work combines athletic performance, coaching and media production.",
        intro:
          "German athlete based in Switzerland working as a wind tunnel instructor, BASE coach and video creator.",
        baseStoryTitle: "Story in development",
        baseStory:
          "The detailed story will be added once interview material has been reviewed.",
        profession: "Wind Tunnel Instructor, BASE Coach and Video Creator",
        role: "Hobby / Semiprofessional",
        residence: "Switzerland",
        primaryDisciplines: ["Tracking"],
      },
      de: {
        title: "Semiprofessionell",
        shortBio:
          "Deutscher Athlet mit Wohnsitz in der Schweiz. Als Tunnelinstruktor, BASE-Coach und Videograf verbindet er sportliche Leistung, Coaching und Medienproduktion.",
        intro:
          "Deutscher Athlet mit Wohnsitz in der Schweiz. Als Tunnelinstruktor, BASE-Coach und Videograf verbindet er sportliche Leistung, Coaching und Medienproduktion.",
        baseStoryTitle: "Geschichte in Entwicklung",
        baseStory:
          "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
        profession: "Tunnelinstruktor, BASE-Coach und Videograf",
        role: "Hobby / Semiprofessionell",
        residence: "Schweiz",
        primaryDisciplines: ["Tracking"],
      },
    },
    ...emptyMedia,
    sponsors: [],
  },
  {
    id: "lukas-loibl",
    slug: "lukas-loibl",
    name: "Lukas Loibl",
    age: 26,
    country: "Austria",
    platforms: ["Instagram", "YouTube"],
    sponsorship: {
      en: "Multiple sponsors since 2022, including canopies, wingsuits, cameras and clothing.",
      de: "Mehrere Sponsoren seit 2022, darunter Canopies, Wingsuits, Kameras und Kleidung.",
    },
    images: images(null, "/images/athletes/lukas-loibl/profile.webp"),
    experience: experience(6, 3500, 6, 3000, true, 200000),
    content: {
      en: {
        title: "Professional",
        shortBio:
          "Austrian professional BASE jumping instructor and coach. With thousands of skydives and BASE jumps, he represents a fully professional approach to the sport and works closely with multiple industry sponsors.",
        intro: "Austrian professional BASE jumping instructor and coach.",
        baseStoryTitle: "Story in development",
        baseStory:
          "The detailed story will be added once interview material has been reviewed.",
        profession: "BASE Jumping Instructor / Coach",
        role: "Professional",
        residence: "Austria",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
      de: {
        title: "Professionell",
        shortBio:
          "Österreichischer BASE-Jumping-Instruktor und Coach. Mit mehreren tausend Fallschirm- und BASE-Sprüngen steht er für einen professionellen Zugang zum Sport und arbeitet mit verschiedenen Sponsoren aus der Branche zusammen.",
        intro: "Österreichischer BASE-Jumping-Instruktor und Coach.",
        baseStoryTitle: "Geschichte in Entwicklung",
        baseStory:
          "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
        profession: "BASE-Jumping-Instruktor / Coach",
        role: "Professionell",
        residence: "Österreich",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
    },
    ...emptyMedia,
    sponsors: [
      { name: "Canopies", logo: null, url: null },
      { name: "Wingsuits", logo: null, url: null },
      { name: "Cameras", logo: null, url: null },
      { name: "Clothing", logo: null, url: null },
    ],
  },
  {
    id: "tim-howell",
    slug: "tim-howell",
    name: "Tim Howell",
    age: 37,
    country: "United Kingdom",
    platforms: ["Instagram", "Facebook"],
    sponsorship: {
      en: "Multiple sponsors, primarily clothing and equipment. Sponsored for 7 years.",
      de: "Mehrere Sponsoren, vor allem Kleidung und Ausrüstung. Seit 7 Jahren gesponsert.",
    },
    images: images(
      "/images/athletes/tim-howell/hero.jpg",
      "/images/athletes/tim-howell/profile.jpg",
    ),
    experience: experience(2, 250, 14, 1450, true, 100000),
    content: {
      en: {
        title: "Professional",
        shortBio:
          "British professional mountain athlete based in Switzerland. Known for combining mountaineering, climbing and BASE jumping, he has spent more than a decade pursuing complex mountain objectives around the world.",
        intro: "British professional mountain athlete based in Switzerland.",
        baseStoryTitle: "Story in development",
        baseStory:
          "The detailed story will be added once interview material has been reviewed.",
        profession: "Professional Mountain Athlete",
        role: "Professional",
        residence: "Switzerland",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
      de: {
        title: "Professionell",
        shortBio:
          "Britischer Bergsportler mit Wohnsitz in der Schweiz. Er verbindet Alpinismus, Klettern und BASE Jumping und verfolgt seit über einem Jahrzehnt anspruchsvolle Projekte in den Bergen weltweit.",
        intro: "Britischer Bergsportler mit Wohnsitz in der Schweiz.",
        baseStoryTitle: "Geschichte in Entwicklung",
        baseStory:
          "Die ausführliche Geschichte wird ergänzt, sobald das Interviewmaterial ausgewertet wurde.",
        profession: "Professioneller Bergsportler",
        role: "Professionell",
        residence: "Schweiz",
        primaryDisciplines: ["Slider Down", "Wingsuit"],
      },
    },
    ...emptyMedia,
    sponsors: [
      { name: "Clothing", logo: null, url: null },
      { name: "Equipment", logo: null, url: null },
    ],
  },
];

export function getAthleteBySlug(slug: string) {
  return athletes.find((athlete) => athlete.slug === slug);
}
