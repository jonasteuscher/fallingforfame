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
      screen.getByRole("heading", { name: /Between Visibility\s+and Safety/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Five experienced BASE athletes on visibility, risk and safety culture."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Visibility changes the conditions in which decisions are made."),
    ).toBeInTheDocument();
    expect(screen.getByText(/Visibility does not directly create risk/i)).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Findings chapters" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Visibility" })).toHaveAttribute(
      "href",
      "#visibility",
    );

    expect(screen.getByRole("heading", { name: "More than self-presentation" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Attention is not recognition" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Support takes many forms" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Pressure does not have to be spoken" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "The jump begins long before the exit" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Experience does not automatically make you safe" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Sometimes the safest jump is no jump" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Safety is not built alone" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "The influence is indirect" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "What this study can and cannot claim" })).toBeVisible();
  });

  it("renders the German findings narrative and localized controls", async () => {
    await renderAsyncPage(
      GermanFindingsPage({ params: Promise.resolve({ locale: "de" }) }),
    );

    expect(
      screen.getByRole("heading", { name: /Zwischen Sichtbarkeit\s+und Sicherheit/i, level: 1 }),
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
    expect(screen.getByRole("navigation", { name: "Kapitel der Erkenntnisse" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Nicht Springen" })).toHaveAttribute(
      "href",
      "#no-jump",
    );
    expect(screen.getByText("Sicherheit vor Erwartung")).toBeVisible();
    expect(screen.getByText(/Die Ergebnisse beziehen sich auf dieses Sample/i)).toBeVisible();
  });

  it("keeps complex visualisations accessible through text equivalents", async () => {
    await renderAsyncPage(
      EnglishFindingsPage({ params: Promise.resolve({ locale: "en" }) }),
    );

    for (const chapter of englishFindings.chapters) {
      expect(screen.getByText(chapter.accessibleSummary)).toBeVisible();
    }

    const synthesis = screen.getByRole("heading", { name: "The influence is indirect" })
      .closest("section");
    expect(synthesis).not.toBeNull();
    expect(within(synthesis as HTMLElement).getByText(/mediating safeguards/i)).toBeVisible();
  });

  it("does not introduce quantitative claims beyond the declared qualitative sample", () => {
    const serialized = JSON.stringify([englishFindings, germanFindings]);

    expect(serialized).not.toMatch(/%|percent|percentage|Prozent|score|ranking/i);
    expect(serialized).not.toMatch(/directly causes|direkt verursacht/i);
    expect(serialized).toMatch(/no claim of statistical representativeness/i);
    expect(serialized).toMatch(/kein Anspruch auf statistische Repräsentativität/i);
  });

  it("generates localized metadata", async () => {
    await expect(
      generateEnglishFindingsMetadata({
        params: Promise.resolve({ locale: "en" }),
      }),
    ).resolves.toMatchObject({
      title: "Findings | Falling for Fame?",
      description: expect.stringContaining("Qualitative findings"),
    });

    await expect(
      generateGermanFindingsMetadata({
        params: Promise.resolve({ locale: "de" }),
      }),
    ).resolves.toMatchObject({
      title: "Erkenntnisse | Falling for Fame?",
      description: expect.stringContaining("Qualitative Erkenntnisse"),
    });
  });
});
