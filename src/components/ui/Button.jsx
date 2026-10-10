import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import useMagnetic from '../../hooks/useMagnetic.js'
import { whatsappLink } from '../../config/business.js'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-base font-semibold transition-[translate,scale,background-color,border-color,filter,box-shadow] duration-200 hover:-translate-y-px active:scale-[0.97]'

const variants = {
  // WhatsApp green with black text (white on this green fails contrast).
  whatsapp: 'bg-whatsapp text-brand-black shadow-sm hover:brightness-95',
  // Black with yellow text: the "Request a Quote" button on light sections.
  dark: 'bg-brand-black text-brand-yellow hover:bg-ink',
  // Yellow with black text: "Request a Quote" on black sections.
  yellow: 'bg-brand-yellow text-brand-black hover:brightness-95',
  // Plain white button with a border.
  outline: 'border border-line bg-white text-brand-black hover:border-brand-black',
}

export function Button({ to, href, variant = 'dark', magnetic = false, className = '', children, ...props }) {
  const ref = useMagnetic(magnetic)
  const cls = `${base} ${variants[variant]} ${className}`
  if (to) return <Link ref={ref} to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a ref={ref} href={href} className={cls} {...props}>{children}</a>
  return <button ref={ref} className={cls} {...props}>{children}</button>
}

export function WhatsAppButton({ label = 'Get a Delivery Quote on WhatsApp', message, magnetic = false, className = '' }) {
  return (
    <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp" magnetic={magnetic} className={className}>
      <WhatsAppIcon />
      {label}
    </Button>
  )
}

export function QuoteButton({ label = 'Request a Quote', variant = 'dark', className = '' }) {
  return (
    <Button to="/quote" variant={variant} className={className}>
      <FileText className="size-5" aria-hidden="true" />
      {label}
    </Button>
  )
}
