/**
 * Form submission service.
 *
 * Posts JSON to VITE_FORM_ENDPOINT. That works with Formspree, Getform,
 * Basin, a serverless function, or any endpoint that accepts JSON and
 * returns a 2xx status. Swap the transport here without touching the UI.
 */
const endpoint = import.meta.env.VITE_FORM_ENDPOINT

export const isFormConfigured = Boolean(endpoint)

export class FormServiceError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

export async function submitForm(data, { formName = 'quote', timeoutMs = 15000 } = {}) {
  if (!endpoint) {
    throw new FormServiceError('The quote form is not connected yet.', 'not-configured')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, _form: formName, _subject: `New ${formName} request` }),
      signal: controller.signal,
    })
    if (!res.ok) throw new FormServiceError(`Request failed (${res.status}).`, 'http')
    return { ok: true }
  } catch (err) {
    if (err instanceof FormServiceError) throw err
    if (err.name === 'AbortError') throw new FormServiceError('The request timed out.', 'timeout')
    throw new FormServiceError('Network error.', 'network')
  } finally {
    clearTimeout(timer)
  }
}
