import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MobileExperienceNotice,
  mobileExperienceNoticeStorageKey,
} from "@/components/MobileExperienceNotice";
import { home as deHome } from "@/content/de/home";
import { home as enHome } from "@/content/en/home";

const enContent = enHome.mobileExperienceNotice;
const deContent = deHome.mobileExperienceNotice;

let mediaQueryMatches = true;
let mediaQueryListeners: Array<(event: MediaQueryListEvent) => void> = [];

beforeEach(() => {
  mediaQueryMatches = true;
  mediaQueryListeners = [];
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  window.matchMedia = vi.fn((query: string) => {
    const mediaQuery = {
      get matches() {
        return mediaQueryMatches;
      },
      media: query,
      onchange: null,
      addEventListener: vi.fn(
        (_eventName: "change", listener: (event: MediaQueryListEvent) => void) => {
          mediaQueryListeners.push(listener);
        },
      ),
      removeEventListener: vi.fn(
        (_eventName: "change", listener: (event: MediaQueryListEvent) => void) => {
          mediaQueryListeners = mediaQueryListeners.filter(
            (storedListener) => storedListener !== listener,
          );
        },
      ),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    return mediaQuery as unknown as MediaQueryList;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("MobileExperienceNotice", () => {
  it("appears on a mobile viewport when no dismissal value exists", async () => {
    render(<MobileExperienceNotice content={enContent} />);

    const dialog = await screen.findByRole("dialog", {
      name: "Experience the full story",
    });

    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "mobile-notice-title");
    expect(dialog).toHaveAttribute("aria-describedby", "mobile-notice-description");
    expect(screen.getByText("Desktop recommended")).toBeVisible();
    expect(screen.getByRole("button", { name: "Continue on mobile" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("does not appear on a desktop viewport", async () => {
    mediaQueryMatches = false;

    render(<MobileExperienceNotice content={enContent} />);

    await waitFor(() => expect(window.matchMedia).toHaveBeenCalled());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("reacts when the viewport changes to mobile", async () => {
    mediaQueryMatches = false;

    render(<MobileExperienceNotice content={enContent} />);

    await waitFor(() => expect(window.matchMedia).toHaveBeenCalled());
    mediaQueryMatches = true;
    emitMediaQueryChange();

    expect(
      await screen.findByRole("dialog", { name: "Experience the full story" }),
    ).toBeVisible();
  });

  it("closes immediately and stores the dismissal from the confirmation button", async () => {
    const user = userEvent.setup();

    render(<MobileExperienceNotice content={enContent} />);

    await user.click(await screen.findByRole("button", { name: "Continue on mobile" }));

    expect(localStorage.getItem(mobileExperienceNoticeStorageKey)).toBe("true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses the same dismissal behaviour from the close button", async () => {
    const user = userEvent.setup();

    render(<MobileExperienceNotice content={enContent} />);

    await user.click(
      await screen.findByRole("button", { name: "Close mobile notice" }),
    );

    expect(localStorage.getItem(mobileExperienceNoticeStorageKey)).toBe("true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not reappear when the stored dismissal value exists", async () => {
    localStorage.setItem(mobileExperienceNoticeStorageKey, "true");

    render(<MobileExperienceNotice content={enContent} />);

    await waitFor(() => expect(window.matchMedia).toHaveBeenCalled());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    emitMediaQueryChange();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes from Escape and persists the dismissal", async () => {
    const user = userEvent.setup();

    render(<MobileExperienceNotice content={enContent} />);

    expect(await screen.findByRole("dialog")).toBeVisible();
    await user.keyboard("{Escape}");

    expect(localStorage.getItem(mobileExperienceNoticeStorageKey)).toBe("true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders translated English and German content from the home dictionaries", async () => {
    const { unmount } = render(<MobileExperienceNotice content={enContent} />);

    expect(
      await screen.findByRole("heading", { name: "Experience the full story" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        /Falling for Fame is designed as an immersive desktop experience/i,
      ),
    ).toBeVisible();

    unmount();
    localStorage.clear();

    render(<MobileExperienceNotice content={deContent} />);

    expect(
      await screen.findByRole("heading", {
        name: "Erlebe die ganze Geschichte",
      }),
    ).toBeVisible();
    expect(screen.getByText("Desktop empfohlen")).toBeVisible();
    expect(screen.getByRole("button", { name: "Mobil fortfahren" })).toBeVisible();
  });

  it("renders nothing during server rendering to avoid hydration flash", () => {
    const html = renderToString(<MobileExperienceNotice content={enContent} />);

    expect(html).toBe("");
  });
});

function emitMediaQueryChange() {
  const event = { matches: mediaQueryMatches } as MediaQueryListEvent;

  for (const listener of mediaQueryListeners) {
    listener(event);
  }
}
