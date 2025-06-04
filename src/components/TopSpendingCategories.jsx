import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#64748B', // Slate
  '#3B82F6', // Blue
  '#F472B6', // Pink
  '#10A5D6', // Cyan
  '#84CC16' // Lime
]

const TopSpendingCategories = React.memo(({ topSpendings }) => {
  const { formattedData, totalSpent } = useMemo(() => {
    if (!topSpendings || topSpendings.length === 0)
      return { formattedData: [], totalSpent: 0 }

    // Validate and format amounts
    const validatedData = topSpendings.map(item => ({
      ...item,
      amount: Number(item.amount) || 0
    }))

    const sorted = [...validatedData].sort((a, b) => b.amount - a.amount)
    const total = sorted.reduce((sum, item) => sum + item.amount, 0)

    return {
      formattedData: sorted.map(item => ({
        ...item,
        value: item.amount,
        percent: total > 0 ? (item.amount / total) * 100 : 0
      })),
      totalSpent: total
    }
  }, [topSpendings])

  const renderLabel = ({ percent, category, x, y }) => {
    return (
      <text
        x={x}
        y={y}
        fill='#374151'
        textAnchor='middle'
        dominantBaseline='central'
        className='text-xs font-semibold'
      >
        {percent > 1 ? `${category}\n${percent.toFixed(0)}%` : ''}
      </text>
    )
  }

  if (formattedData.length === 0) {
    return (
      <div className='bg-white p-4 md:p-6 rounded-lg shadow-md'>
        <p className='text-gray-500 text-center p-4'>
          No spending data available
        </p>
      </div>
    )
  }

  return (
    <div className='bg-white p-4 md:p-6 rounded-lg shadow-md'>
      <div className='mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
        <h2 className='text-base md:text-lg lg:text-xl font-semibold text-gray-700'>
          Top Spending Categories
        </h2>
        <div className='text-xs sm:text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md'>
          Total Spent: ₹
          {totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <div className='w-full mx-auto'>
          <ResponsiveContainer width='100%' height={500}>
            <PieChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
              <Pie
                data={formattedData}
                dataKey='value'
                cx='50%'
                cy='50%'
                outerRadius={160}
                innerRadius={80}
                paddingAngle={1}
                label={renderLabel}
                labelLine={false}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke='#FFF'
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const data = payload[0].payload
                  return (
                    <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-100'>
                      <p className='font-medium text-gray-800 mb-2'>
                        {data.category}
                      </p>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div className='text-gray-600'>Amount:</div>
                        <div className='text-right font-medium'>
                          ₹{data.value.toLocaleString('en-IN')}
                        </div>
                        <div className='text-gray-600'>Percentage:</div>
                        <div className='text-right'>
                          {data.percent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='w-full'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-gray-500 border-b'>
                  <th className='pb-2 pr-4'>Category</th>
                  <th className='pb-2 text-right pr-4'>Amount</th>
                  <th className='pb-2 text-right'>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {formattedData.map((item, index) => (
                  <tr
                    key={item.category}
                    className='border-b last:border-b-0 hover:bg-gray-50'
                  >
                    <td className='py-2 pr-4'>
                      <div className='flex items-center'>
                        <div
                          className='w-3 h-3 rounded-full mr-2'
                          style={{
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                        <span className='font-medium'>{item.category}</span>
                      </div>
                    </td>
                    <td className='py-2 text-right pr-4'>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className='py-2 text-right text-gray-600'>
                      {item.percent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <div className='mt-4 text-xs text-gray-500 text-center'>
        <p>* Percentages calculated from total spent amount</p>
        <p className='mt-1'>Hover slices for details, tap on mobile</p>
      </div> */}
    </div>
  )
})

TopSpendingCategories.propTypes = {
  topSpendings: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired
    })
  )
}

TopSpendingCategories.defaultProps = {
  topSpendings: []
}

export default TopSpendingCategories
