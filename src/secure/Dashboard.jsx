import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  PlusCircle,
  BarChart2,
  ArrowDownRight,
  Zap,
  Trophy
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

  useEffect(() => {
    if (user?.expenses) {
      const total = user.expenses.reduce(
        (acc, expense) => acc + (expense.amount || 0),
        0
      )
      setTotalExpenses(total)
    }
  }, [user?.expenses])

  useEffect(() => {
    if (currentBudget?.currentBalance && currentBudget?.monthlyBudget) {
      const financialScore =
        Math.round(
          (currentBudget.currentBalance / currentBudget.monthlyBudget) * 100
        ) *
          0.5 +
        ((currentBudget.bills +
          currentBudget.food +
          currentBudget.other +
          currentBudget.travel) /
          currentBudget.monthlyBudget) *
          100 *
          0.5
      setScore(financialScore)
    }
  }, [currentBudget])

  const currentBalance = currentBudget?.currentBalance ?? 0
  const monthlyBudget = currentBudget?.monthlyBudget ?? 1
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
        Welcome, Pocket Expense
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        <SummaryCard
          title='Total Savings'
<<<<<<< HEAD
          amount={`₹${currentBalance}`}
=======
          amount={`₹${currentBudget?.currentBalance ?? 0}`}
>>>>>>> dafafa2 (updated code)
          subtitle='Keep it up!'
          icon={<Trophy className='h-6 w-6 sm:h-8 sm:w-8 text-yellow-500' />}
        />

        <SummaryCard
          title='Expenses This Month'
          amount={`₹${totalExpenses}`}
          subtitle='Total spent this month'
          icon={
            <ArrowDownRight className='h-6 w-6 sm:h-8 sm:w-8 text-green-500' />
          }
        />
        <SummaryCard
          title='Financial Health Score'
          amount={`${Math.round(score)} / 100`}
          subtitle={financialHealthMessage}
          icon={<Zap className='h-6 w-6 sm:h-8 sm:w-8 text-blue-500' />}
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
  return (
    <Card className='shadow-lg rounded-lg p-4'>
      <CardHeader>
        <CardTitle>Financial Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-gray-700'>
          Try saving 10% more this month and cut unnecessary expenses.
        </p>
      </CardContent>
    </Card>
  )
}

function SpendingInsights () {
  return (
    <Card className='shadow-lg rounded-lg p-4'>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-gray-700'>Track where your money is going.</p>
      </CardContent>
    </Card>
  )
}
