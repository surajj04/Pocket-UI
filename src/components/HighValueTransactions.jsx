import PropTypes from 'prop-types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const HighValueTransactions = ({
  highValueTransactions,
  threshold = 10000
}) => {
  // Process and sort data
  const filteredData = highValueTransactions
    .filter(txn => txn.amount > threshold)
    .sort((a, b) => b.amount - a.amount)

  // Formatters
  const formatCurrency = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)

  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

  // Custom axis tick component
  const CustomAxisTick = ({ x, y, payload }) => {
    const truncatedText =
      payload.value.length > 25
        ? `${payload.value.substring(0, 22)}...`
        : payload.value

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor='end'
          fill='#4b5563'
          transform='rotate(-35)'
          className='text-xs font-medium'
        >
          {truncatedText}
        </text>
      </g>
    )
  }

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-gray-800'>
          High-Value Transactions
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          Showing transactions above {formatCurrency(threshold)}
        </p>
      </div>

      {filteredData.length > 0 ? (
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray='3 3' className='text-gray-100' />

              <XAxis
                dataKey='description'
                tick={<CustomAxisTick />}
                height={80}
                interval={0}
              />

              <YAxis
                tickFormatter={value => `₹${value.toLocaleString('en-IN')}`}
                tick={{ className: 'text-xs text-gray-500' }}
                className='text-gray-500'
              />

              <Tooltip
                content={({ active, payload }) => (
                  <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                    {active && payload && (
                      <>
                        <p className='font-medium text-gray-800 mb-1'>
                          {payload[0]?.payload?.description}
                        </p>
                        <div className='space-y-1'>
                          <p className='text-sm text-gray-600'>
                            Date: {formatDate(payload[0]?.payload?.date)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Amount: {formatCurrency(payload[0]?.value)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Type: {payload[0]?.payload?.type}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              />

              <Bar
                dataKey='amount'
                className='fill-blue-500'
                radius={[4, 4, 0, 0]}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    className='transition-opacity hover:opacity-80'
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className='h-40 flex flex-col items-center justify-center text-center'>
          <div className='text-gray-400 mb-2'>
            <svg
              className='w-12 h-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
          </div>
          <p className='text-gray-500'>
            No transactions above {formatCurrency(threshold)}
          </p>
        </div>
      )}
    </div>
  )
}

HighValueTransactions.propTypes = {
  highValueTransactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['Credit', 'Debit']).isRequired
    })
  ).isRequired,
  threshold: PropTypes.number
}

export default HighValueTransactions
