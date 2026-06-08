import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PullQuote } from "@/components/scrollytelling/PullQuote";

describe("PullQuote", () => {
  it("renders the quote and attribution", () => {
    render(<PullQuote quote="Risk changes on camera." attribution="Marcel Geser" />);

    expect(screen.getByText("Risk changes on camera.")).toBeVisible();
    expect(screen.getByText("Marcel Geser")).toBeVisible();
  });

  it("handles a missing attribution", () => {
    render(<PullQuote quote="A standalone quote." />);

    expect(screen.getByText("A standalone quote.")).toBeVisible();
    expect(screen.queryByText("Marcel Geser")).not.toBeInTheDocument();
  });
});
