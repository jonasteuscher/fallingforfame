import { describe, expect, it } from "vitest";

import { sectionSpacing } from "@/components/athletes/AthleteDocumentaryPage";

describe("AthleteDocumentaryPage shared section system", () => {
  it("defines semantic spacing variants for reusable athlete sections", () => {
    expect(sectionSpacing).toEqual({
      compact: "py-16 md:py-24",
      standard: "py-24 md:py-36",
      immersive: "py-32 md:py-48",
    });
  });
});
