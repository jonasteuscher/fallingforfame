import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ProjectBehindScenes,
  ProjectDocumentationChapter,
} from "@/components/project/ProjectDocumentationChapter";

const galleryContent = {
  title: "Behind the scenes",
  intro: "Planning, travel and fieldwork behind the documentary.",
  countLabel: "images",
  closeLabel: "Close image",
  previousLabel: "Previous image",
  nextLabel: "Next image",
  images: [
    { src: "/images/project/one.jpg", alt: "First fieldwork image" },
    { src: "/images/project/two.jpg", alt: "Second fieldwork image" },
    { src: "/images/project/three.jpg", alt: "Third fieldwork image" },
  ],
};

const documentationContent = {
  label: "Production journal",
  title: "Documentary research in practice",
  introEyebrow: "The process",
  introBody: "A concise introduction to the practical research process.",
  scrollIndicator: "Scroll",
  why: {
    title: "Why this format",
    excerpt: "The subject needed more than written explanation.",
    paragraphs: [
      "The work combines field notes, interviews and visual production.",
      "The documentary format makes context visible.",
    ],
    image: { src: "/images/project/why.jpg", alt: "Research setting" },
  },
  people: {
    quote: "The athletes shaped the story.",
    body: "Interviews and observations informed the documentary structure.",
    image: { src: "/images/project/people.jpg", alt: "Interview setup" },
  },
  approach: {
    title: "Approach",
    intro: "A practical research workflow.",
    items: ["Interviews", "Fieldwork", "Editing"],
  },
  interactive: {
    title: "Interactive layer",
    paragraphs: [
      "The website lets the research unfold through interaction.",
      "Visitors move between documentary scenes and research context.",
    ],
    examples: [
      {
        label: "01",
        title: "Scroll sequence",
        body: "A chapter can build an argument progressively.",
      },
      {
        label: "02",
        title: "Audio layer",
        body: "Sound can support atmosphere and reflection.",
      },
    ],
  },
  gallery: galleryContent,
  closing: {
    lines: ["Research became documentary.", "Documentary became interface."],
  },
  heroImage: { src: "/images/project/hero.jpg", alt: "Project hero image" },
};

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class IntersectionObserverMock {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    },
  );
});

describe("project documentation components", () => {
  it("renders the full documentation chapter from structured content", () => {
    render(<ProjectDocumentationChapter content={documentationContent} />);

    expect(
      screen.getByRole("heading", { name: "Documentary research in practice" }),
    ).toBeVisible();
    expect(
      screen.getByText("A concise introduction to the practical research process."),
    ).toBeVisible();
    expect(
      screen.getByText("The subject needed more than written explanation."),
    ).toBeVisible();
    expect(screen.getByText("The athletes shaped the story.")).toBeVisible();
    expect(screen.getByText("A practical research workflow.")).toBeVisible();
    expect(
      screen.getByText("The website lets the research unfold through interaction."),
    ).toBeVisible();
    expect(screen.getByText("03 images")).toBeVisible();
    expect(screen.getByText(/Research became documentary/)).toBeVisible();
  });

  it("opens, navigates and closes the behind-the-scenes gallery", async () => {
    const user = userEvent.setup();
    render(<ProjectBehindScenes content={galleryContent} />);

    await user.click(screen.getByRole("button", { name: "First fieldwork image" }));
    expect(screen.getByRole("dialog", { name: "First fieldwork image" })).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(
      screen.getByRole("dialog", { name: "Second fieldwork image" }),
    ).toBeVisible();

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByRole("dialog", { name: "First fieldwork image" })).toBeVisible();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
  });
});
