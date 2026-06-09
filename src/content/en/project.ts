import type { TimelineItem } from "@/types/story";

export const project = {
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
