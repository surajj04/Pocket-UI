import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from 'recharts'

const Summary = ({ credit, debit }) => {
  const netBalance = credit - debit
  const data = [
    { name: 'Credit', amount: credit, fill: '#2e8540' }, // Green
    { name: 'Debit', amount: debit, fill: '#981b1e' }, // Red
    {
      name: 'Net Balance',
      amount: netBalance,
      fill: netBalance >= 0 ? '#005eaa' : '#be5400' // Blue/Orange
    }
  ]

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-gray-800'>
        Financial Overview
      </h2>

      <div className='mb-6 grid grid-cols-3 gap-4 text-center'>
        <div className='bg-green-50 p-3 rounded-lg'>
          <p className='text-sm text-gray-600'>Total Credit</p>
          <p className='text-lg font-bold text-green-600'>
            ₹{credit.toLocaleString()}
          </p>
        </div>
        <div className='bg-red-50 p-3 rounded-lg'>
          <p className='text-sm text-gray-600'>Total Debit</p>
          <p className='text-lg font-bold text-red-600'>
            ₹{debit.toLocaleString()}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}
        >
          <p className='text-sm text-gray-600'>Net Balance</p>
          <p
            className={`text-lg font-bold ${
              netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}
          >
            ₹{netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='name'
            tick={{ fill: '#4b5563' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis hide axisLine={{ stroke: '#e5e7eb' }} />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={value => [`₹${value.toLocaleString()}`, 'Amount']}
          />
          <ReferenceLine y={0} stroke='#6b7280' />

          <Bar
            dataKey='amount'
            radius={[4, 4, 0, 0]}
            fill={({ name }) => data.find(d => d.name === name)?.fill}
          >
            <LabelList
              dataKey='amount'
              position={({ amount }) => (amount >= 0 ? 'top' : 'bottom')}
              formatter={value => `₹${Math.abs(value).toLocaleString()}`}
              fill='#ffffff' // set label color to white
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Summary
