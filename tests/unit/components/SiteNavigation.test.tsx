import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { resetMockPathname, setMockPathname } from "../../test-utils/next-navigation";

const labels = {
  menu: "Navigation",
  language: "Language",
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
  openMenuShort: "Open menu",
  closeMenuShort: "Close menu",
};

const links = [
  { href: "/en", label: "Home" },
  { href: "/en/sport", label: "About the Sport" },
  { href: "/en/athletes", label: "Athletes" },
  { href: "/en/project", label: "The Project" },
  { href: "/en/findings", label: "Findings" },
];

afterEach(() => {
  resetMockPathname();
});

describe("SiteNavigation", () => {
  it("renders desktop navigation links", () => {
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

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
  });

  it("renders desktop navigation links in the expected order", () => {
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

    expect(
      screen
        .getAllByRole("link")
        .slice(0, links.length)
        .map((link) => link.textContent),
    ).toEqual(["Home", "About the Sport", "Athletes", "The Project", "Findings"]);
  });

  it("keeps the hamburger menu closed by default", () => {
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

    const button = screen.getByRole("button", { name: labels.openMenu });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: labels.menu })).not.toBeInTheDocument();
  });

  it("opens and closes the hamburger menu by click", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

    const button = screen.getByRole("button", { name: labels.openMenu });
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: labels.menu })).toBeVisible();

    await user.click(
      within(screen.getByRole("dialog", { name: labels.menu })).getByRole("button", {
        name: labels.closeMenu,
      }),
    );

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: labels.menu })).not.toBeInTheDocument();
  });

  it("closes the hamburger menu with Escape", async () => {
    const user = userEvent.setup();
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

    const button = screen.getByRole("button", { name: labels.openMenu });
    await user.click(button);
    await user.keyboard("{Escape}");

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: labels.menu })).not.toBeInTheDocument();
  });

  it("does not render background content inside the mobile menu", async () => {
    const user = userEvent.setup();
    render(
      <>
        <main>Background content</main>
        <SiteNavigation locale="en" links={links} labels={labels} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: labels.openMenu }));

    const dialog = screen.getByRole("dialog", { name: labels.menu });
    expect(within(dialog).queryByText("Background content")).not.toBeInTheDocument();
    expect(screen.getByText("Background content")).toBeVisible();
  });

  it("renders EN and DE language links with localized hrefs", () => {
    setMockPathname("/en/athletes/marcel-geser");
    render(<SiteNavigation locale="en" links={links} labels={labels} />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/athletes/marcel-geser",
    );
    expect(screen.getByRole("link", { name: "DE" })).toHaveAttribute(
      "href",
      "/de/athletes/marcel-geser",
    );
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "DE" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
