import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CircleCheck, CircleAlert, LoaderCircle, Send } from 'lucide-react'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { isFormConfigured } from '../../services/formService.js'
import Field from './Field.jsx'
import { Button, WhatsAppButton } from '../ui/Button.jsx'
import useQuoteForm, { WHEN_OPTIONS, summarise } from '../../hooks/useQuoteForm.js'
import useLocationAutocomplete from '../../hooks/useLocationAutocomplete.jsx'

const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function QuoteForm() {
  const { values, errors, touched, status, sentVia, errorCode, onChange, onBlur, onSubmit, reset } = useQuoteForm()
  const statusRef = useRef(null)

  useEffect(() => {
    if (status === 'success' || status === 'error') statusRef.current?.focus()
  }, [status])

  const err = (name) => (touched[name] ? errors[name] : undefined)
  // Real place suggestions in the collection and delivery boxes.
  const collectionAc = useLocationAutocomplete({ name: 'collectionAddress', value: values.collectionAddress, onChange, onBlur })
  const deliveryAc = useLocationAutocomplete({ name: 'deliveryAddress', value: values.deliveryAddress, onChange, onBlur })
  const bind = (name) => ({
    id: `quote-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    error: err(name),
  })

  if (status === 'success') {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-success/40 bg-success/5 p-6 text-center sm:p-10"
      >
        <CircleCheck className="mx-auto size-12 text-success" aria-hidden="true" />
        {sentVia === 'whatsapp' ? (
          <>
            <h2 className="mt-4 text-2xl font-bold">Your quote request is ready in WhatsApp</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              We’ve filled in your details. Just press send in WhatsApp and we’ll reply with a quote. If WhatsApp didn’t
              open, use the button below.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton label="Open WhatsApp again" message={summarise(values)} />
              <Button variant="outline" onClick={reset}>Start a new request</Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-2xl font-bold">Thanks{values.name ? `, ${values.name.split(' ')[0]}` : ''}! We’ve got your request.</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              We’ll get back to you on WhatsApp or by phone with a quote. Need it sooner? Message us directly.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <WhatsAppButton label="Chat on WhatsApp too" message={summarise(values)} />
              <Button variant="outline" onClick={reset}>Send another request</Button>
            </div>
          </>
        )}
      </motion.div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-describedby="quote-required-note">
      <p id="quote-required-note" className="text-sm text-muted">All fields are required unless marked optional.</p>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-danger/40 bg-danger/5"
          >
            <div className="flex gap-3 p-4">
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <p className="font-semibold text-danger">
                  {errorCode === 'not-configured'
                    ? 'Our online form isn’t available right now.'
                    : 'Sorry, your request didn’t go through.'}
                </p>
                <p className="mt-1 text-sm text-ink">
                  {errorCode === 'not-configured'
                    ? 'Send the same details on WhatsApp instead. We’ve filled them in for you.'
                    : 'Please try again, or send the same details on WhatsApp. We’ve filled them in for you.'}
                </p>
                <div className="mt-3">
                  <WhatsAppButton label="Send on WhatsApp instead" message={summarise(values)} className="!min-h-11 text-sm" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" autoComplete="name" {...bind('name')} />
        <Field
          label="Contact number"
          hint="WhatsApp or phone."
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="081 234 5678"
          {...bind('phone')}
        />
      </div>

      <Field
        label="Collection store or address"
        hint="For example the store name and branch, or the seller’s address."
        {...bind('collectionAddress')}
        {...collectionAc.inputProps}
        after={collectionAc.listbox}
      />
      <Field
        label="Delivery location"
        hint="Where it’s going. A suburb is fine for a first quote."
        {...bind('deliveryAddress')}
        {...deliveryAc.inputProps}
        after={deliveryAc.listbox}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Item type"
          hint="What are we collecting?"
          placeholder="e.g. fridge, washing machine, 3-seater couch"
          {...bind('items')}
        />
        <Field
          optional
          label="Item dimensions"
          hint="If you know them (width × depth × height)."
          placeholder="e.g. 70 × 70 × 180 cm"
          {...bind('dimensions')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field as="select" label="Preferred delivery date" {...bind('when')}>
          <option value="" disabled>Choose an option</option>
          {WHEN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Field>
        {values.when === 'date' && <Field type="date" label="Date" min={today()} {...bind('date')} />}
      </div>

      <Field
        as="textarea"
        rows={3}
        optional
        label="Anything else we should know?"
        placeholder="Stairs, order number, store collection times…"
        {...bind('notes')}
      />

      {/* Honeypot for bots. Hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="quote-company">Company</label>
        <input id="quote-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={onChange} />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
        {/* First submit button = default for the Enter key. Opens WhatsApp with the details filled in. */}
        <Button type="submit" name="via" value="whatsapp" variant="whatsapp" disabled={submitting} className="shrink-0">
          <WhatsAppIcon />
          Send on WhatsApp
        </Button>
        {isFormConfigured && (
          <Button type="submit" name="via" value="form" variant="outline" disabled={submitting} aria-busy={submitting} className="shrink-0 disabled:cursor-wait disabled:opacity-80">
            {submitting ? (
              <>
                <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-5" aria-hidden="true" />
                Send by form instead
              </>
            )}
          </Button>
        )}
      </div>
      <div>
        <p className="text-sm text-muted">
          We only use these details to quote and arrange your delivery. See our{' '}
          <Link to="/privacy" className="text-link">privacy policy</Link>.
        </p>
      </div>
    </form>
  )
}
