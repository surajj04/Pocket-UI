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
  Legend
} from 'recharts'
import { useSelector } from 'react-redux'
import { Progress } from '../components/ui/progress'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
  '#775DD0'
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

export default function ReportsPage () {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const user = useSelector(state => state.user.user) || {}

  // Processed Data
  const budgets = user?.budgets || []
  const expenses = user?.expenses || []

<<<<<<< HEAD
  const [reportData, setReportData] = useState(user?.budgets || [])

  useEffect(() => {
    if (user?.budgets) {
      setReportData(user.budgets)
    }
  }, [user])

  const filteredData = reportData.filter(
    item => new Date(item.date).getFullYear() === selectedYear
  )

  const noDataForYear = filteredData.length === 0

  const monthlyData = filteredData.map(item => ({
    name: new Date(item.date).toLocaleString('default', { month: 'short' }),
    amount: item.monthlyBudget - item.currentBalance
  }))

  const latestReport = filteredData[0] || {}

  const categoryData = [
    { name: 'Food', value: user?.totalExpense?.food || 0 },
    { name: 'Travel', value: user?.totalExpense?.travel || 0 },
    { name: 'Shopping', value: user?.totalExpense?.shopping || 0 },
    { name: 'Bills', value: user?.totalExpense?.bills || 0 },
    { name: 'Other', value: user?.totalExpense?.other || 0 }
  ]

  const weeklyExpenses = user?.expenses || []
  const weeklyHighlights = weeklyExpenses.slice(-4).map(expense => (
    <li key={expense.expenseId}>
      {expense.category}: ₹{expense.amount} - {expense.description}
    </li>
  ))
=======
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

  // Payment Method Analysis
  const paymentMethods = filteredExpenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + 1
    return acc
  }, {})

  // Recent Transactions
  const recentTransactions = [...filteredExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
>>>>>>> dafafa2 (updated code)

  const availableYears = Array.from(
    new Set(user?.budgets?.map(item => new Date(item.date).getFullYear()))
  ).sort((a, b) => b - a) // Sort years in descending order

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl md:text-4xl max-sm:mx-3 font-bold text-violet-900 mb-6 mt-5 max-sm:text-center'>
        Financial Reports
      </h1>

<<<<<<< HEAD
      <div className='mb-6'>
        <label htmlFor='year-selector' className='font-semibold mr-4'>
          Select Year:
        </label>
=======
      {/* Year Selector */}
      <div className='mb-6 flex items-center gap-4'>
        <label className='font-semibold'>Select Year:</label>
>>>>>>> dafafa2 (updated code)
        <select
          className='p-2 border rounded-md bg-white'
          value={selectedYear}
          onChange={e => setSelectedYear(parseInt(e.target.value))}
        >
<<<<<<< HEAD
          {availableYears.map(year => (
=======
          {[2024, 2025, 2026].map(year => (
>>>>>>> dafafa2 (updated code)
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='monthly'>Monthly Analysis</TabsTrigger>
          <TabsTrigger value='category'>Category Insights</TabsTrigger>
        </TabsList>
<<<<<<< HEAD
        <TabsContent value='monthly'>
          <div className='space-y-8'>
            {noDataForYear ? (
              <Card>
                <CardHeader>
                  <CardTitle>No data available for {selectedYear}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-center'>
                    There is no report data for the selected year.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <LineChart data={monthlyData}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='amount'
                          stroke='#8884d8'
=======

        {/* Overview Tab */}
        <TabsContent value='overview'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>₹{totalSpent}</div>
                <div className='text-sm text-gray-500'>
                  of ₹{totalBudget} budget
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Remaining Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>₹{remainingBudget}</div>
                <Progress
                  value={(totalSpent / totalBudget) * 100}
                  className='h-2'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Avg Daily Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>₹{avgDailySpend}</div>
                <div className='text-sm text-gray-500'>per day</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-sm'>Top Category</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(categorySpending)
                  .sort((a, b) => b[1] - a[1])[0]
                  ?.map((val, i) =>
                    i === 0 ? (
                      <div key={val} className='text-2xl font-bold'>
                        {val}
                      </div>
                    ) : (
                      <div key={val} className='text-sm'>
                        ₹{val}
                      </div>
                    )
                  )}
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Spending Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(categorySpending).map(
                        ([name, value]) => ({ name, value })
                      )}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {Object.keys(categorySpending).map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
>>>>>>> dafafa2 (updated code)
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentTransactions.map(transaction => (
                    <div
                      key={transaction.expenseId}
                      className='flex justify-between items-center p-2 border-b'
                    >
                      <div>
                        <div className='font-medium'>
                          {transaction.category}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {transaction.description}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div>₹{transaction.amount}</div>
                        <div className='text-sm text-gray-500'>
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly Analysis Tab */}
        <TabsContent value='monthly'>
          <div className='grid grid-cols-1 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={monthlyComparison}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey='budget'
                      fill='#8884d8'
                      name='Monthly Budget'
                    />
                    <Bar
                      dataKey='spent'
                      fill='#82ca9d'
                      name='Actual Spending'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart
                    data={Object.entries(paymentMethods).map(
                      ([method, count]) => ({ method, count })
                    )}
                  >
                    <XAxis dataKey='method' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='count' fill='#FF8042' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Category Insights Tab */}
        <TabsContent value='category'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Category-wise Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {Object.entries(categorySpending).map(
                    ([category, amount]) => (
                      <div key={category} className='space-y-1'>
                        <div className='flex justify-between'>
                          <span>{category}</span>
                          <span>₹{amount}</span>
                        </div>
                        <Progress
                          value={(amount / totalSpent) * 100}
                          className='h-2'
                          color={
                            COLORS[
                              Object.keys(categorySpending).indexOf(category) %
                                COLORS.length
                            ]
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Trend by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={monthlyComparison}>
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='spent' stroke='#8884d8' />
                    <Line type='monotone' dataKey='budget' stroke='#82ca9d' />
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
