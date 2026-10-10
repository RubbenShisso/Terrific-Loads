/** Phone number checks for South African and international numbers. */
export const cleanPhone = (v) => (v || '').replace(/[\s\-()]/g, '')
export const isValidPhone = (v) => /^\+?\d{9,15}$/.test(cleanPhone(v))
