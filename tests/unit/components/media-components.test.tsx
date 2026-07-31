import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AudioPlayer } from "@/components/media/AudioPlayer";
import { CustomVideoPlayer } from "@/components/media/CustomVideoPlayer";
import { ImageBlock } from "@/components/media/ImageBlock";
import { ImageGallery } from "@/components/media/ImageGallery";
import { MediaCaption } from "@/components/media/MediaCaption";
import { VideoPlayer } from "@/components/media/VideoPlayer";

beforeEach(() => {
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    value: null,
  });
  Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
    configurable: true,
    value: vi.fn(() => Promise.resolve()),
  });
  Object.defineProperty(document, "exitFullscreen", {
    configurable: true,
    value: vi.fn(() => Promise.resolve()),
  });
});

describe("media components", () => {
  it("renders an audio asset with caption, credit and transcript", () => {
    const { container } = render(
      <AudioPlayer
        audio={{
          src: "/audio/interview.mp3",
          title: "Interview clip",
          caption: "Field recording",
          credit: "Jonas",
          transcript: "Transcript text",
        }}
      />,
    );

    const audio = container.querySelector("audio");
    expect(audio).toHaveAttribute("src", "/audio/interview.mp3");
    expect(screen.getByText("Field recording")).toBeVisible();
    expect(screen.getByText("Credit: Jonas")).toBeVisible();
    expect(screen.getByText("Transcript")).toBeVisible();
    expect(screen.getByText("Transcript text")).toBeInTheDocument();
  });

  it("falls back to the audio title when no caption is provided", () => {
    render(<AudioPlayer audio={{ src: "/audio/story.mp3", title: "Story audio" }} />);

    expect(screen.getByText("Story audio")).toBeVisible();
    expect(screen.queryByText("Transcript")).not.toBeInTheDocument();
  });

  it("renders image assets and placeholders", () => {
    const { rerender } = render(
      <ImageBlock
        priority
        image={{
          src: "/images/test.jpg",
          alt: "Athlete on an exit point",
          caption: "Exit point",
          credit: "Archive",
        }}
      />,
    );

    expect(screen.getByRole("img", { name: "Athlete on an exit point" }))
      .toHaveAttribute("src", "/images/test.jpg");
    expect(screen.getByText("Exit point")).toBeVisible();
    expect(screen.getByText("Credit: Archive")).toBeVisible();

    rerender(<ImageBlock />);
    expect(screen.getByText("Image placeholder")).toBeVisible();
  });

  it("renders image gallery states", () => {
    const { rerender } = render(<ImageGallery images={[]} />);

    expect(screen.getByText("Image gallery placeholder")).toBeVisible();

    rerender(
      <ImageGallery
        images={[
          { src: "/one.jpg", alt: "First image" },
          { src: "/two.jpg", alt: "Second image" },
        ]}
      />,
    );

    expect(screen.getByLabelText("Image gallery")).toBeVisible();
    expect(screen.getByRole("img", { name: "First image" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Second image" })).toBeVisible();
  });

  it("omits empty media captions", () => {
    const { container } = render(<MediaCaption />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a video asset through the default video player wrapper", () => {
    const { container } = render(
      <VideoPlayer
        video={{
          src: "/video/clip.mp4",
          poster: "/video/poster.jpg",
          title: "Exit preparation",
          credit: "Field team",
          transcript: "Video transcript",
        }}
      />,
    );

    expect(container.querySelector("video")).toHaveAttribute("src", "/video/clip.mp4");
    expect(container.querySelector("video")).toHaveAttribute(
      "poster",
      "/video/poster.jpg",
    );
    expect(screen.getByText("Exit preparation")).toBeVisible();
    expect(screen.getByText("Credit: Field team")).toBeVisible();
    expect(screen.getByText("Video transcript")).toBeInTheDocument();
  });

  it("updates custom video controls from media events and inputs", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CustomVideoPlayer video={{ src: "/video/story.mp4", poster: "/poster.jpg" }} />,
    );
    const video = container.querySelector("video") as HTMLVideoElement;

    Object.defineProperty(video, "duration", { configurable: true, value: 125 });
    fireEvent.loadedMetadata(video);
    expect(screen.getByText("0:00 / 2:05")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Play video" }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    fireEvent.play(video);
    expect(screen.getByRole("button", { name: "Pause video" })).toBeVisible();

    fireEvent.change(screen.getByLabelText("Video progress"), {
      target: { value: "61" },
    });
    expect(video.currentTime).toBe(61);
    expect(screen.getByText("1:01 / 2:05")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Video volume"), {
      target: { value: "0" },
    });
    expect(video.muted).toBe(true);
    expect(screen.getByRole("button", { name: "Unmute video" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Enter full screen" }));
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();
  });
});
