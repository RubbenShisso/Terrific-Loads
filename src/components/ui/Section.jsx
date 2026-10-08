export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export function Section({ id, className = '', children, ...props }) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`} {...props}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, intro, align = 'left', dark = false, id }) {
  const center = align === 'center' ? 'mx-auto text-center' : ''
  return (
    <div className={`max-w-2xl ${center}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className={`mt-3 text-3xl font-bold sm:text-4xl ${dark ? 'text-white' : ''}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${dark ? 'text-white/80' : 'text-muted'}`}>{intro}</p>}
    </div>
  )
}

/** Black icon on a yellow circle: the brand icon badge. */
export function IconBadge({ icon: Icon, size = 'md' }) {
  const s = size === 'lg' ? 'size-12 [&>svg]:size-6' : 'size-11 [&>svg]:size-5'
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-black ${s}`}>
      <Icon aria-hidden="true" />
    </span>
  )
}
