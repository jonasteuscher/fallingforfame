import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Expandable } from "@/components/ui/Expandable";

describe("Expandable", () => {
  it("renders collapsed content and toggles the details state", async () => {
    const user = userEvent.setup();

    render(
      <Expandable title="Research details">
        <p>Interview method and observation notes.</p>
      </Expandable>,
    );

    const summary = screen.getByText("Research details");
    const details = summary.closest("details");

    expect(details).not.toHaveAttribute("open");
    expect(
      screen.getByText("Interview method and observation notes."),
    ).toBeInTheDocument();

    await user.click(summary);

    expect(details).toHaveAttribute("open");
  });
});
