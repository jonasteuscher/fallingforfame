import type { Metadata } from "next";

import { LocalizedNotFoundContent } from "@/components/LocalizedNotFoundContent";

export const metadata: Metadata = {
  title: "404 · Page Not Found | Falling for Fame?",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocaleNotFound() {
  return <LocalizedNotFoundContent as="section" />;
}
