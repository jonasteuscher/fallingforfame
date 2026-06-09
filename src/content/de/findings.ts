import type { Finding } from "@/types/story";

export const findingsPage = {
  title: "Forschungserkenntnisse",
  intro:
    "Eine erste Struktur für die Auseinandersetzung mit digitaler Sichtbarkeit, Sponsoring, Risiko und Sicherheitskultur.",
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
