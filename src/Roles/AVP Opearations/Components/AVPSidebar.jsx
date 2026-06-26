/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRole, selectRegion } from '../../../Auth/authSlice'

// Derive base path from role so AVP-Operations uses /dashboard/avp-operations/* instead of /dashboard/line-manager/*
const BASE_PATH_BY_ROLE = {
  'line-manager':   '/dashboard/line-manager',
  'avp-operations':  '/dashboard/avp-operations',
}

const AVPSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const role = useSelector(selectRole)
  const region = useSelector(selectRegion)
  const base = BASE_PATH_BY_ROLE[role] || '/dashboard/avp-operations'
  const roleLabel = role === 'avp-operations' ? 'AVP Operations' : 'Line Manager'
  
  const formatRegion = (reg) => {
    if (!reg) return ''
    if (Array.isArray(reg)) {
      return reg.map(r => `${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()}`).join(' & ') + ' Region'
    }
    return `${reg.charAt(0).toUpperCase()}${reg.slice(1).toLowerCase()} Region`
  }
  const regionLabel = formatRegion(region)

  const links = [
    { to: base,                                         label: 'Dashboard' },
    { to: `${base}/advance-request`,                    label: 'Advance Request' },
    { to: `${base}/advance-approval`,                   label: 'Employee Advance Approval' },
    { to: `${base}/advance-settelment`,                 label: 'Settlement Approvals' },
    { to: `${base}/submit-advance-settlement`,          label: 'Submit Advance Settlement' },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-48 bg-green-700 text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform lg:translate-x-0 lg:w-48 lg:block`}
      >
        <div className="p-4 bg-green-800 text-center">
          <p className="text-base font-semibold">{roleLabel}</p>
          {regionLabel && <p className="text-xs text-green-200 mt-0.5">{regionLabel}</p>}
        </div>

        <ul className="mt-6">
          {links.map(({ to, label }, i) => (
            <li key={i}>
              <NavLink
                to={to}
                end={to === base}
                className={({ isActive }) =>
                  `block px-6 py-2 text-sm cursor-pointer hover:bg-green-600 transition ${
                    isActive ? 'bg-green-600 font-semibold' : ''
                  }`
                }
              >
                {label}
              </NavLink>
              <hr className="border-white mx-4" />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default AVPSidebar
