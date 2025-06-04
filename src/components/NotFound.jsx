import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-9xl font-extrabold text-gray-800'>404</h1>
        <p className='text-2xl font-medium text-gray-600 mt-4'>
          Oops! Page not found.
        </p>
        <p className='text-gray-500 mt-2'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to='/'
          className='mt-6 inline-block px-6 py-3 text-white text-lg font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300'
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
