import { useState } from 'react'

const ErrorAlert = ({ message1, message2 }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-96 rounded-lg shadow-lg transition-all ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='bg-red-500 text-white p-4 rounded-lg flex items-center justify-between'>
        <div>
          <p className='font-semibold'>{message1}</p>
          <p className='text-sm'>{message2}</p>
        </div>
        <button
          onClick={handleClose}
          className='ml-4 text-xl font-bold text-white hover:text-gray-300'
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default ErrorAlert
