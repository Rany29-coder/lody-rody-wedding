import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script, Cinzel } from "next/font/google";
import "./globals.css";

// Refined serif for body, dates, monogram — luxurious editorial feel
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Elegant calligraphy for the couple's names and accents
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

// Engraved Roman capitals for labels + buttons — high-end wedding feel
const cinzel = Cinzel({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${cormorant.variable} ${pinyon.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
