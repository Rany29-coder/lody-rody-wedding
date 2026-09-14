import ReviewCollection from "../components/designs/ReviewCollection";
import "../components/designs/designs.css";
export const metadata = {
  title: "Rody & Lody — Choose your invitation",
  description:
    "Made for Rody & Lody: explore ten interactive wedding invitation designs, shortlist your favorites, and share your thoughts. Step one: choose your opening.",
  openGraph: {
    title: "Rody & Lody — Which beginning feels like you?",
    description:
      "Ten invitation designs, made just for you. Explore, choose your favorites, and share your feedback.",
  },
};
export default function Collection() {
  return <ReviewCollection />;
}
