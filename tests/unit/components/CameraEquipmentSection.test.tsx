import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CameraEquipmentSection } from "@/components/findings/CameraEquipmentSection";
import { findingsPage as germanFindings } from "@/content/de/findings";
import { findingsPage as englishFindings } from "@/content/en/findings";
import type { FindingChapter } from "@/types/findings";

const labels = {
  sourcePrefix: "Qualitative finding",
  empiricalLabel: "Empirical material",
  interpretationLabel: "Interpretation",
};

function getCameraChapter(content = englishFindings) {
  const chapter = content.chapters.find((item) => item.id === "camera");

  if (!chapter) {
    throw new Error("Camera chapter missing");
  }

  return chapter;
}

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("CameraEquipmentSection", () => {
  beforeEach(() => {
    mockReducedMotion(false);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Camera.jpg as the primary documentary image with meaningful alt text", () => {
    render(<CameraEquipmentSection chapter={getCameraChapter()} {...labels} />);

    const images = screen.getAllByRole("img", {
      name: /A BASE athlete prepares for a jump on a mountain/i,
    });

    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute("src", "/images/findings/Camera.jpg");
  });

  it("renders English and German final statements without changing the core finding", () => {
    const { rerender } = render(
      <CameraEquipmentSection chapter={getCameraChapter(englishFindings)} {...labels} />,
    );

    expect(
      screen.getAllByText(/The camera does not make the decision/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/What matters is how it is used/i).length).toBeGreaterThan(0);

    rerender(
      <CameraEquipmentSection chapter={getCameraChapter(germanFindings)} {...labels} />,
    );

    expect(screen.getAllByText(/Nicht die Kamera entscheidet/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Entscheidend ist der Umgang mit ihr/i).length,
    ).toBeGreaterThan(0);
  });

  it("uses accessible hotspot buttons and closes the open tooltip with Escape", async () => {
    const user = userEvent.setup();

    render(<CameraEquipmentSection chapter={getCameraChapter()} {...labels} />);

    const cameraButton = screen.getByRole("button", {
      name: /CAMERA: The camera documents the jump/i,
    });

    expect(cameraButton).toHaveAttribute("aria-expanded", "false");

    await user.click(cameraButton);

    expect(cameraButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("dialog", { name: "CAMERA" })).toHaveLength(1);
    expect(
      screen.getAllByText(/The camera documents the jump and enables later review/i).length,
    ).toBeGreaterThan(1);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(cameraButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("keeps only one active tooltip open in a narrative state", async () => {
    const user = userEvent.setup();
    const chapter: FindingChapter = {
      ...getCameraChapter(),
      states: [
        {
          id: "camera",
          title: "Action camera",
          body: "A media object that becomes ordinary equipment.",
          hotspots: [
            {
              id: "camera-arm",
              state: "camera",
              label: "Camera",
              description: "The camera is visible.",
              x: 31,
              y: 31,
            },
            {
              id: "helmet",
              state: "camera",
              label: "Helmet",
              description: "The camera mount is part of the helmet setup.",
              x: 38,
              y: 39,
            },
          ],
        },
        ...(getCameraChapter().states ?? []).filter((state) => state.id !== "camera"),
      ],
    };

    render(<CameraEquipmentSection chapter={chapter} {...labels} />);

    const cameraButton = screen.getByRole("button", { name: /Camera: The camera is visible/i });
    const helmetButton = screen.getByRole("button", {
      name: /Helmet: The camera mount is part/i,
    });

    await user.click(cameraButton);
    expect(cameraButton).toHaveAttribute("aria-expanded", "true");

    await user.click(helmetButton);
    await waitFor(() => {
      expect(cameraButton).toHaveAttribute("aria-expanded", "false");
      expect(helmetButton).toHaveAttribute("aria-expanded", "true");
    });
    expect(screen.queryByRole("dialog", { name: "Camera" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("dialog", { name: "Helmet" })).toHaveLength(1);
  });

  it("closes an open popup when clicking outside the image", async () => {
    const user = userEvent.setup();

    render(<CameraEquipmentSection chapter={getCameraChapter()} {...labels} />);

    const cameraButton = screen.getByRole("button", {
      name: /CAMERA: The camera documents the jump/i,
    });

    await user.click(cameraButton);
    expect(cameraButton).toHaveAttribute("aria-expanded", "true");

    await user.click(document.body);

    await waitFor(() => {
      expect(cameraButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("moves keyboard focus between active hotspots with arrow keys", async () => {
    const user = userEvent.setup();
    const chapter: FindingChapter = {
      ...getCameraChapter(),
      states: [
        {
          id: "camera",
          title: "Action camera",
          body: "A media object that becomes ordinary equipment.",
          hotspots: [
            {
              id: "camera-arm",
              state: "camera",
              label: "Camera",
              description: "The camera is visible.",
              x: 30,
              y: 40,
            },
            {
              id: "helmet",
              state: "camera",
              label: "Helmet",
              description: "The helmet carries the camera mount.",
              x: 45,
              y: 45,
            },
          ],
        },
        ...(getCameraChapter().states ?? []).filter((state) => state.id !== "camera"),
      ],
    };

    render(<CameraEquipmentSection chapter={chapter} {...labels} />);

    const cameraButton = screen.getByRole("button", { name: /Camera: The camera is visible/i });
    const helmetButton = screen.getByRole("button", {
      name: /Helmet: The helmet carries/i,
    });

    cameraButton.focus();
    await user.keyboard("{ArrowRight}");

    expect(helmetButton).toHaveFocus();
  });

  it("exposes all narrative states in reduced-motion mode", async () => {
    mockReducedMotion(true);

    render(<CameraEquipmentSection chapter={getCameraChapter()} {...labels} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /The camera is part of the jump/i }))
        .toBeInTheDocument();
    });

    for (const state of getCameraChapter().states ?? []) {
      expect(screen.getByText(state.title)).toBeInTheDocument();
      expect(screen.getByText(state.body)).toBeInTheDocument();
    }
  });

  it("uses the mobile fallback content without floating hotspot buttons", () => {
    render(<CameraEquipmentSection chapter={getCameraChapter()} {...labels} />);

    const mobileSection = screen
      .getAllByText("The camera is part of the jump")[0]
      ?.closest("div");

    expect(mobileSection).not.toBeNull();
    expect(within(mobileSection as HTMLElement).getByText("Action camera")).toBeInTheDocument();
    expect(within(mobileSection as HTMLElement).getByText(/CAMERA/)).toBeInTheDocument();
    expect(within(mobileSection as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps hotspot data percentage-based, unique and scoped to valid states", () => {
    const validStates = new Set(["camera", "helmet", "equipment", "preparation", "decision"]);

    for (const content of [englishFindings, germanFindings]) {
      const chapter = getCameraChapter(content);
      const hotspotIds = new Set<string>();

      expect(chapter.image?.src).toBe("/images/findings/Camera.jpg");
      expect(chapter.states?.[0]?.id).toBe("camera");
      expect(chapter.states?.at(-1)?.id).toBe("decision");

      for (const state of chapter.states ?? []) {
        expect(validStates.has(state.id ?? "")).toBe(true);

        for (const hotspot of state.hotspots ?? []) {
          expect(typeof hotspot.x).toBe("number");
          expect(typeof hotspot.y).toBe("number");
          expect(hotspot.x).toBeGreaterThanOrEqual(0);
          expect(hotspot.x).toBeLessThanOrEqual(100);
          expect(hotspot.y).toBeGreaterThanOrEqual(0);
          expect(hotspot.y).toBeLessThanOrEqual(100);
          expect(hotspot.state).toBe(state.id);
          expect(hotspotIds.has(hotspot.id)).toBe(false);
          hotspotIds.add(hotspot.id);
        }
      }
    }
  });
});
