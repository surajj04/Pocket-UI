import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const MonthlyExpenses = ({ expenses }) => {
  const categoryColors = {
    food: '#8884d8',
    shopping: '#82ca9d',
    travel: '#ff7300',
    bills: '#ffc658',
    entertainment: '#00C49F',
    medical: '#ff1493',
    personal: '#9932cc',
    other: '#FF8042'
  }

  const formattedData = expenses.map(item => ({
    month: item.month.substring(0, 3),
    ...item
  }))

  const categories = Object.keys(categoryColors)

  const categoryTotals = {}
  const monthlyTotals = formattedData.map(monthData =>
    categories.reduce((sum, category) => sum + (monthData[category] || 0), 0)
  )

  categories.forEach(category => {
    categoryTotals[category] = formattedData.reduce(
      (sum, monthData) => sum + (monthData[category] || 0),
      0
    )
  })

  const overallTotal = monthlyTotals.reduce((sum, total) => sum + total, 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className='bg-white p-3 shadow-md rounded-lg border text-sm'>
          <h3 className='font-semibold mb-2'>{label}</h3>
          <div className='grid grid-cols-2 gap-2'>
            {payload.map(entry => (
              <div key={entry.name} className='flex items-center gap-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: entry.color }}
                />
                <span className='capitalize'>{entry.name}:</span>
                <span>₹{(entry.value || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-gray-700'>
        Monthly Expense Breakdown (₹)
      </h2>

      {/* Line Chart */}
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis
            dataKey='month'
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <YAxis
            tickFormatter={value => `₹${value.toLocaleString('en-IN')}`}
            tick={{ fill: '#666' }}
            axisLine={{ stroke: '#ccc' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={value => (
              <span className='text-sm text-gray-600 capitalize'>{value}</span>
            )}
          />
          {Object.entries(categoryColors).map(([category, color]) => (
            <Line
              key={category}
              type='monotone'
              dataKey={category}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Expense Table */}
      <div className='mt-8 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr>
              <th className='text-left py-3 px-4 border-b bg-gray-50'>
                Category
              </th>
              {formattedData.map(month => (
                <th
                  key={month.month}
                  className='text-right py-3 px-4 border-b bg-gray-50'
                >
                  {month.month}
                </th>
              ))}
              <th className='text-right py-3 px-4 border-b bg-gray-50'>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category}>
                <td className='py-2 px-4 border-b capitalize font-medium text-gray-700'>
                  {category}
                </td>
                {formattedData.map(monthData => (
                  <td
                    key={`${category}-${monthData.month}`}
                    className='text-right py-2 px-4 border-b'
                  >
                    ₹{(monthData[category] || 0).toLocaleString('en-IN')}
                  </td>
                ))}
                <td className='text-right py-2 px-4 border-b font-medium'>
                  ₹{categoryTotals[category].toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            <tr>
              <td className='py-2 px-4 border-b font-semibold text-gray-800'>
                Total
              </td>
              {monthlyTotals.map((total, idx) => (
                <td
                  key={`total-${idx}`}
                  className='text-right py-2 px-4 border-b font-semibold'
                >
                  ₹{total.toLocaleString('en-IN')}
                </td>
              ))}
              <td className='text-right py-2 px-4 border-b font-semibold'>
                ₹{overallTotal.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MonthlyExpenses
