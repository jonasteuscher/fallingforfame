import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

import { getMockPathname } from "./tests/test-utils/next-navigation";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string | { src: string };
    fill?: boolean;
    priority?: boolean;
  }) => {
    const { fill, priority, sizes, ...imgProps } = props;
    void fill;
    void priority;
    void sizes;

    return (
    React.createElement("img", {
      src: typeof src === "string" ? src : src.src,
      alt: alt ?? "",
      ...imgProps,
    })
    );
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => getMockPathname(),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});
