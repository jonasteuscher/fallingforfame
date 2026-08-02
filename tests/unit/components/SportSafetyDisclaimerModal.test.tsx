import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SportSafetyDisclaimerModal } from "@/components/sport/SportSafetyDisclaimerModal";
import { sport } from "@/content/en/sport";

const storageKey = "sport-safety-warning-accepted";

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
});

describe("SportSafetyDisclaimerModal", () => {
  it("opens as a mandatory safety warning and locks page scrolling", async () => {
    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    const dialog = screen.getByRole("dialog", {
      name: /base jumping is an extremely dangerous activity/i,
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("WARNING")).toBeVisible();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "I Understand" })).toBeVisible();

    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
  });

  it("does not close from Escape and only closes after acknowledgement", async () => {
    const user = userEvent.setup();

    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("dialog", {
        name: /base jumping is an extremely dangerous activity/i,
      }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "I Understand" }));

    expect(sessionStorage.getItem(storageKey)).toBe("true");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not show again after acknowledgement in the same session", async () => {
    sessionStorage.setItem(storageKey, "true");

    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("keeps keyboard focus inside the mandatory dialog", async () => {
    const user = userEvent.setup();
    const outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside";
    document.body.append(outsideButton);

    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    const confirmButton = screen.getByRole("button", { name: "I Understand" });
    const dialog = screen.getByRole("dialog", {
      name: /base jumping is an extremely dangerous activity/i,
    });

    await waitFor(() => expect(dialog).toHaveFocus());

    await user.tab();
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(confirmButton).toHaveFocus();

    fireEvent.focusIn(outsideButton);

    expect(confirmButton).toHaveFocus();
  });

  it("adds scrollbar compensation while open and restores document styles after acknowledgement", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 976,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 140,
    });

    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    await waitFor(() => expect(document.body.style.paddingRight).toBe("24px"));
    expect(document.body.style.top).toBe("-140px");

    await user.click(screen.getByRole("button", { name: "I Understand" }));

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.paddingRight).toBe("");
    expect(document.body.style.position).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 140);
  });

  it("still renders and closes when session storage is unavailable", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    render(<SportSafetyDisclaimerModal content={sport.safetyDisclaimer} />);

    expect(
      screen.getByRole("dialog", {
        name: /base jumping is an extremely dangerous activity/i,
      }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "I Understand" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
