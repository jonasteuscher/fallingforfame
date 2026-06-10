import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatisticBlock } from "@/components/scrollytelling/StatisticBlock";

describe("StatisticBlock", () => {
  it("renders value, label, and detail", () => {
    render(
      <StatisticBlock
        value="5"
        label="Athlete portraits"
        detail="Prepared for interview-led multimedia chapters."
      />,
    );

    expect(screen.getByText("5")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Athlete portraits", level: 2 }),
    ).toBeVisible();
    expect(screen.getByText("Prepared for interview-led multimedia chapters."))
      .toBeVisible();
  });

  it("handles a missing detail", () => {
    render(<StatisticBlock value="2" label="Languages" />);

    expect(screen.getByText("2")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Languages" })).toBeVisible();
    expect(
      screen.queryByText("Prepared for interview-led multimedia chapters."),
    ).not.toBeInTheDocument();
  });
});
