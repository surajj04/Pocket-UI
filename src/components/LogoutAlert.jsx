import { useState, useEffect } from 'react'
import { X, LogOut, AlertTriangle } from 'lucide-react'

const LogoutConfirmationAlert = ({ onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onCancel && onCancel()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onCancel])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleConfirm = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onConfirm && onConfirm()
    }, 300)
  }

  return (
    <>
      {isVisible && (
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        />
      )}

      {isVisible && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-96 rounded-2xl shadow-xl bg-white z-50 transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className='p-6 pb-4'>
            <div className='flex justify-between items-start'>
              <div className='flex items-start'>
                <div className='bg-amber-100 p-3 rounded-full mr-4'>
                  <AlertTriangle className='h-6 w-6 text-amber-600' />
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    Confirm Logout
                  </h3>
                  <p className='mt-1 text-gray-600'>
                    Are you sure you want to sign out?
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          <div className='px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3'>
            <button
              onClick={handleClose}
              className='px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className='px-5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center'
            >
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default LogoutConfirmationAlert
