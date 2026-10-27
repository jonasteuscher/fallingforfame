import { afterEach, describe, expect, it, vi } from "vitest";

import { lockPageScroll } from "@/lib/lockPageScroll";

afterEach(() => vi.restoreAllMocks());

describe("overlay scroll locking", () => {
  it("restores the document's styles and scroll position without animation", () => {
    vi.spyOn(window, "scrollY", "get").mockReturnValue(420);
    document.body.style.position = "relative";
    document.body.style.paddingRight = "12px";

    const unlock = lockPageScroll();
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-420px");
    expect(document.documentElement.style.overflow).toBe("hidden");

    unlock();
    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.paddingRight).toBe("12px");
    expect(window.scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 420,
      behavior: "instant",
    });
  });

  it("keeps the page locked until overlapping overlays have both closed", () => {
    const unlockFirst = lockPageScroll();
    const unlockSecond = lockPageScroll();
    unlockFirst();
    unlockFirst(); // Cleanup is safe to call more than once.
    expect(document.body.style.position).toBe("fixed");
    unlockSecond();
    expect(document.body.style.position).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
