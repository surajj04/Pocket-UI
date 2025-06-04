import { useState } from 'react'

const InvalidCredentialsAlert = ({ message1, message2 }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-lg  p-4 mb-4 text-sm text-red-700 transition-all ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role='alert'
    >
      <div className='bg-red-100 rounded-lg flex items-center justify-between p-4'>
        <svg
          className='w-5 h-5 inline mr-3'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            clipRule='evenodd'
          />
        </svg>
        <div>
          <span className='font-medium'>{message1}!</span> {message2}
        </div>
        <button
          onClick={handleClose}
          className='ml-4 text-xl font-bold text-red-700 hover:text-red-500'
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default InvalidCredentialsAlert
