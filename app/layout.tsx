import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import "./globals.css";

// Elegant serif for headings + body — luxurious, editorial feel
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Flowing script — for the couple's names, the "cute" romantic touch
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

// Clean modern sans — for small UI labels, dates, buttons
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Lody & Rody — You're Invited 💛",
  description:
    "Together with their families, Lody & Rody invite you to celebrate their wedding.",
  openGraph: {
    title: "Lody & Rody — You're Invited 💛",
    description:
      "Together with their families, Lody & Rody invite you to celebrate their wedding.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0807",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
