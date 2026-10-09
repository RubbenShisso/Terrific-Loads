import { schedule } from '../config/timeSlots.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Wall-clock date and time in South Africa, whatever the device's time zone. */
export function saNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-ZA', {
      timeZone: schedule.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

function dayInfo(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d))
  return {
    iso: date.toISOString().slice(0, 10),
    label: `${DAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`,
  }
}

/** Today and tomorrow (South African dates) with readable labels. */
export function getQuickBookDays(now = new Date()) {
  const t = saNow(now)
  const today = dayInfo(t.year, t.month, t.day)
  const next = new Date(Date.UTC(t.year, t.month - 1, t.day + 1))
  const tomorrow = dayInfo(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())
  return { today, tomorrow }
}

/**
 * Slots that can still be booked. Tomorrow: every slot. Today: a slot is
 * available until `leadMinutes` before it ends, and never after closing time.
 */
export function getAvailableSlots(day, now = new Date()) {
  if (day === 'tomorrow') return schedule.slots
  if (day !== 'today') return []
  const { minutes } = saNow(now)
  if (minutes >= toMinutes(schedule.closingTime)) return []
  return schedule.slots.filter((s) => minutes < toMinutes(s.end) - schedule.leadMinutes)
}
