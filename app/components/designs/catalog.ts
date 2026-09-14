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
  {
    slug: "the-vellum",
    name: "The Vellum Wrap",
    short: "A soft glimpse of forever.",
    description:
      "Lift a translucent vellum wrap to bring a botanical invitation into focus.",
    action: "Lift the vellum",
    number: "06",
    mood: "Translucent paper · rose seal · delicate layers",
  },
  {
    slug: "the-ribbon",
    name: "Tied Together",
    short: "Tied together. Forever.",
    description:
      "Release a satin ribbon and let its two ends fall away from your invitation.",
    action: "Untie the ribbon",
    number: "07",
    mood: "Ivory cotton · sage satin · a graceful release",
  },
  {
    slug: "the-scroll",
    name: "The Forever Scroll",
    short: "Let our story unfold.",
    description:
      "Unroll a little parchment scroll between two rose-toned rollers to reveal the wedding day.",
    action: "Unroll our story",
    number: "08",
    mood: "Warm parchment · rolled edges · old-world romance",
  },
  {
    slug: "the-fan",
    name: "Petals of a Promise",
    short: "Every little part leads to us.",
    description:
      "Fan out a set of botanical keepsake cards: the names, the day, and the place.",
    action: "Open the petals",
    number: "09",
    mood: "Layered cards · botanical print · playful movement",
  },
  {
    slug: "the-frame",
    name: "A Moment in Glass",
    short: "A moment to keep forever.",
    description:
      "Swing open a glass display frame to reveal a pressed-botanical invitation inside.",
    action: "Open the frame",
    number: "10",
    mood: "Rose metal · glass reflections · pressed foliage",
  },
] as const;
export type DesignSlug = (typeof designs)[number]["slug"];
export const artPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/designs/botanical-paper.webp`;
