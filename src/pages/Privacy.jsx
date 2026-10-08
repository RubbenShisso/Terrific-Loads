import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import { Section } from '../components/ui/Section.jsx'
import { business } from '../config/business.js'

const UPDATED = '8 October 2026'

export default function Privacy() {
  usePageMeta('privacy')
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" intro={`Last updated ${UPDATED}.`} />
      <Section>
        <div className="max-w-3xl space-y-8 text-muted [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-black [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <div>
            <p className="!mt-0">
              {business.name} respects your privacy. This policy explains what personal information we collect through this website, why we collect it and how we look after it, in line with South Africa’s Protection of Personal Information Act (POPIA).
            </p>
          </div>
          <div>
            <h2>What we collect</h2>
            <p>When you request a quote or message us, we may collect:</p>
            <ul>
              <li>your name and WhatsApp or phone number</li>
              <li>collection and delivery addresses</li>
              <li>details of the items to be delivered and when you need them</li>
              <li>anything else you choose to tell us</li>
            </ul>
          </div>
          <div>
            <h2>How we use it</h2>
            <p>
              We use your information only to give you a quote, arrange and carry out your delivery, and contact you about it. We don’t sell your information or use it for unrelated marketing.
            </p>
          </div>
          <div>
            <h2>Who we share it with</h2>
            <p>
              Quote requests are sent to us on WhatsApp, which is run by Meta, or through a third-party form service if you choose that option. We share delivery details with a store or seller only when needed to collect your items.
            </p>
          </div>
          <div>
            <h2>How long we keep it</h2>
            <p>We keep your information only for as long as we need it to provide the service and meet any legal requirements.</p>
          </div>
          <div>
            <h2>Your rights</h2>
            <p>
              You can ask us to see, correct or delete the personal information we hold about you, or object to how we use it. Contact us on WhatsApp to make a request. You may also lodge a complaint with the Information Regulator of South Africa.
            </p>
          </div>
          <div>
            <h2>Cookies</h2>
            <p>This website does not use advertising or tracking cookies.</p>
          </div>
        </div>
      </Section>
    </>
  )
}
