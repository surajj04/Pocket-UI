import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/userSlice'

const LogoutConfirmationAlert = ({ onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(true)

  const dispatch = useDispatch()

  const handleClose = () => {
    setIsVisible(false)
    onCancel && onCancel()
  }

  const handleConfirm = () => {
    setIsVisible(false)
    dispatch(logout())
    onConfirm && onConfirm()
  }

  return (
    <>
      {/* Overlay with blur effect */}
      {isVisible && (
        <div className='fixed inset-0 bg-gray bg-opacity-40 backdrop-blur-sm z-40'></div>
      )}

      {/* Main alert */}
      <div
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg transition-all ${
          isVisible ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className='bg-gray-100 text-gray-800 p-6 rounded-lg flex flex-col items-center justify-center'>
          <div className='mb-4 text-center'>
            <p className='font-medium text-lg'>Do you really want to logout?</p>
          </div>
          <div className='flex space-x-4'>
            <button
              onClick={handleConfirm}
              className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none'
            >
              Yes, Logout
            </button>
            <button
              onClick={handleClose}
              className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogoutConfirmationAlert
