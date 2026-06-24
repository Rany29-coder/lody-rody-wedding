// ─────────────────────────────────────────────────────────────
// Edit everything about the wedding here. Placeholders are fine —
// just swap in the real details when you have them.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  bride: "Lody",
  groom: "Rody",

  // Use ISO format: "YYYY-MM-DDTHH:mm:ss". Leave date null to hide the countdown.
  // Placeholder — replace with the real one.
  date: "2026-12-12T17:00:00",
  // Duration in hours (used for the "Add to calendar" file)
  durationHours: 4,

  // Human-friendly strings shown on the card (override the auto-format if you like)
  dateLabel: "Saturday, December 12th, 2026",
  timeLabel: "5:00 in the evening",

  venueName: "Qasr El Dobara Evangelical Church",
  venueAddress: "Downtown, Cairo, Egypt",

  // Google Maps link for the venue
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Qasr+El+Dobara+Evangelical+Church+Cairo",

  // Short line under the names
  invitationLine:
    "Together with their families, request the honour of your presence",

  // Social hashtag shown in the closing section
  hashtag: "#RodyAndLody",

  // Painted background illustration (KDEC scene). Drop the file in /public
  // and set its name here, e.g. "venue.jpg". Empty = plain black-gold backdrop.
  backgroundImage: "",
} as const;
