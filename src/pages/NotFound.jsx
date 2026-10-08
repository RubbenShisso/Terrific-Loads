import { useEffect } from 'react'
import usePageMeta from '../hooks/usePageMeta.js'
import { Container } from '../components/ui/Section.jsx'
import { Button, WhatsAppButton } from '../components/ui/Button.jsx'

export default function NotFound() {
  usePageMeta('notFound')

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-black"><span className="highlight">404</span></p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">This page went missing in transit</h1>
      <p className="mt-3 max-w-md text-lg text-muted">The page you’re looking for doesn’t exist. Your delivery, on the other hand, we can sort out.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button to="/" variant="outline">Back to home</Button>
        <WhatsAppButton />
      </div>
    </Container>
  )
}
