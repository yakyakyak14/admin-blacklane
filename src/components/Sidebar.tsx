import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/cars', label: 'Cars' },
  { to: '/users', label: 'Users' },
  { to: '/jets', label: 'Jets' },
  { to: '/jet-bookings', label: 'Jet Bookings' },
  { to: '/jet-images', label: 'Jet Images' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/trips', label: 'Trips' },
  { to: '/payouts', label: 'Payouts' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/support', label: 'Support' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <div className="w-64 h-screen sticky top-0 p-4 space-y-2">
      <div className="px-2 py-3 text-lg font-bold">Blacklane Admin</div>
      <nav className="space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`
            }
            end={l.to === '/'}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
