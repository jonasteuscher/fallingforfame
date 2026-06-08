import type { Athlete } from "@/types/athlete";

export const athletes: Athlete[] = [
  {
    slug: "athlete-a",
    name: "Athlete A",
    profileImage: {
      src: "/images/athletes/athlete-a/profile.jpg",
      alt: "Athlete A preparing equipment before a jump",
      caption: "Placeholder portrait for future field photography.",
    },
    gallery: [
      {
        src: "/images/athletes/athlete-a/field-note.jpg",
        alt: "Equipment and notes from an observation day",
        caption: "Observation material placeholder.",
      },
    ],
    featuredAudio: {
      src: "/audio/athletes/athlete-a/interview.mp3",
      title: "Interview excerpt",
      transcript: "Transcript placeholder for accessibility and research use.",
    },
    featuredVideo: {
      src: "/video/athletes/athlete-a/documentary.mp4",
      poster: "/images/athletes/athlete-a/video-poster.jpg",
      title: "Field documentary excerpt",
    },
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Visibility before exit",
        biography:
          "A placeholder athlete profile focused on preparation, digital visibility and how public attention shapes decision-making.",
        quote: "The camera changes the atmosphere, even when nobody says it out loud.",
      },
      de: {
        chapterKicker: "Portrait",
        chapterTitle: "Sichtbarkeit vor dem Absprung",
        biography:
          "Ein Platzhalterprofil ueber Vorbereitung, digitale Sichtbarkeit und den Einfluss oeffentlicher Aufmerksamkeit auf Entscheidungen.",
        quote: "Die Kamera veraendert die Stimmung, auch wenn es niemand ausspricht.",
      },
    },
  },
  {
    slug: "athlete-b",
    name: "Athlete B",
    profileImage: {
      src: "/images/athletes/athlete-b/profile.jpg",
      alt: "Athlete B reviewing terrain conditions",
    },
    gallery: [],
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Risk as a negotiated practice",
        biography:
          "A placeholder profile exploring community norms, mentorship and the difference between perceived and accepted risk.",
        quote: "Most decisions happen before the jump day even begins.",
      },
      de: {
        chapterKicker: "Portrait",
        chapterTitle: "Risiko als verhandelte Praxis",
        biography:
          "Ein Platzhalterprofil ueber Community-Normen, Mentoring und den Unterschied zwischen wahrgenommenem und akzeptiertem Risiko.",
        quote: "Die meisten Entscheidungen fallen, bevor der Sprungtag beginnt.",
      },
    },
  },
  {
    slug: "athlete-c",
    name: "Athlete C",
    profileImage: {
      src: "/images/athletes/athlete-c/profile.jpg",
      alt: "Athlete C standing near a mountain exit point",
    },
    gallery: [],
    content: {
      en: {
        chapterKicker: "Portrait",
        chapterTitle: "Identity between craft and audience",
        biography:
          "A placeholder profile about sponsorship, athlete identity and the tension between documentation and performance.",
        quote: "I want the story to show the work, not only the moment of impact.",
      },
      de: {
        chapterKicker: "Portrait",
        chapterTitle: "Identitaet zwischen Handwerk und Publikum",
        biography:
          "Ein Platzhalterprofil ueber Sponsoring, Athletenidentitaet und die Spannung zwischen Dokumentation und Performance.",
        quote:
          "Die Geschichte soll die Arbeit zeigen, nicht nur den Moment des Aufpralls.",
      },
    },
  },
];

export function getAthleteBySlug(slug: string) {
  return athletes.find((athlete) => athlete.slug === slug);
}
