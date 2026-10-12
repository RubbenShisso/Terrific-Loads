/**
 * What to tell a visitor about delivery slots right now, from the time in Cape
 * Town. Wording is always "subject to availability": the real answer is agreed
 * on WhatsApp. The 12:00 and 18:00 cut-offs are assumptions to confirm.
 */
export const slotCutoffs = { sameDayUntil: 12, nextDayUntil: 18 }

export function nextSlot(date = new Date()) {
  const hour =
    Number(new Intl.DateTimeFormat('en-ZA', { hour: 'numeric', hour12: false, timeZone: 'Africa/Johannesburg' }).format(date)) % 24
  if (hour >= 5 && hour < slotCutoffs.sameDayUntil) return 'Same-day slots may still be available today. Message us now.'
  if (hour >= slotCutoffs.sameDayUntil && hour < slotCutoffs.nextDayUntil) return 'Book now for next-day delivery. Same-day is limited this afternoon.'
  return 'Message us tonight to book your delivery for tomorrow.'
}
