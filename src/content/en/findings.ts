import type { Finding } from "@/types/story";

export const findingsPage = {
  title: "Research findings",
  intro:
    "A first structure for exploring the relationship between digital visibility, sponsorship, risk and safety culture.",
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
