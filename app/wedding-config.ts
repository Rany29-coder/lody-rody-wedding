// ─────────────────────────────────────────────────────────────
// Edit everything about the wedding here. Placeholders are fine —
// just swap in the real details when you have them.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  bride: "Lody",
  groom: "Rody",

  // Use ISO format: "YYYY-MM-DDTHH:mm:ss". Leave date null to hide the countdown.
  // Confirmed in the selected invitation supplied September 22. Cairo is UTC+02 on this date.
  date: "2026-11-07T19:00:00+02:00",
  // Duration in hours (used for the "Add to calendar" file)
  durationHours: 4,

  // Human-friendly strings shown on the card (override the auto-format if you like)
  dateLabel: "Saturday, November 7th, 2026",
  timeLabel: "7:00 PM",
  dateShort: "07 · 11 · 2026",

  venueName: "Kasr El Dobara Evangelical Church",
  venueAddress: "Tahrir Square, Cairo, Egypt",

  // Google Maps link for the venue
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Qasr+El+Dobara+Evangelical+Church+Cairo",

  // Short line under the names (the couple will send final wording)
  invitationLine: "Would like you to join their wedding ceremony",

  // Social hashtag shown in the closing section
  hashtag: "#RodyAndLody",

  // Painted background illustration (KDEC scene). Drop the file in /public
  // and set its name here, e.g. "venue.jpg". Empty = ivory-gold backdrop.
  backgroundImage: "",
} as const;
