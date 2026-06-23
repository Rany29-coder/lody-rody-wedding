// ─────────────────────────────────────────────────────────────
// Edit everything about the wedding here. Placeholders are fine —
// just swap in the real details when you have them.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  bride: "Lody",
  groom: "Rody",

  // Use ISO format: "YYYY-MM-DDTHH:mm:ss". Leave date null to hide the countdown.
  // Placeholder: one year from a round date — replace with the real one.
  date: "2026-12-12T17:00:00",

  // Human-friendly strings shown on the card (override the auto-format if you like)
  dateLabel: "Saturday, December 12th, 2026",
  timeLabel: "5:00 in the evening",

  venueName: "The Venue",
  venueAddress: "City, Country",

  // Optional Google Maps link for the venue (leave empty to hide the button)
  mapsUrl: "",

  // Short line under the names
  invitationLine: "Together with their families, request the honour of your presence",

  // RSVP — set to a mailto, a Google Form, or "" to hide for now
  rsvpUrl: "",
} as const;
