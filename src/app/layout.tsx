import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = new URL("https://fallingforfame.com");
const sharedOgImage = {
  url: "/og/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Falling for Fame?",
};

// Paint edge to edge without restricting the reader's pinch zoom.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a1a2f" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a2f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Falling for Fame?",
    template: "%s | Falling for Fame?",
  },
  description:
    "A bilingual multimedia scrollytelling documentary about visibility, risk and identity in modern BASE jumping.",
  openGraph: {
    title: "Falling for Fame?",
    description:
      "A bilingual multimedia scrollytelling documentary about visibility, risk and identity in modern BASE jumping.",
    url: siteUrl,
    siteName: "Falling for Fame?",
    images: [sharedOgImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Falling for Fame?",
    description:
      "A bilingual multimedia scrollytelling documentary about visibility, risk and identity in modern BASE jumping.",
    images: [sharedOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        {process.env.NODE_ENV === "production" ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
