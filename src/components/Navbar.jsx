import { LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../store/userSlice'
import LogoutConfirmationAlert from './LogoutAlert'

function Navbar ({ navItems }) {
  const pathname = useLocation().pathname

  const dispatch = useDispatch()

  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    setShowLogout(true)
  }

  return (
    <>
      {showLogout && <LogoutConfirmationAlert />}

      <div>
        <nav className='w-64 bg-white shadow-lg p-4 hidden md:block h-screen'>
          <h1 className='text-2xl font-bold text-violet-600 mb-8'>
            Pocket Expense
          </h1>
          <ul className='space-y-2 font-medium'>
            {navItems.map(item => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                onClick={handleLogout}
                className='flex items-center w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 '
              >
                <LogOut className='mr-3 h-5 w-5' />
                Logout
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Navigation for Mobile */}
        <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50'>
          <ul className='flex overflow-x-auto font-medium justify-around p-3 space-x-4'>
            {navItems.map(item => (
              <li key={item.href} className='flex-1 min-w-[70px]'>
                <Link
                  to={item.href}
                  className='flex flex-col items-center p-2 text-center text-gray-600 hover:text-blue-600'
                >
                  <item.icon className='h-6 w-6 mb-1' />
                  <span className='text-xs'>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className='flex flex-col items-center p-2 text-center text-gray-600 hover:text-blue-600'
              >
                <LogOut className='h-6 w-6 mb-1' />
                <span className='text-xs'>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navbar
