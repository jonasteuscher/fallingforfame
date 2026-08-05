import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecognitionComparison } from "@/components/findings/RecognitionComparison";
import { findingsPage as englishFindings } from "@/content/en/findings";
import { findingsPage as germanFindings } from "@/content/de/findings";
import type { FindingChapter, FindingsPageContent } from "@/types/findings";

function renderRecognitionComparison(
  page: FindingsPageContent,
  chapter: FindingChapter,
) {
  return render(
    <RecognitionComparison
      chapter={chapter}
      sourcePrefix={page.sourcePrefix}
      empiricalLabel={page.empiricalLabel}
      interpretationLabel={page.interpretationLabel}
    />,
  );
}

describe("RecognitionComparison", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders English content, both concepts and the qualitative disclaimer", () => {
    const chapter = englishFindings.chapters.find(
      (item) => item.kind === "recognition-comparison",
    );

    expect(chapter).toBeDefined();
    renderRecognitionComparison(englishFindings, chapter!);

    expect(
      screen.getByRole("heading", { name: /Attention is not\s+recognition/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Short-term visibility").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Long-term recognition").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        /Visibility can open doors\.\s+Recognition is built over years/i,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        /Attention is visible\.\s+Recognition must be earned over time/i,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/recognition within the community develops/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/not a quantitative measurement/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Key insight").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Empirical finding").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interpretation").length).toBeGreaterThan(0);
    expect(JSON.stringify(chapter)).not.toMatch(/%|percent|percentage|score|ranking/i);
  });

  it("renders German content without changing the finding wording", () => {
    const chapter = germanFindings.chapters.find(
      (item) => item.kind === "recognition-comparison",
    );

    expect(chapter).toBeDefined();
    renderRecognitionComparison(germanFindings, chapter!);

    expect(
      screen.getByRole("heading", {
        name: /Reichweite ist\s+nicht gleich\s+Anerkennung/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Kurzfristige Sichtbarkeit").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Langfristige Anerkennung").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        /Sichtbarkeit kann Türen öffnen\.\s+Anerkennung entsteht über Jahre/i,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Aufmerksamkeit ist sichtbar\.\s+Anerkennung muss wachsen/i)
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/entwickelt sich Anerkennung innerhalb der Community/i)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/keine quantitative Messung/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Interpretation der Ergebnisse").length).toBeGreaterThan(
      0,
    );
  });

  it("exposes the complete static comparison for reduced-motion users", async () => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const chapter = englishFindings.chapters.find(
      (item) => item.kind === "recognition-comparison",
    );

    expect(chapter).toBeDefined();
    const { container } = renderRecognitionComparison(englishFindings, chapter!);

    await waitFor(() =>
      expect(
        container.querySelector('[data-recognition-layout="static"]'),
      ).toBeInTheDocument(),
    );
    expect(screen.getAllByText("followers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("years of safe practice").length).toBeGreaterThan(0);
    expect(screen.getAllByText(chapter!.accessibleSummary).length).toBeGreaterThan(0);
  });

  it("provides a sequential mobile fallback", () => {
    const chapter = englishFindings.chapters.find(
      (item) => item.kind === "recognition-comparison",
    );

    expect(chapter).toBeDefined();
    const { container } = renderRecognitionComparison(englishFindings, chapter!);

    const sequentialLayout = container.querySelector(
      '[data-recognition-layout="sequential"]',
    );

    expect(sequentialLayout).toBeInTheDocument();
    expect(sequentialLayout).toHaveClass("findings-flow-layout", "xl:hidden");
    expect(container.querySelector(".hidden.xl\\:block")).toBeInTheDocument();
  });
});
