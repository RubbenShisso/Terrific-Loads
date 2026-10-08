import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

/**
 * The client's Terrific Loads logo (transparent PNG, black and yellow artwork).
 * It is designed for light backgrounds. On black surfaces, `onDark` places it
 * on a white plate so the black lettering stays visible. Never recolour or stretch it.
 */
export default function Logo({ className = 'h-8 sm:h-9 lg:h-8 xl:h-11', onDark = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Terrific Loads home"
      className={`inline-block shrink-0 rounded-lg ${onDark ? 'bg-white px-4 py-3' : ''}`}
    >
      <img src={logo} alt="Terrific Loads" width="1000" height="176" className={`w-auto ${className}`} />
    </Link>
  )
}
