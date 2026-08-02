import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectStorySection } from "@/components/athletes/ProjectStorySection";
import { athletes } from "@/data/athletes";

let intersectionObservers: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {
    intersectionObservers.push(this);
  }

  observe() {
    this.trigger({ isIntersecting: true, intersectionRatio: 1 });
  }

  disconnect() {}

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback(
      [entry as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("ProjectStorySection", () => {
  beforeEach(() => {
    intersectionObservers = [];
    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Lukas Loibl's current project as an editorial, responsive chapter", async () => {
    render(<ProjectStorySection project={lukasProject()} locale="en" />);

    expect(screen.getByText("Current Project")).toBeVisible();
    const heading = screen.getByRole("heading", { name: /World\s+Record/ });
    expect(heading).toBeVisible();
    expect(heading).toHaveClass("uppercase");
    expect(
      screen.getByText(/ten natural rock formations across ten flights/),
    ).toBeVisible();
    expect(
      screen.getByAltText(
        "Lukas Loibl flying in a wingsuit near a steep alpine rock gate",
      ),
    ).toHaveAttribute("src", "/images/athletes/lukas-loibl/Loch1.jpeg");
    expect(
      screen.getByAltText(
        "Natural rock opening in the European Alps used for Lukas Loibl's wingsuit record",
      ),
    ).toHaveAttribute("src", "/images/athletes/lukas-loibl/Loch2.jpeg");
    expect(screen.getByText("A line years in the making").closest("div")).toHaveClass(
      "lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.46fr)]",
    );
    expect(
      screen.getByRole("link", { name: "More about the project" }),
    ).toHaveAttribute("href", "#media-coverage");

    const video = screen.getByLabelText("Lukas Loibl world record wingsuit flight");

    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute(
      "poster",
      "/video/lukas-loibl/The_hole_thumbnail.png",
    );
    expect(video.closest("div")).toHaveClass("aspect-video");

    await waitFor(() =>
      expect(video.querySelector("source")).toHaveAttribute(
        "src",
        "/video/lukas-loibl/The_hole.mp4",
      ),
    );
  });

  it("renders German project copy", () => {
    render(<ProjectStorySection project={lukasProject()} locale="de" />);

    expect(screen.getByText("Aktuelles Projekt")).toBeVisible();
    expect(screen.getByText(/zehn natürliche Felsformationen/)).toBeVisible();
    expect(screen.getByText("Zehn Flüge. Zehn Formationen.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Mehr zum Projekt" })).toHaveAttribute(
      "href",
      "#media-coverage",
    );
  });

  it("pauses the project video when it leaves the viewport", () => {
    render(<ProjectStorySection project={lukasProject()} locale="en" />);
    const video = screen.getByLabelText(
      "Lukas Loibl world record wingsuit flight",
    ) as HTMLVideoElement;
    const pause = vi.spyOn(video, "pause");

    intersectionObservers.at(-1)?.trigger({
      isIntersecting: false,
      intersectionRatio: 0,
    });

    expect(pause).toHaveBeenCalled();
  });

  it("pauses another registered project video when a new one plays", () => {
    render(
      <>
        <ProjectStorySection project={lukasProject()} locale="en" />
        <ProjectStorySection project={lukasProject()} locale="en" />
      </>,
    );
    const videos = screen.getAllByLabelText(
      "Lukas Loibl world record wingsuit flight",
    ) as HTMLVideoElement[];
    const firstPause = vi.spyOn(videos[0], "pause");
    const secondPause = vi.spyOn(videos[1], "pause");

    fireEvent.play(videos[0]);
    firstPause.mockClear();
    secondPause.mockClear();
    fireEvent.play(videos[1]);

    expect(firstPause).toHaveBeenCalled();
    expect(secondPause).toHaveBeenCalledTimes(1);
  });

  it("does not render without project data", () => {
    const { container } = render(
      <ProjectStorySection project={undefined} locale="en" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

function lukasProject() {
  const project = athletes.find((item) => item.slug === "lukas-loibl")?.currentProject;

  if (!project) {
    throw new Error("Lukas Loibl project fixture missing");
  }

  return project;
}
