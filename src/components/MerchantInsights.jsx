import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts'
import { debounce } from 'lodash'

// Color palette with better contrast
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#64748B' // Slate
]

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-100'>
        <p className='font-medium text-gray-800 mb-1'>
          {payload[0].payload.name}
        </p>
        <p className='text-sm'>
          <span className='text-gray-600'>Total Spent: </span>
          <span className='font-semibold text-blue-600'>
            ₹
            {payload[0].value.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </p>
      </div>
    )
  }
  return null
}

// Currency formatters
const formatCurrency = value => {
  if (!value) return '₹0'
  return value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : `₹${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
}

const MerchantInsights = ({ merchantInsights }) => {
  const [search, setSearch] = useState('')
  const [hoveredBar, setHoveredBar] = useState(null)

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce(value => {
      setSearch(value)
    }, 300),
    []
  )

  // Memoized data processing
  const { formattedData, totalAmount } = useMemo(() => {
    if (!merchantInsights?.length) return { formattedData: [], totalAmount: 0 }

    const processed = merchantInsights
      .map(item => ({
        name: item.merchant || 'Unknown Merchant',
        amount: Number(item.totalSpent) || 0,
        id: Math.random().toString(36).substr(2, 9) // Unique ID for each entry
      }))
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.amount - a.amount)

    const total = processed.reduce((sum, item) => sum + item.amount, 0)
    return { formattedData: processed, totalAmount: total }
  }, [merchantInsights, search])

  // Dynamic height calculation
  const chartHeight = useMemo(() => {
    const baseHeight = 150
    const itemHeight = 40
    return Math.min(600, baseHeight + formattedData.length * itemHeight)
  }, [formattedData.length])

  // Empty states
  if (!merchantInsights) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md text-center animate-pulse'>
        <div className='h-6 bg-gray-200 rounded w-1/2 mb-4 mx-auto' />
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto' />
        <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto' />
      </div>
    )
  }

  if (!formattedData.length) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md text-center'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
          Merchant Spending Insights
        </h2>
        <p className='text-gray-500'>
          {search ? `No results for "${search}"` : 'No spending data available'}
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white p-4 md:p-6 rounded-lg shadow-md'>
      <div className='mb-6 space-y-4'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Merchant Spending Insights
          <span className='block text-sm font-normal text-gray-500 mt-1'>
            Total: ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </h2>

        <input
          type='text'
          placeholder='Search merchants...'
          className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
          onChange={e => handleSearchChange(e.target.value)}
          aria-label='Search merchants'
        />
      </div>

      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={formattedData}
            layout='vertical'
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />

            <XAxis
              type='number'
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />

            <YAxis
              dataKey='name'
              type='category'
              width={200}
              tick={{ fontSize: 12, fill: '#374151' }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />

            <Bar
              dataKey='amount'
              barSize={24}
              onMouseEnter={data => setHoveredBar(data.id)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={COLORS[index % COLORS.length]}
                  opacity={hoveredBar && hoveredBar !== entry.id ? 0.3 : 1}
                  strokeWidth={1}
                  stroke='#fff'
                  radius={[0, 4, 4, 0]}
                />
              ))}

              <LabelList
                dataKey='amount'
                position='right'
                formatter={formatCurrency}
                style={{
                  fontSize: 12,
                  fill: '#374151',
                  fontWeight: 500
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-6 flex flex-wrap gap-3 justify-center'>
        {formattedData.map((item, index) => (
          <div
            key={item.id}
            className='flex items-center px-3 py-1 bg-gray-50 rounded-full'
          >
            <span
              className='w-3 h-3 rounded-full mr-2'
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className='text-sm text-gray-700'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

MerchantInsights.propTypes = {
  merchantInsights: PropTypes.arrayOf(
    PropTypes.shape({
      merchant: PropTypes.string.isRequired,
      totalSpent: PropTypes.number.isRequired
    })
  ).isRequired
}

export default React.memo(MerchantInsights)
