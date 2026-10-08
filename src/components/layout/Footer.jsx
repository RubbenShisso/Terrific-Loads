import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { Container } from '../ui/Section.jsx'
import { business, whatsappLink, telLink } from '../../config/business.js'
import { nav } from '../../config/content.js'

const link = 'inline-flex min-h-10 items-center gap-2 text-white/85 transition-colors hover:text-brand-yellow'

export default function Footer() {
  const { whatsapp, secondaryContact } = business
  return (
    <footer className="bg-brand-black text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo className="h-10" onDark />
          <p className="mt-5 max-w-sm text-white/85">
            Furniture, appliance and bulky-item delivery. Bought something too big for your car? We collect it from the store and deliver it straight to you.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/85">
            <MapPin className="size-4 text-brand-yellow" aria-hidden="true" />
            {business.serviceArea}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Pages</h2>
          <ul className="mt-3">
            {[...nav, { to: '/quote', label: 'Request a Quote' }].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={link}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Get in touch</h2>
          <ul className="mt-3">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>
                <WhatsAppIcon className="size-4 text-brand-yellow" />
                {whatsapp.contactName} · {whatsapp.display}
              </a>
            </li>
            <li>
              <a href={telLink(secondaryContact.number)} className={link}>
                <Phone className="size-4 text-brand-yellow" aria-hidden="true" />
                {secondaryContact.name} · {secondaryContact.display}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 pt-6 pb-28 text-sm sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p className="text-white/75">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <Link to="/privacy" className={link}>Privacy policy</Link>
        </Container>
      </div>
    </footer>
  )
}
