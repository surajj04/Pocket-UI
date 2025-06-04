import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  PlusCircle,
  BarChart2,
  ArrowDownRight,
  Zap,
  Trophy,
  Wallet
} from 'lucide-react'

import SummaryCard from '../components/SummaryCard'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function DashboardPage () {
  const user = useSelector(state => state.user.user)

  const [currentBudget, setCurrentBudget] = useState(
    user?.budgets?.[user.budgets.length - 1] || {}
  )

  const [score, setScore] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [currentMonthSavings, setCurrentMonthSavings] = useState(0)

  useEffect(() => {
    if (user?.budgets) {
      const latestBudget = user.budgets[user.budgets.length - 1] || {}
      setCurrentBudget(latestBudget)

      // Calculate current month's savings
      if (latestBudget.monthlyBudget && latestBudget.currentBalance) {
        const savings = latestBudget.monthlyBudget - latestBudget.currentBalance
        setCurrentMonthSavings(savings > 0 ? savings : 0)
      }
    }
  }, [user?.budgets])

  useEffect(() => {
    if (user?.expenses) {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyExpenses = user.expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        )
      })

      const total = monthlyExpenses.reduce(
        (acc, expense) => acc + (expense.amount || 0),
        0
      )
      setTotalExpenses(total)
    }
  }, [user?.expenses])

  useEffect(() => {
    if (currentBudget?.currentBalance && currentBudget?.monthlyBudget) {
      const savingsRatio =
        currentBudget.currentBalance / currentBudget.monthlyBudget
      const expenseRatio = totalExpenses / currentBudget.monthlyBudget

      // More accurate financial health score
      const financialScore = Math.min(
        Math.round(
          savingsRatio * 70 + // Weight savings more heavily
            (1 - expenseRatio) * 30 // Weight controlled spending
        ),
        100
      )

      setScore(financialScore)
    }
  }, [currentBudget, totalExpenses])

  const financialHealthMessage =
    score >= 80
      ? 'Excellent financial health! 🎉'
      : score >= 60
      ? "You're doing well! Keep it up! 👍"
      : score >= 40
      ? 'Moderate financial health. Try to save more! 💰'
      : 'Needs improvement. Focus on savings! ⚠️'

  return (
    <div className='space-y-8 mx-auto px-4 sm:px-6 lg:px-8  max-sm:mt-10 max-sm:mb-30'>
      <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:text-center'>
        Welcome, {user?.name || 'User'}
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {/* Updated Savings Card */}
        <SummaryCard
          title='Current Month Savings'
          amount={`₹${new Intl.NumberFormat('en-IN').format(
            currentMonthSavings
          )}`}
          subtitle={`Target: ₹${new Intl.NumberFormat('en-IN').format(
            currentBudget?.monthlySavings || 0
          )}`}
          icon={<Trophy className='h-6 w-6 sm:h-8 sm:w-8 text-yellow-500' />}
        />

        {/* Updated Expenses Card */}
        <SummaryCard
          title='Monthly Expenses'
          amount={`₹${new Intl.NumberFormat('en-IN').format(totalExpenses)}`}
          subtitle={`Budget: ₹${new Intl.NumberFormat('en-IN').format(
            currentBudget?.monthlyBudget || 0
          )}`}
          icon={
            <ArrowDownRight className='h-6 w-6 sm:h-8 sm:w-8 text-green-500' />
          }
        />

        {/* Updated Financial Health Card */}
        <SummaryCard
          title='Financial Health'
          amount={`${Math.round(score)}%`}
          subtitle={financialHealthMessage}
          icon={<Zap className='h-6 w-6 sm:h-8 sm:w-8 text-blue-500' />}
          progress={score}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <QuickActions />
        <FinancialChallenges />
      </div>

      <SpendingInsights />
    </div>
  )
}

function QuickActions () {
  return (
    <Card className='shadow-lg rounded-lg p-4'>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Link to='/add-expense'>
          <Button
            variant='secondary'
            className='w-full bg-gray-900 text-gray-100'
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Expense
          </Button>
        </Link>
        <Link to='/reports'>
          <Button
            variant='secondary'
            className='w-full bg-gray-900 text-gray-100'
          >
            <BarChart2 className='mr-2 h-4 w-4' />
            View Report
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function FinancialChallenges () {
  const challenges = [
    {
      title: 'No Eating Out Challenge',
      description: 'Avoid restaurants and takeout for 1 week'
    },
    {
      title: 'Daily Budget Tracking',
      description: 'Log all expenses every day this week'
    },
    {
      title: '24-Hour Purchase Rule',
      description: 'Wait 24 hours before any non-essential purchase'
    }
  ]

  return (
    <Card className='shadow-lg rounded-lg p-4'>
      <CardHeader>
        <CardTitle>Financial Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {challenges.map((challenge, index) => (
            <div key={index} className='flex items-start gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-purple-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>
                  {challenge.title}
                </h3>
                <p className='text-sm text-gray-600'>{challenge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SpendingInsights () {
  const spendingData = [
    { category: 'Food & Dining', amount: 12500, percentage: 35 },
    { category: 'Shopping', amount: 8500, percentage: 24 },
    { category: 'Bills & Utilities', amount: 7500, percentage: 21 },
    { category: 'Transportation', amount: 4500, percentage: 13 },
    { category: 'Entertainment', amount: 2500, percentage: 7 }
  ]

  return (
    <Card className='shadow-lg rounded-lg p-4'>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {spendingData.map((item, index) => (
            <div key={index}>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium text-gray-700'>
                  {item.category}
                </span>
                <span className='text-sm font-medium text-gray-900'>
                  ₹{new Intl.NumberFormat('en-IN').format(item.amount)}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='h-2.5 rounded-full bg-purple-600'
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className='text-right text-xs text-gray-500 mt-1'>
                {item.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
