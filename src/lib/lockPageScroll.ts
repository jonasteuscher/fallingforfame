let lockCount = 0;
let restorePage: (() => void) | undefined;

/** Fixed positioning keeps the document still behind overlays in iOS Safari. */
export function lockPageScroll() {
  if (lockCount === 0) {
    const root = document.documentElement;
    const body = document.body;
    const { scrollX, scrollY } = window;
    const previousRootOverflow = root.style.overflow;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const paddingRight = getComputedStyle(body).paddingRight || "0px";

    root.style.overflow = "hidden";
    Object.assign(body.style, {
      overflow: "hidden",
      position: "fixed",
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
      width: "100%",
    });
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `calc(${paddingRight} + ${scrollbarWidth}px)`;
    }

    restorePage = () => {
      root.style.overflow = previousRootOverflow;
      Object.assign(body.style, previousBodyStyles);
      // Restoring scroll must not animate through the document's smooth scrolling.
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    };
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) {
      restorePage?.();
      restorePage = undefined;
    }
  };
}
