/**
 * Quick Book time slots. All times are South African time (Africa/Johannesburg),
 * whatever time zone the visitor's phone is set to.
 */
export const schedule = {
  timeZone: 'Africa/Johannesburg',
  closingTime: '20:00', // Terrific Loads operates until 20:00
  /**
   * A slot can still be booked today until this many minutes before it ends.
   * CLIENT TO CONFIRM (60 is a placeholder).
   */
  leadMinutes: 60,
  slots: [
    { id: '09-12', start: '09:00', end: '12:00' },
    { id: '12-15', start: '12:00', end: '15:00' },
    { id: '15-18', start: '15:00', end: '18:00' },
    { id: '18-20', start: '18:00', end: '20:00' },
  ],
}

export const slotLabel = (slot) => `${slot.start}–${slot.end}`
