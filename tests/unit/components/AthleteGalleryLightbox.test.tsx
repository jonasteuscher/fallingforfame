import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AthleteGalleryLightbox } from "@/components/athletes/AthleteGalleryLightbox";
import type { AthleteImage } from "@/types/athlete";

const images: AthleteImage[] = [
  {
    src: "/images/athletes/one.jpg",
    alt: { en: "First mountain flight", de: "Erster Bergflug" },
    width: 1200,
    height: 900,
  },
  {
    src: "/images/athletes/two.jpg",
    alt: { en: "Second exit point", de: "Zweiter Exit" },
    width: 1200,
    height: 900,
  },
  {
    src: "/images/athletes/three.jpg",
    alt: { en: "Third landing area", de: "Dritter Landeplatz" },
    width: 1200,
    height: 900,
  },
];

class MockPreloadImage {
  decoding = "";
  sizes = "";
  srcset = "";
  src = "";
}

beforeEach(() => {
  vi.stubGlobal("Image", MockPreloadImage);
});

afterEach(() => {
  document.body.style.overflow = "";
  vi.unstubAllGlobals();
});

describe("AthleteGalleryLightbox", () => {
  it("limits the initial gallery and toggles hidden images with custom labels", async () => {
    const user = userEvent.setup();

    render(
      <AthleteGalleryLightbox
        images={images}
        locale="en"
        initialVisibleCount={2}
        viewAllLabel="View full gallery"
        showLessLabel="Show fewer images"
      />,
    );

    expect(
      screen.getAllByRole("button", { name: /open image full size/i }),
    ).toHaveLength(2);
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute(
      "data-gallery-orientation",
      "landscape",
    );
    expect(screen.getAllByRole("img")[0]).toHaveClass("object-cover");

    const toggle = screen.getByRole("button", { name: "View full gallery" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(
      screen.getAllByRole("button", { name: /open image full size/i }),
    ).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Show fewer images" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("opens a German lightbox, supports keyboard navigation and closes on Escape", async () => {
    const user = userEvent.setup();

    render(<AthleteGalleryLightbox images={images} locale="de" />);

    await user.click(
      screen.getByRole("button", {
        name: "Bild in voller Groesse oeffnen: Zweiter Exit",
      }),
    );

    expect(screen.getByRole("dialog", { name: "Zweiter Exit" })).toBeVisible();
    expect(screen.getByText("Bild 2 / 3")).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Bildansicht schliessen" })).toHaveFocus();
    });
    expect(
      screen.getByRole("dialog", { name: "Zweiter Exit" }).querySelector("img"),
    ).toHaveClass("object-contain");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "Dritter Landeplatz" })).toBeVisible();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "Erster Bergflug" })).toBeVisible();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog", { name: "Dritter Landeplatz" })).toBeVisible();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe("");
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Bild in voller Groesse oeffnen: Dritter Landeplatz",
        }),
      ).toHaveFocus();
    });
  });

  it("shows no previous or next controls for a single image lightbox", async () => {
    const user = userEvent.setup();

    render(<AthleteGalleryLightbox images={[images[0]]} locale="en" />);

    await user.click(
      screen.getByRole("button", {
        name: "Open image full size: First mountain flight",
      }),
    );

    expect(screen.getByRole("dialog", { name: "First mountain flight" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
  });

  it("closes the lightbox when the backdrop is clicked", async () => {
    const user = userEvent.setup();

    render(<AthleteGalleryLightbox images={images} locale="en" />);

    await user.click(
      screen.getByRole("button", {
        name: "Open image full size: First mountain flight",
      }),
    );

    const dialog = screen.getByRole("dialog", { name: "First mountain flight" });
    const backdrop = dialog.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop as Element);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("warms the target image on focus and pointer hover without opening the dialog", () => {
    render(<AthleteGalleryLightbox images={images} locale="en" />);

    const firstImageButton = screen.getByRole("button", {
      name: "Open image full size: First mountain flight",
    });

    fireEvent.focus(firstImageButton);
    fireEvent.pointerEnter(firstImageButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
