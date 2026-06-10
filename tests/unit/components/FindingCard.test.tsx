import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FindingCard } from "@/components/scrollytelling/FindingCard";
import type { Finding } from "@/types/story";

const finding: Finding = {
  id: "visibility-pressure",
  theme: "visibility",
  title: "Visibility can become a condition of participation",
  summary:
    "Digital attention influences documentation practices and can affect how athletes evaluate a successful jump.",
};

describe("FindingCard", () => {
  it("renders the finding content", () => {
    render(<FindingCard finding={finding} />);

    expect(screen.getByText("visibility")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Visibility can become a condition of participation",
        level: 2,
      }),
    ).toBeVisible();
    expect(screen.getByText(finding.summary)).toBeVisible();
  });
});
