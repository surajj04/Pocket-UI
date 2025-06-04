'use client'

import { useState } from 'react'

const RefundsAndFailed = ({ refundFaileds }) => {
  const [activeTab, setActiveTab] = useState('refunds')

  // Filter refunds and failed transactions from provided data
  const refunds = refundFaileds?.filter(item => item.type === 'refund') || []
  const failed = refundFaileds?.filter(item => item.type === 'failed') || []

  const activeList = activeTab === 'refunds' ? refunds : failed

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-gray-700'>
        Refunds & Failed Transactions
      </h2>

      {/* Tabs */}
      <div className='flex mb-4'>
        <button
          className={`px-4 py-2 ${
            activeTab === 'refunds'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-l-md`}
          onClick={() => setActiveTab('refunds')}
        >
          Refunds
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'failed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-r-md`}
          onClick={() => setActiveTab('failed')}
        >
          Failed
        </button>
      </div>

      {/* Transactions List */}
      {activeList.length > 0 ? (
        <ul className='space-y-2'>
          {activeList.map((item, index) => (
            <li key={index} className='flex justify-between items-center'>
              <span>{item.name}</span>
              <span
                className={`font-semibold ${
                  activeTab === 'refunds' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {activeTab === 'refunds' ? '+' : '-'}₹{item.amount}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-500'>No {activeTab} transactions available.</p>
      )}
    </div>
  )
}

export default RefundsAndFailed
