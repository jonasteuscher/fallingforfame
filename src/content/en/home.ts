import type { StoryChapter } from "@/types/story";

export const home = {
  kicker: "Multimedia documentary",
  title: "Falling for Fame",
  subtitle: "Myth or Reality in Modern BASE Jumping?",
  intro:
    "A scrollytelling documentary about social media, risk-taking, safety culture and athlete identity in contemporary BASE jumping.",
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
