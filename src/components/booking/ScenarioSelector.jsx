import { ArrowRight } from 'lucide-react'
import { IconBadge } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { scenarios } from '../../config/scenarios.js'
import { useQuickBookProps } from './BookingProvider.jsx'

/** Homepage entry cards: each opens the same booking flow with its scenario. */
export function ScenarioCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {scenarios.map((s, i) => (
        <Reveal as="li" key={s.id} delay={(i % 4) * 0.05}>
          <ScenarioCard scenario={s} />
        </Reveal>
      ))}
    </ul>
  )
}

function ScenarioCard({ scenario }) {
  const props = useQuickBookProps({ scenario: scenario.id })
  return (
    <button
      {...props}
      className="group flex h-full w-full flex-col items-start rounded-2xl border-2 border-line bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg hover:shadow-brand-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <IconBadge icon={scenario.icon} />
      <span className="mt-4 text-lg font-semibold text-brand-black">{scenario.label}</span>
      <span className="mt-1 flex-1 text-muted">{scenario.text}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-black underline decoration-brand-yellow decoration-[3px] underline-offset-4">
        Quick Book
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  )
}

/** Inside the booking flow: change the scenario. */
export default function ScenarioSelect({ value, onChange }) {
  return (
    <fieldset>
      <legend className="font-semibold text-brand-black">What do you need help with?</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <label key={s.id} className="chip">
            <input type="radio" name="scenario" className="sr-only" value={s.id} checked={value === s.id} onChange={() => onChange(s.id)} />
            <s.icon className="size-4" aria-hidden="true" />
            {s.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
