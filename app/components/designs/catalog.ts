export const designs = [
  {
    slug: "the-letter",
    name: "The Botanical Letter",
    short: "A little letter. A lifetime of love.",
    description:
      "Break a rose wax seal. Watch the folded paper open and your invitation rise into the light.",
    action: "Break the seal",
    number: "01",
    mood: "Ivory paper · rose wax · botanical ink",
  },
  {
    slug: "the-fold",
    name: "The Garden Gate",
    short: "Two sides. One beautiful beginning.",
    description:
      "Open a pair of botanical paper doors to reveal an invitation nestled between their folds.",
    action: "Open the gates",
    number: "02",
    mood: "Sage folds · sculpted paper · soft daylight",
  },
  {
    slug: "the-keepsake",
    name: "The Keepsake Box",
    short: "Something beautiful, just for you.",
    description:
      "Slide the lid from a sage linen keepsake box and discover the invitation resting inside.",
    action: "Slide to discover",
    number: "03",
    mood: "Sage linen · cotton paper · ribbon details",
  },
  {
    slug: "the-storybook",
    name: "Our Next Chapter",
    short: "The best chapter starts with us.",
    description:
      "Turn the cover of a rose linen book, then turn the pages to discover the day and its details.",
    action: "Turn the cover",
    number: "04",
    mood: "Dusty rose · bound pages · a personal story",
  },
  {
    slug: "the-garden",
    name: "Under the Olive Trees",
    short: "A day to grow together.",
    description:
      "Step through layers of a paper garden. Move the light and see the shadows travel across the invitation.",
    action: "Enter the garden",
    number: "05",
    mood: "Layered arches · botanical shadows · garden light",
  },
] as const;
export type DesignSlug = (typeof designs)[number]["slug"];
export const artPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/designs/botanical-paper.webp`;
