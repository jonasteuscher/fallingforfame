import type { Finding, StoryChapter, TimelineItem } from "@/types/story";

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
  home: {
    kicker: "Multimedia documentary",
    title: "Falling for Fame",
    subtitle: "Myth or Reality in Modern BASE Jumping?",
    intro:
      "A scrollytelling documentary about social media, risk-taking, safety culture and athlete identity in contemporary BASE jumping.",
  },
  athletes: {
    title: "Athlete portraits",
    intro:
      "Three placeholder portraits prepare the structure for interviews, field recordings, photography and documentary video.",
  },
  project: {
    title: "The Project",
    body: "This bachelor thesis project combines academic research, field observations, interviews and multimedia documentation into a bilingual longform web documentary.",
    sections: [
      {
        title: "The documentary",
        body: "Placeholder content for the documentary concept, narrative structure and multimedia approach behind Falling for Fame.",
      },
      {
        title: "Research background",
        body: "Placeholder content for the academic context, literature review and research questions guiding the project.",
      },
      {
        title: "Bachelor thesis context",
        body: "Placeholder content for the thesis framework, production scope and relationship between research and design.",
      },
      {
        title: "Methodology",
        body: "Placeholder content for qualitative methods, scrollytelling decisions and documentation strategy.",
      },
      {
        title: "Interviews",
        body: "Placeholder content for athlete interviews, expert conversations and editorial selection.",
      },
      {
        title: "Observations",
        body: "Placeholder content for field observations, jump-day notes and contextual documentation.",
      },
      {
        title: "Photo elicitation",
        body: "Placeholder content for using images as prompts in interviews and reflective conversations.",
      },
      {
        title: "Project goals",
        body: "Placeholder content for communication goals, audience needs and expected learning outcomes.",
      },
      {
        title: "Credits",
        body: "Placeholder content for contributors, interview partners, photography, video, audio and academic supervision.",
      },
    ],
  },
  sport: {
    title: "About the Sport",
    body: "A placeholder overview of BASE jumping for readers who need context before entering the athlete portraits and research findings.",
    sections: [
      {
        title: "What is BASE jumping?",
        body: "Placeholder content explaining fixed-object parachute jumping and the meaning of Building, Antenna, Span and Earth.",
      },
      {
        title: "History of BASE jumping",
        body: "Placeholder content for early developments, pioneering jumps and the sport's evolution.",
      },
      {
        title: "Difference between skydiving and BASE jumping",
        body: "Placeholder content comparing aircraft exits, fixed-object exits, altitude, reaction time and training pathways.",
      },
      {
        title: "Equipment",
        body: "Placeholder content for canopies, containers, pilot chutes, protective gear and specialized configurations.",
      },
      {
        title: "Risk and safety culture",
        body: "Placeholder content for risk assessment, weather, object selection, mentoring and decision-making norms.",
      },
      {
        title: "Community and ethics",
        body: "Placeholder content for access, discretion, local relationships and responsibility within the BASE community.",
      },
      {
        title: "Wingsuit flying",
        body: "Placeholder content describing wingsuit flight, terrain proximity and the additional skill progression involved.",
      },
      {
        title: "Modern developments",
        body: "Placeholder content for media visibility, technology, training, sponsorship and contemporary debates.",
      },
    ],
  },
  findings: {
    title: "Research findings",
    intro:
      "A first structure for exploring the relationship between digital visibility, sponsorship, risk and safety culture.",
  },
};

export const chapters: StoryChapter[] = [
  {
    id: "visibility",
    kicker: "Chapter 01",
    title: "Visibility changes the jump before it happens",
    body: "The documentary begins before the exit point. Cameras, followers and sponsor expectations shape how risk is talked about, staged and remembered.",
    image: {
      src: "/images/chapters/visibility.jpg",
      alt: "Mountain landscape prepared for future documentary imagery",
      caption: "Placeholder for chapter photography.",
    },
  },
  {
    id: "safety",
    kicker: "Chapter 02",
    title: "Safety culture is carried by people",
    body: "Rules, mentoring and informal community norms create a social infrastructure around decisions that outsiders often see only as individual risk.",
  },
  {
    id: "identity",
    kicker: "Chapter 03",
    title: "Athlete identity sits between craft and audience",
    body: "BASE jumpers navigate a tension between technical mastery, personal meaning and the pressure to be seen.",
  },
];

export const statistics = [
  {
    value: "5",
    label: "Athlete portraits",
    detail: "Prepared for interview-led multimedia chapters.",
  },
  {
    value: "2",
    label: "Languages",
    detail: "English and German content structures are available from launch.",
  },
  {
    value: "∞",
    label: "Media layers",
    detail: "Photography, audio, video and field notes can be composed per chapter.",
  },
];

export const athleteMeta = {
  from: "From",
  fromUnknown: "From unknown",
  ageUnknown: "Age unknown",
  years: "years",
  countries: {
    Austria: "Austria",
    Germany: "Germany",
    Switzerland: "Switzerland",
    "United Kingdom": "United Kingdom",
  },
};

export const athleteExperience = {
  unknown: "Unknown",
  yes: "Yes",
  no: "No",
  labels: {
    skydiveSeasons: "Skydive seasons",
    skydives: "Skydives",
    baseSeasons: "BASE seasons",
    basejumps: "BASE jumps",
    sponsored: "Sponsored",
    socialMediaReach: "Overall social media reach",
  },
};

export const findings: Finding[] = [
  {
    id: "visibility-pressure",
    theme: "visibility",
    title: "Visibility can become a condition of participation",
    summary:
      "Digital attention influences documentation practices and can affect how athletes evaluate a successful jump.",
  },
  {
    id: "community-safety",
    theme: "safety",
    title: "Safety culture is social, not only technical",
    summary:
      "Observation and interview placeholders point toward mentorship, peer feedback and shared norms.",
  },
  {
    id: "sponsorship-risk",
    theme: "sponsorship",
    title: "Sponsorship complicates risk communication",
    summary:
      "Future analysis can connect brand visibility, athlete autonomy and the public framing of danger.",
  },
];

export const timeline: TimelineItem[] = [
  {
    date: "Research",
    title: "Literature and thesis framing",
    body: "Academic context, research questions and interview design.",
  },
  {
    date: "Fieldwork",
    title: "Observation and documentation",
    body: "Photography, notes, audio interviews and video material.",
  },
  {
    date: "Publication",
    title: "Interactive documentary",
    body: "Bilingual scrollytelling chapters with accessible media.",
  },
];
