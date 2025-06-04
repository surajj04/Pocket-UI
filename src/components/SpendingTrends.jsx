import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

const SpendingTrends = ({ dailyTrends }) => {
<<<<<<< HEAD
  // Convert dailyTrends object into an array for recharts
=======
  // Convert dailyTrends object into chart data array
>>>>>>> dafafa2 (updated code)
  const data = Object.keys(dailyTrends).map(day => ({
    name: day.substring(0, 3),
    transactions: dailyTrends[day].totalTransactions
  }))

  // Calculate metrics
  const totalTransactions = data.reduce((sum, day) => sum + day.transactions, 0)
  const dailyAverage = totalTransactions / data.length
  const maxTransactionsDay = data.reduce(
    (max, day) => (day.transactions > max.transactions ? day : max),
    { name: '', transactions: 0 }
  )

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold text-gray-700 mb-2'>
          Weekly Transaction Patterns
        </h2>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-gray-600'>Daily Average</p>
            <p className='text-lg font-bold text-blue-600'>
              {Math.round(dailyAverage.toFixed(1))} transactions
            </p>
          </div>
          <div className='bg-purple-50 p-3 rounded-lg'>
            <p className='text-gray-600'>Most Active Day</p>
            <p className='text-lg font-bold text-purple-600'>
              {maxTransactionsDay.name || 'N/A'}
              <span className='ml-2 text-sm'>
                ({maxTransactionsDay.transactions} transactions)
              </span>
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='colorTransactions' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#4F46E5' stopOpacity={0.2} />
              <stop offset='95%' stopColor='#4F46E5' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='name'
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tickFormatter={value => Math.round(value)}
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            formatter={value => [`${value} transactions`, 'Daily Transactions']}
          />
          <ReferenceLine
            y={dailyAverage}
            stroke='#4F46E5'
            strokeDasharray='3 3'
            label={{
              value: `Average (${Math.round(dailyAverage.toFixed(1))})`,
              position: 'insideTopRight',
              fill: '#4F46E5',
              fontSize: 12
            }}
          />
          <Area
            type='monotone'
            dataKey='transactions'
            stroke='#4F46E5'
            strokeWidth={2}
            fill='url(#colorTransactions)'
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className='mt-4 text-sm text-gray-600'>
        <p>• Hover over the chart to see daily transaction counts</p>
        <p>• Dashed line shows weekly average transaction frequency</p>
      </div>
    </div>
  )
}

export default SpendingTrends
