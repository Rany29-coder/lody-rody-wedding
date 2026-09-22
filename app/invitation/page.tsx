import { Barlow_Condensed, Bodoni_Moda } from "next/font/google";
import SelectedInvitation from "../components/selected/SelectedInvitation";
import "../components/designs/designs.css";
import "../components/selected/selected.css";
const condensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-condensed",
});
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});
export const metadata = {
  title: "Rody & Lody — November 7, 2026",
  description:
    "Your loved ones are also ours. Join Rody & Lody at 6:30 PM, Kasr El Dobara Evangelical Church, Tahrir Square, Cairo.",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/invitation/monogram.svg`,
  },
  openGraph: {
    title: "Rody & Lody — You are invited",
    description: "November 7, 2026 · 6:30 PM · Kasr El Dobara, Cairo",
    type: "website",
    images: [
      {
        url: "https://rany29-coder.github.io/lody-rody-wedding/invitation/invitation-share-630.jpg",
        width: 600,
        height: 844,
        alt: "Rody and Lody — sage and ivory wedding invitation",
      },
    ],
  },
};
export const viewport = { themeColor: "#819076" };
export default function InvitationPage() {
  return (
    <div className={`${condensed.variable} ${display.variable}`}>
      <SelectedInvitation />
    </div>
  );
}
