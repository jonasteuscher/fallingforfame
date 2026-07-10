import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AthleteHero } from "@/components/athletes/AthleteHero";
import { athletes } from "@/data/athletes";

describe("AthleteHero", () => {
  it("renders the hero quote semantically", () => {
    const athlete = athletes.find((item) => item.slug === "tim-howell");

    if (!athlete) {
      throw new Error("Tim Howell fixture missing");
    }

    const { container } = render(
      <AthleteHero
        athlete={athlete}
        title={athlete.content.en.title}
        meta="From United Kingdom | 37 years"
        quote={athlete.heroQuote.en}
        scrollHint="Scroll the profile"
      />,
    );

    expect(screen.getByText("Knowledge dispels fear.")).toBeVisible();
    expect(container.querySelector("blockquote")).toHaveTextContent(
      "Knowledge dispels fear.",
    );
    expect(container.querySelector("blockquote p")).toHaveClass(
      "[overflow-wrap:anywhere]",
    );
  });

  it("still renders when optional athlete metadata is missing", () => {
    const athlete = athletes.find((item) => item.slug === "tim-howell");

    if (!athlete) {
      throw new Error("Tim Howell fixture missing");
    }

    render(
      <AthleteHero
        athlete={{ ...athlete, age: null, country: null }}
        title={athlete.content.en.title}
        meta="Country unknown | Age unknown"
        quote={athlete.heroQuote.en}
        scrollHint="Scroll the profile"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Tim Howell", level: 1 }),
    ).toBeVisible();
    expect(screen.getByText("Country unknown | Age unknown")).toBeVisible();
    expect(screen.getByText("Knowledge dispels fear.")).toBeVisible();
  });

  it("constrains mobile overflow-prone hero content", () => {
    const athlete = athletes.find((item) => item.slug === "lukas-loibl");

    if (!athlete) {
      throw new Error("Lukas Loibl fixture missing");
    }

    const { container } = render(
      <AthleteHero
        athlete={athlete}
        title={athlete.content.en.title}
        meta="From Austria | 26 years"
        quote={athlete.heroQuote.en}
        scrollHint="Scroll the profile"
      />,
    );

    expect(container.querySelector("section")).toHaveClass("overflow-hidden");
    expect(container.querySelector("blockquote")).toHaveClass("max-w-[42rem]");
    expect(screen.getByRole("heading", { name: "Lukas Loibl" })).toHaveClass(
      "[overflow-wrap:anywhere]",
    );
  });
});
