import { render, screen, waitFor } from "@testing-library/react";
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
});
