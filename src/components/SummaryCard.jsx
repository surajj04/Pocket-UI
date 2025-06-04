import React from 'react'

function SummaryCard ({ title, amount, subtitle, icon, percentage }) {
  return (
    <div className='bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex-shrink-0'>
          <div className='flex items-center space-x-3'>
            {icon}
            <span className='text-2xl sm:text-3xl leading-none font-bold text-gray-900'>
              {title}
            </span>
          </div>
          <div className='my-3'>
            <h3 className='text-2xl text-gray-900 font-bold'>{amount}</h3>
            <small className='text-gray-600'>{subtitle}</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
