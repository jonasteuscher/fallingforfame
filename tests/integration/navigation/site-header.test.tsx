import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { site as enSite } from "@/content/en/site";
import { resetMockPathname, setMockPathname } from "../../test-utils/next-navigation";

afterEach(() => {
  resetMockPathname();
});

describe("navigation integration", () => {
  it("renders desktop navigation links with localized routes", () => {
    render(<SiteHeader locale="en" navigation={enSite.navigation} />);

    expect(screen.getByRole("navigation", { name: "Primary navigation" }))
      .toBeVisible();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "Athletes" })).toHaveAttribute(
      "href",
      "/en/athletes",
    );
    expect(screen.getByRole("link", { name: "Findings" })).toHaveAttribute(
      "href",
      "/en/findings",
    );
    expect(screen.getByRole("link", { name: "About the Sport" })).toHaveAttribute(
      "href",
      "/en/sport",
    );
    expect(screen.getByRole("link", { name: "The Project" })).toHaveAttribute(
      "href",
      "/en/project",
    );
    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link")
        .slice(1, 6)
        .map((link) => link.textContent),
    ).toEqual(["Home", "About the Sport", "Athletes", "The Project", "Findings"]);
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader locale="en" navigation={enSite.navigation} />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    expect(screen.getByRole("dialog", { name: "Navigation" })).toBeVisible();

    await user.click(
      within(screen.getByRole("dialog", { name: "Navigation" })).getByRole("button", {
        name: "Close navigation menu",
      }),
    );

    expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();
  });

  it("renders working language links inside the mobile menu", async () => {
    const user = userEvent.setup();
    setMockPathname("/en/athletes/marcel-geser");
    render(<SiteHeader locale="en" navigation={enSite.navigation} />);

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(within(dialog).getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/athletes/marcel-geser",
    );
    expect(within(dialog).getByRole("link", { name: "DE" })).toHaveAttribute(
      "href",
      "/de/athletes/marcel-geser",
    );
    expect(within(dialog).getByRole("link", { name: "EN" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(within(dialog).getByRole("link", { name: "DE" }));
    expect(screen.queryByRole("dialog", { name: "Navigation" })).not.toBeInTheDocument();
  });
});
