import { render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AthleteProfileOverview,
  STAT_COUNTER_CONFIG,
} from "@/components/athletes/AthleteProfileOverview";
import { athletes } from "@/data/athletes";
import type { Athlete } from "@/types/athlete";

type ObserverCallback = IntersectionObserverCallback;

const originalIntersectionObserver = window.IntersectionObserver;

const enLabels = {
  eyebrow: "Profile",
  title: "Profile and Experience",
  profession: "Profession",
  role: "Role",
  disciplines: "Primary Disciplines",
  baseSince: "BASE since",
  baseJumps: "BASE jumps",
  skydives: "Skydives",
  reach: "Reach",
  sponsorship: "Sponsorship",
  statsNote: "(as of Spring 2026)",
  unknown: "Unknown",
  yes: "Yes",
  no: "No",
};

const deLabels = {
  eyebrow: "Profil",
  title: "Profil und Erfahrung",
  profession: "Beruf",
  role: "Rolle",
  disciplines: "Primäre Disziplinen",
  baseSince: "BASE seit",
  baseJumps: "BASE Jumps",
  skydives: "Skydives",
  reach: "Reichweite",
  sponsorship: "Sponsoring",
  statsNote: "(Stand Frühjahr 2026)",
  unknown: "Unbekannt",
  yes: "Ja",
  no: "Nein",
};

let observerInstances: Array<{
  callback: ObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
  observe: ReturnType<typeof vi.fn>;
}> = [];

beforeEach(() => {
  observerInstances = [];
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalIntersectionObserver) {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: originalIntersectionObserver,
    });
  } else {
    Reflect.deleteProperty(window, "IntersectionObserver");
  }
});

describe("AthleteProfileOverview", () => {
  it("renders portrait, biography, metadata, disciplines and five metrics", () => {
    const athlete = athleteFixture("marcel-geser");
    const { container } = render(
      <AthleteProfileOverview
        athlete={athlete}
        locale="en"
        labels={enLabels}
        portraitAlt="Marcel Geser wearing a helmet and blue wingsuit gear"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Profile and Experience", level: 2 }),
    ).toBeVisible();
    expect(
      screen.getByAltText("Marcel Geser wearing a helmet and blue wingsuit gear"),
    ).toHaveAttribute("src", "/images/athletes/marcel-geser/profile.jpg");
    expect(screen.getByText(athlete.content.en.shortBio)).toBeVisible();
    expect(screen.getByText("Paragliding Pilot")).toBeVisible();
    expect(screen.getAllByText("Hobby BASE Jumper").length).toBeGreaterThan(0);
    expect(screen.getByText("Terminal")).toBeVisible();
    expect(screen.getByText("Wingsuit")).toBeVisible();
    expect(screen.getByText("Tracking")).toBeVisible();
    expect(screen.getByText("(as of Spring 2026)")).toBeVisible();
    expect(container.querySelectorAll("dl")[1]?.querySelectorAll("dt")).toHaveLength(5);
  });

  it("keeps formatted numeric values and nonnumeric sponsorship values separate", async () => {
    render(
      <AthleteProfileOverview
        athlete={athleteFixture("niclas-strohmeier")}
        locale="de"
        labels={deLabels}
        portraitAlt="Niclas Strohmeier mit weissem Helm fliegt nah an grünen Felsen"
        portraitPlaceholder="Portraitmedien ausstehend"
      />,
    );

    expect(screen.getByText("BASE seit")).toBeVisible();
    expect(screen.getByText("BASE Jumps")).toBeVisible();
    expect(screen.getByText("Reichweite")).toBeVisible();
    expect(screen.getByText("2018")).toBeInTheDocument();
    expect(screen.getByText("1’000+")).toBeInTheDocument();
    expect(screen.getByText("630+")).toBeInTheDocument();
    expect(screen.getByText("500’000+")).toBeInTheDocument();

    const sponsorship = screen.getByText("Sponsoring").closest("div");
    expect(sponsorship).not.toBeNull();
    await waitFor(() =>
      expect(within(sponsorship as HTMLElement).getByText("Nein")).toBeVisible(),
    );
    expect(sponsorship).not.toHaveTextContent("0");
    expect(screen.queryByText(/Sponsoring-Beziehungen/)).not.toBeInTheDocument();
  });

  it("renders sponsor names as neutral biography text without links or logos", () => {
    render(
      <AthleteProfileOverview
        athlete={athleteFixture("tim-howell")}
        locale="en"
        labels={enLabels}
        portraitAlt="Tim Howell wearing a cap and harness in front of mountains"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    expect(
      screen.getByText(
        "Tim Howell reports sponsorship relationships with Jöttnar, Scarpa, Adrenalin BASE, Inigo Insurance and Stirling Timepieces. These partnerships are documented here as part of the athlete's professional context within BASE jumping.",
      ),
    ).toBeVisible();
    expect(screen.queryByAltText(/Jöttnar logo/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Jöttnar/i })).not.toBeInTheDocument();
  });

  it("uses fallback text when optional values are missing", () => {
    const athlete: Athlete = {
      ...athleteFixture("tim-howell"),
      images: { ...athleteFixture("tim-howell").images, portrait: null },
      experience: {
        skydiveSeasons: null,
        skydives: null,
        baseSeasons: null,
        basejumps: null,
        sponsored: null,
        socialMediaReach: null,
      },
    };

    render(
      <AthleteProfileOverview
        athlete={athlete}
        locale="en"
        labels={enLabels}
        portraitAlt="Tim Howell wearing a cap and harness in front of mountains"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    expect(screen.getByText("Portrait media pending")).toBeVisible();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown")).toHaveLength(4);
  });

  it("uses the German audience fallback and stats note", () => {
    const athlete: Athlete = {
      ...athleteFixture("marcel-geser"),
      experience: {
        ...athleteFixture("marcel-geser").experience,
        socialMediaReach: null,
      },
    };

    render(
      <AthleteProfileOverview
        athlete={athlete}
        locale="de"
        labels={deLabels}
        portraitAlt="Marcel Geser mit Helm"
        portraitPlaceholder="Portraitmedien ausstehend"
      />,
    );

    expect(screen.getByText("Keine")).toBeInTheDocument();
    expect(screen.getByText("(Stand Frühjahr 2026)")).toBeVisible();
  });

  it("starts stat counters only after the stats grid enters the viewport", async () => {
    function MockIntersectionObserver(callback: ObserverCallback) {
      const instance = {
        callback,
        disconnect: vi.fn(),
        observe: vi.fn(),
      };
      observerInstances.push(instance);
      return instance;
    }

    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: vi.fn(MockIntersectionObserver),
    });

    const requestFrame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(performance.now() + STAT_COUNTER_CONFIG.duration);
        return 1;
      });

    render(
      <AthleteProfileOverview
        athlete={athleteFixture("lukas-loibl")}
        locale="en"
        labels={enLabels}
        portraitAlt="Lukas Loibl smiling in a yellow jacket outdoors"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    expect(observerInstances).toHaveLength(1);
    expect(observerInstances[0]?.observe).toHaveBeenCalledTimes(1);

    observerInstances[0]?.callback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      observerInstances[0] as unknown as IntersectionObserver,
    );
    expect(requestFrame).not.toHaveBeenCalled();

    observerInstances[0]?.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      observerInstances[0] as unknown as IntersectionObserver,
    );

    await waitFor(() => expect(requestFrame).toHaveBeenCalled());
    expect(observerInstances[0]?.disconnect).toHaveBeenCalled();
  });

  it("renders a single sponsor relationship without a list separator", () => {
    const athlete: Athlete = {
      ...athleteFixture("tim-howell"),
      sponsors: ["Solo Sponsor"],
    };

    render(
      <AthleteProfileOverview
        athlete={athlete}
        locale="en"
        labels={enLabels}
        portraitAlt="Tim Howell wearing a cap and harness in front of mountains"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    expect(
      screen.getByText(
        "Tim Howell reports sponsorship relationships with Solo Sponsor. These partnerships are documented here as part of the athlete's professional context within BASE jumping.",
      ),
    ).toBeVisible();
  });

  it("includes responsive grid classes for desktop and compact breakpoints", () => {
    const { container } = render(
      <AthleteProfileOverview
        athlete={athleteFixture("lukas-loibl")}
        locale="en"
        labels={enLabels}
        portraitAlt="Lukas Loibl smiling in a yellow jacket outdoors"
        portraitPlaceholder="Portrait media pending"
      />,
    );

    const classNames = Array.from(container.querySelectorAll("*")).map(
      (node) => node.getAttribute("class") ?? "",
    );

    expect(
      classNames.some((className) =>
        className.includes("lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]"),
      ),
    ).toBe(true);
    expect(
      classNames.some((className) => className.includes("min-[420px]:grid-cols-2")),
    ).toBe(true);
    expect(container.querySelector("[data-profile-meta]")).toHaveClass(
      "sm:[grid-template-columns:repeat(2,minmax(0,1fr))]",
    );
    expect(STAT_COUNTER_CONFIG).toMatchObject({
      duration: 1400,
      threshold: 0.4,
      easing: "easeOutCubic",
    });
  });
});

function athleteFixture(slug: string) {
  const athlete = athletes.find((item) => item.slug === slug);

  if (!athlete) {
    throw new Error(`${slug} fixture missing`);
  }

  return athlete;
}
