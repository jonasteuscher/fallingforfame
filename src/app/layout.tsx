import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://fallingforfame.com");
const sharedOgImage = {
  url: "/og/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Falling for Fame?",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
