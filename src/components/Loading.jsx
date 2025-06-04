import React from 'react'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
      <p className='mt-4 text-lg font-semibold text-gray-600'>{message}</p>
    </div>
  )
}

export default Loading
