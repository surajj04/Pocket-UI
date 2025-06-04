import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList
} from 'recharts'
import { useSelector } from 'react-redux'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { format } from 'date-fns'

const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316' // Orange
]

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

// Custom label for pie chart
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='text-xs font-medium'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ReportsPage () {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const user = useSelector(state => state.user.user) || {}

  // Processed Data
  const budgets = user?.budgets || []
  const expenses = user?.expenses || []

  // Year Filtering
  const filteredBudgets = budgets.filter(
    b => new Date(b.date).getFullYear() === selectedYear
  )
  const filteredExpenses = expenses.filter(
    e => new Date(e.date).getFullYear() === selectedYear
  )

  // Key Metrics
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = filteredBudgets.reduce(
    (sum, b) => sum + b.monthlyBudget,
    0
  )
  const remainingBudget = totalBudget - totalSpent
  const avgDailySpend = (totalSpent / 365).toFixed(2)
  const budgetUtilization =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  // Monthly Comparison Data
  const monthlyComparison = MONTHS.map((month, idx) => {
    const budget = filteredBudgets.find(
      b => new Date(b.date).getMonth() === idx
    )
    const monthlyExpenses = filteredExpenses
      .filter(e => new Date(e.date).getMonth() === idx)
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      month,
      budget: budget?.monthlyBudget || 0,
      spent: monthlyExpenses,
      remaining: (budget?.monthlyBudget || 0) - monthlyExpenses
    }
  })

  // Category Analysis
  const categorySpending = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const categoryData = Object.entries(categorySpending)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Payment Method Analysis
  const paymentMethods = filteredExpenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + 1
    return acc
  }, {})

  const paymentMethodData = Object.entries(paymentMethods).map(
    ([method, count]) => ({ method, count })
  )

  // Recent Transactions
  const recentTransactions = [...filteredExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const availableYears = Array.from(
    new Set([
      ...(user?.budgets?.map(item => new Date(item.date).getFullYear()) || []),
      ...(user?.expenses?.map(item => new Date(item.date).getFullYear()) || [])
    ])
  ).sort((a, b) => b - a)

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-4 border border-gray-200 shadow-lg rounded-md'>
          <p className='font-bold text-gray-800'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-5 gap-4'>
        <h1 className='text-3xl md:text-4xl font-bold text-indigo-900'>
          Financial Reports
        </h1>

        {/* Year Selector */}
        <div className='flex items-center gap-3 bg-white p-2 rounded-lg border border-indigo-100 shadow-sm'>
          <label className='font-semibold text-gray-700'>Year:</label>
          <select
            className='p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4'>
        <TabsList className='bg-indigo-50 p-1 rounded-lg'>
          <TabsTrigger
            value='overview'
            className='data-[state=active]:bg-indigo-500 data-[state=active]:text-white px-4 py-2 rounded-md transition-all'
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value='monthly'
            className='data-[state=active]:bg-indigo-500 data-[state=active]:text-white px-4 py-2 rounded-md transition-all'
          >
            Monthly Analysis
          </TabsTrigger>
          <TabsTrigger
            value='category'
            className='data-[state=active]:bg-indigo-500 data-[state=active]:text-white px-4 py-2 rounded-md transition-all'
          >
            Category Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6'>
            <Card className='bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm text-gray-600 flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-indigo-500'></div>
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900'>
                  ₹{totalSpent.toLocaleString()}
                </div>
                <div className='text-sm text-gray-500 mt-1'>
                  of ₹{totalBudget.toLocaleString()} budget
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm text-gray-600 flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
                  Remaining Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900'>
                  ₹{remainingBudget.toLocaleString()}
                </div>
                <div className='mt-3'>
                  <Progress
                    value={budgetUtilization}
                    indicatorColor={
                      budgetUtilization > 90
                        ? 'bg-red-500'
                        : budgetUtilization > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }
                    className='h-3'
                  />
                  <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>0%</span>
                    <span>{Math.round(budgetUtilization)}% utilized</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm text-gray-600 flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                  Avg Daily Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900'>
                  ₹{avgDailySpend}
                </div>
                <div className='text-sm text-gray-500 mt-1'>
                  per day in {selectedYear}
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-violet-50 to-white border-violet-100 shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm text-gray-600 flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-violet-500'></div>
                  Top Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <>
                    <div className='text-2xl font-bold text-gray-900'>
                      {categoryData[0].name}
                    </div>
                    <div className='text-lg text-gray-700'>
                      ₹{categoryData[0].value.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div className='text-gray-500'>No spending data</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                  <span>Spending Distribution</span>
                  <Badge
                    variant='outline'
                    className='border-indigo-300 text-indigo-600'
                  >
                    {selectedYear}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      innerRadius={70}
                      fill='#8884d8'
                      dataKey='value'
                      nameKey='name'
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout='vertical'
                      verticalAlign='middle'
                      align='right'
                      formatter={(value, entry, index) => (
                        <span className='text-gray-700 text-sm'>
                          {value} - ₹
                          {categoryData[index].value.toLocaleString()}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                  <span>Recent Transactions</span>
                  <Badge
                    variant='outline'
                    className='border-emerald-300 text-emerald-600'
                  >
                    Latest
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map(transaction => (
                      <div
                        key={transaction.expenseId}
                        className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-800`}
                          >
                            <span className='font-bold'>
                              {transaction.category.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>
                              {transaction.category}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {transaction.description || 'No description'}
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-bold text-gray-900'>
                            ₹{transaction.amount}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-10 text-gray-500'>
                      No recent transactions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly Analysis Tab */}
        <TabsContent value='monthly'>
          <div className='grid grid-cols-1 gap-6'>
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                  <span>Budget vs Actual Spending</span>
                  <Badge
                    variant='outline'
                    className='border-indigo-300 text-indigo-600'
                  >
                    {selectedYear}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={400}>
                  <BarChart data={monthlyComparison}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey='budget'
                      name='Monthly Budget'
                      fill='#4F46E5'
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList
                        dataKey='budget'
                        position='top'
                        formatter={value => `₹${value.toLocaleString()}`}
                        className='text-xs fill-gray-600'
                      />
                    </Bar>
                    <Bar
                      dataKey='spent'
                      name='Actual Spending'
                      fill='#10B981'
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList
                        dataKey='spent'
                        position='top'
                        formatter={value => `₹${value.toLocaleString()}`}
                        className='text-xs fill-gray-600'
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card className='border-0 shadow-lg'>
                <CardHeader>
                  <CardTitle>Remaining Budget by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={monthlyComparison}>
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey='remaining'
                        name='Remaining Budget'
                        fill='#8B5CF6'
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey='remaining'
                          position='top'
                          formatter={value => `₹${value.toLocaleString()}`}
                          className='text-xs fill-gray-600'
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='border-0 shadow-lg'>
                <CardHeader>
                  <CardTitle>Payment Methods Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={paymentMethodData}>
                      <XAxis dataKey='method' />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey='count' fill='#F59E0B' radius={[4, 4, 0, 0]}>
                        <LabelList
                          dataKey='count'
                          position='top'
                          className='text-xs fill-gray-600'
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Category Insights Tab */}
        <TabsContent value='category'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle>Category-wise Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-5'>
                  {categoryData.map(({ name, value }, index) => (
                    <div key={name} className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                          <span className='font-medium text-gray-800'>
                            {name}
                          </span>
                        </div>
                        <span className='font-semibold text-gray-900'>
                          ₹{value.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(value / totalSpent) * 100}
                        className='h-3'
                        indicatorColor='bg-indigo-500'
                        style={{
                          backgroundColor: `${COLORS[index % COLORS.length]}20`
                        }}
                      />
                      <div className='flex justify-between text-xs text-gray-500'>
                        <span>0%</span>
                        <span>
                          {((value / totalSpent) * 100).toFixed(1)}% of total
                        </span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle>Spending Trend by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={400}>
                  <LineChart data={monthlyComparison}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='spent'
                      name='Monthly Spending'
                      stroke='#EF4444'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: '#EF4444',
                        strokeWidth: 2,
                        fill: '#fff'
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='budget'
                      name='Monthly Budget'
                      stroke='#4F46E5'
                      strokeWidth={2}
                      strokeDasharray='3 3'
                      dot={{ r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: '#4F46E5',
                        strokeWidth: 2,
                        fill: '#fff'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
