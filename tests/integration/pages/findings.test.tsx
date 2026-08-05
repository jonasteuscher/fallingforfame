import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnglishFindingsPage, {
  generateMetadata as generateEnglishFindingsMetadata,
} from "@/app/[locale]/findings/page";
import GermanFindingsPage, {
  generateMetadata as generateGermanFindingsMetadata,
} from "@/app/[locale]/findings/page";
import { findingsPage as englishFindings } from "@/content/en/findings";
import { findingsPage as germanFindings } from "@/content/de/findings";
import { renderAsyncPage } from "../../test-utils/render-pages";

describe("findings page", () => {
  it("renders the English scrollytelling findings narrative", async () => {
    await renderAsyncPage(
      EnglishFindingsPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Between Visibility\s+and Safety/i,
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Five experienced BASE athletes on visibility, risk and safety culture.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Visibility changes the conditions in which decisions are made.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Visibility does not directly create risk/i)).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Findings chapters" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Visibility" })).toHaveAttribute(
      "href",
      "#visibility",
    );

    expect(
      screen.getByRole("heading", { name: "More than self-presentation" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /Attention is not\s+recognition/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Support takes many forms" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Pressure does not have to be spoken" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /The exit is\s+not the beginning/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Sometimes, not jumping\s+is the best decision/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Risk\s+looks\s+different\s+with\s+experience/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Safety is not built alone" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "The influence is indirect" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "What this study contributes" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Decision" })).toHaveAttribute(
      "href",
      "#decision",
    );
    expect(screen.queryByRole("link", { name: "No Jump" })).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("img", {
        name: /walks down along a rocky mountain ridge/i,
      })[0],
    ).toHaveAttribute("src", expect.stringContaining("Walk_down.jpg"));
    expect(
      screen.getAllByText(/Sometimes, not jumping\s+is the best decision/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/The mountain will still be there tomorrow/i).length,
    ).toBeGreaterThan(0);

    expect(screen.getByRole("button", { name: /Discovery/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByRole("button", { name: /Inspiration/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: /Learning/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^04\s*Reflection$/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Knowledge dispels fear/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interview participant").length).toBeGreaterThan(0);
  });

  it("renders the German findings narrative and localized controls", async () => {
    await renderAsyncPage(
      GermanFindingsPage({ params: Promise.resolve({ locale: "de" }) }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Zwischen Sichtbarkeit\s+und Sicherheit/i,
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Fünf erfahrene BASE Athleten über Sichtbarkeit, Risiko und Sicherheitskultur.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Sichtbarkeit verändert die Bedingungen, unter denen Entscheidungen entstehen.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sichtbarkeit führt nicht automatisch zu mehr Risiko/i),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Kapitel der Erkenntnisse" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Entscheidung" })).toHaveAttribute(
      "href",
      "#decision",
    );
    expect(
      screen.queryByRole("link", { name: "Nicht Springen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("img", { name: /felsigen Berggrat ab/i })[0],
    ).toHaveAttribute("src", expect.stringContaining("Walk_down.jpg"));
    expect(
      screen.getAllByText(/Der Berg steht auch morgen noch dort/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Sicherheit vor Erwartung").length).toBeGreaterThan(0);
    expect(screen.getByText(/Die Studie liefert qualitative Tiefe/i)).toBeVisible();
    expect(screen.getByText(/keine statistische Repräsentativität/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /Entdeckung/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getAllByText(/Wissen vertreibt Angst/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interviewteilnehmer").length).toBeGreaterThan(0);
  });

  it("keeps complex visualisations accessible through text equivalents", async () => {
    await renderAsyncPage(
      EnglishFindingsPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    for (const chapter of englishFindings.chapters) {
      expect(screen.getAllByText(chapter.accessibleSummary).length).toBeGreaterThan(0);
    }

    const synthesis = screen
      .getByRole("heading", { name: "The influence is indirect" })
      .closest("section");
    expect(synthesis).not.toBeNull();
    expect(
      within(synthesis as HTMLElement).getByText(
        /same forces can become protective or problematic/i,
      ),
    ).toBeVisible();
    expect(
      within(synthesis as HTMLElement).getAllByText(
        /experience, risk competence and safety culture/i,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("does not introduce quantitative claims beyond the declared qualitative sample", () => {
    const serialized = JSON.stringify([englishFindings, germanFindings]);

    expect(serialized).not.toMatch(/%|percent|percentage|Prozent|score|ranking/i);
    expect(serialized).not.toMatch(/directly causes|direkt verursacht/i);
    expect(serialized).toMatch(/no claim of statistical representativeness/i);
    expect(serialized).toMatch(/kein Anspruch auf statistische Repräsentativität/i);
  });

  it("places the visible process chapter directly after camera presence", () => {
    const englishIds = englishFindings.chapters.map((chapter) => chapter.id);
    const germanIds = germanFindings.chapters.map((chapter) => chapter.id);

    expect(englishIds.indexOf("visible-process")).toBe(
      englishIds.indexOf("camera") + 1,
    );
    expect(germanIds.indexOf("visible-process")).toBe(germanIds.indexOf("camera") + 1);
  });

  it("renders no-jump as the decision conclusion before experience", async () => {
    await renderAsyncPage(
      EnglishFindingsPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    const renderedIds = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => section.id,
    );
    const decisionIndex = renderedIds.indexOf("decision");
    const noJumpIndex = renderedIds.indexOf("no-jump");
    const experienceIndex = renderedIds.indexOf("experience");

    expect(decisionIndex).toBeGreaterThan(-1);
    expect(noJumpIndex).toBe(decisionIndex + 1);
    expect(experienceIndex).toBe(noJumpIndex + 1);
    expect(renderedIds.filter((id) => id === "no-jump")).toHaveLength(1);
  });

  it("generates localized metadata", async () => {
    await expect(
      generateEnglishFindingsMetadata({
        params: Promise.resolve({ locale: "en" }),
      }),
    ).resolves.toMatchObject({
      title: { absolute: "Findings | Falling for Fame?" },
      description: expect.stringContaining("Qualitative findings"),
    });

    await expect(
      generateGermanFindingsMetadata({
        params: Promise.resolve({ locale: "de" }),
      }),
    ).resolves.toMatchObject({
      title: { absolute: "Erkenntnisse | Falling for Fame?" },
      description: expect.stringContaining("Qualitative Erkenntnisse"),
    });
  });

  it("uses German metadata as the invalid locale fallback", async () => {
    await expect(
      generateGermanFindingsMetadata({
        params: Promise.resolve({ locale: "invalid" }),
      }),
    ).resolves.toMatchObject({
      title: { absolute: "Erkenntnisse | Falling for Fame?" },
      description: expect.stringContaining("Qualitative Erkenntnisse"),
    });
  });
});
