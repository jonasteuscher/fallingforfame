import type { TimelineItem } from "@/types/story";

export const project = {
  title: "The Project",
  body: "This bachelor thesis project combines academic research, field observations, interviews and multimedia documentation into a bilingual longform web documentary.",
  heroKicker: "Research design",
  chapterIndicator: [
    { id: "project-documentation", label: "Documentation" },
    { id: "project-process", label: "Process" },
  ],
  documentation: {
    label: "Documentary",
    title: "The Documentary",
    introEyebrow: "More than a Research Project",
    introBody:
      "Falling for Fame began as a bachelor's thesis, but the questions behind it needed images, voices, field notes and interactive storytelling.",
    scrollIndicator: "Scroll to enter the chapter",
    heroImage: {
      src: "/images/project/hero.JPG",
      alt: "Camera setup in a snowy mountain valley during documentary fieldwork.",
      caption: "Fieldwork location during the documentary production.",
    },
    why: {
      title: "Why this documentary?",
      excerpt:
        "Text alone could not fully explain the environments, decisions and emotions behind the sport.",
      paragraphs: [
        "Falling for Fame began as a bachelor's thesis exploring the relationship between social media, sponsorship, risk perception and safety culture in modern BASE jumping. During the research process, the project quickly moved beyond the limits of a traditional academic publication.",
        "BASE jumping is highly visual and deeply experiential. It takes place in environments that most people will never visit and involves decisions, emotions and social dynamics that are difficult to communicate through written analysis alone.",
        "By combining academic research with photography, video, interviews, field observations and interactive storytelling, the documentary aims to provide a deeper understanding of the people behind the sport and the realities that shape their decisions.",
      ],
      image: {
        src: "/images/project/hero.JPG",
        alt: "",
      },
    },
    people: {
      quote:
        "Although BASE jumping is the backdrop, this documentary is ultimately about people.",
      body: "It explores how athletes navigate risk, visibility, responsibility, community and personal ambition in an increasingly connected world.",
      image: {
        src: "/images/sport/hero1.jpg",
        alt: "",
      },
    },
    approach: {
      title: "Documentary approach",
      intro:
        "The project combines several forms of documentation into one layered perspective.",
      items: [
        "Interviews",
        "Observations",
        "Photography",
        "Video",
        "Research",
        "Photo Elicitation",
      ],
    },
    interactive: {
      title: "Why interactive?",
      paragraphs: [
        "An interactive documentary lets visitors move between stories, images, interviews and research findings at their own pace.",
        "Rather than presenting a single narrative, the project encourages exploration and critical thinking.",
        "Every athlete, location and experience shown throughout the documentary represents only one perspective within a much larger and more diverse community.",
      ],
      examples: [
        {
          label: "Story layer",
          title: "Athlete portraits",
          body: "Individual stories create context around motivation, pressure, craft and personal decision making.",
        },
        {
          label: "Research layer",
          title: "Findings in context",
          body: "Academic questions are translated into accessible moments that can be explored alongside images and interviews.",
        },
        {
          label: "Visual layer",
          title: "Field documentation",
          body: "Photography, video and observation notes show the production process as part of the story.",
        },
      ],
    },
    gallery: {
      title: "Behind the scenes",
      intro:
        "A glimpse into planning, travel, conversations, fieldwork and the moments outside the camera's frame.",
      countLabel: "images",
      closeLabel: "Close image",
      images: [
        {
          src: "/images/project/bts/me.jpg",
          alt: "Documentary author on a mountain path during fieldwork.",
        },
        {
          src: "/images/project/bts/DSC_1849.JPG",
          alt: "Behind-the-scenes production moment from the documentary process.",
        },
        {
          src: "/images/project/bts/DSC_1894.JPG",
          alt: "Behind-the-scenes fieldwork photograph from the documentary production.",
        },
        {
          src: "/images/project/bts/DSC_1947.JPG",
          alt: "Behind-the-scenes photograph from project fieldwork.",
        },
        {
          src: "/images/project/bts/DSC_1959.JPG",
          alt: "Via ferrata and safety information sign during documentary fieldwork.",
        },
        {
          src: "/images/project/bts/IMG_0226 2.JPG",
          alt: "Travel and production moment captured during the documentary.",
        },
        {
          src: "/images/project/bts/IMG_0230 2.JPG",
          alt: "Behind-the-scenes image from documentary travel and fieldwork.",
        },
        {
          src: "/images/project/bts/IMG_0232 2.JPG",
          alt: "Documentary production photograph from the research process.",
        },
        {
          src: "/images/project/bts/IMG_0935 2.JPG",
          alt: "Behind-the-scenes image showing the production environment.",
        },
        {
          src: "/images/project/bts/IMG_0942 2.JPG",
          alt: "Fieldwork photograph from the documentary project.",
        },
        {
          src: "/images/project/bts/IMG_1169.jpg",
          alt: "Behind-the-scenes production detail from the documentary.",
        },
        {
          src: "/images/project/bts/IMG_9235.JPG",
          alt: "Behind-the-scenes moment from documentary filming.",
        },
        {
          src: "/images/project/bts/IMG_9244.JPG",
          alt: "Production photograph from the documentary fieldwork.",
        },
        {
          src: "/images/project/bts/IMG_9262.JPG",
          alt: "Behind-the-scenes photograph from the project production.",
        },
        {
          src: "/images/project/bts/DSC_1908.JPG",
          alt: "Wingsuit athlete standing above a valley during documentary fieldwork.",
        },
      ],
    },
    closing: {
      lines: ["Every jump tells a story.", "Every story has a context."],
    },
  },
  sections: [
    {
      title: "The documentary",
      body: "Placeholder content for the documentary concept, narrative structure and multimedia approach behind 'Falling for Fame?'.",
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
};

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
