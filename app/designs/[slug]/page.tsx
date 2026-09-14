import { notFound } from "next/navigation";
import { designs } from "../../components/designs/catalog";
import DesignExperience from "../../components/designs/DesignExperience";
import "../../components/designs/designs.css";
export function generateStaticParams() {
  return designs.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = designs.find((d) => d.slug === slug);
  return {
    title: `${design?.name || "Invitation"} — Rody & Lody`,
    description:
      "Join Rody & Lody on November 7, 2026. A botanical wedding invitation.",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = designs.find((d) => d.slug === slug);
  if (!design) notFound();
  return <DesignExperience design={design} />;
}
