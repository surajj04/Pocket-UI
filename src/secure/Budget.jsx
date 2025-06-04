import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Label } from '../components/ui/label'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { fetchData } from '../store/userSlice'
import BudgetSetupPage from './BudgetSetup'
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function BudgetPage () {
  const user = useSelector(state => state.user.user)
  const today = new Date()

  const lastBudget = user?.budgets?.[user?.budgets.length - 1]
  const lastBudgetDate = lastBudget ? new Date(lastBudget.date) : null

  const isBudgetForCurrentMonth =
    lastBudgetDate &&
    lastBudgetDate.getMonth() === today.getMonth() &&
    lastBudgetDate.getFullYear() === today.getFullYear()

  const [budget, setBudget] = useState(lastBudget || {})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [adjustments, setAdjustments] = useState({ ...budget })

  const [successAlert, setSuccessAlert] = useState(false)
  const [invalidAlert, setInvalidAlert] = useState(false)

  const dispatch = useDispatch()

  const categories = [
    { name: 'Food', key: 'food' },
    { name: 'Travel', key: 'travel' },
    { name: 'Entertainment', key: 'entertainment' },
    { name: 'Shopping', key: 'shopping' },
    { name: 'Bills', key: 'bills' },
    { name: 'Medical', key: 'medical' },
    { name: 'Rent', key: 'rent' },
    { name: 'Personal', key: 'personal' },
    { name: 'Other', key: 'other' }
  ]

  function calculateBalance (newAdjustments) {
    const totalExpenses = categories.reduce(
      (sum, { key }) => sum + (newAdjustments[key] || 0),
      0
    )
    return budget.monthlyBudget - totalExpenses
  }

  const handleBudgetChange = (key, value) => {
    const updatedAdjustments = {
      ...adjustments,
      [key]: parseFloat(value) || 0,
      currentBalance: calculateBalance({
        ...adjustments,
        [key]: parseFloat(value) || 0
      })
    }
    setAdjustments(updatedAdjustments)
  }

  const handleSaveBudget = async () => {
    const budgetData = {
      ...adjustments,
      budgetId: budget?.budgetId,
      userId: user?.userId,
      date: new Date().toISOString()
    }

    try {
      const res = await axios.put(`${API_KEY}/budget`, budgetData)
      if (res.data?.budgetId > 0) {
        setSuccessAlert(true)
        setTimeout(() => setSuccessAlert(false), 5000)
        setBudget(budgetData)
        setIsModalOpen(false)
        dispatch(fetchData(user?.token))
      } else {
        setInvalidAlert(true)
        setTimeout(() => setInvalidAlert(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting budget:', error)
      alert(
        'An error occurred while saving your budget. Please try again later.'
      )
    }
  }

  // if (!isBudgetForCurrentMonth) {
  //   return <BudgetSetupPage />
  // }

<<<<<<< HEAD
  const lastBudget = user?.budgets?.[user?.budgets.length - 1]
  const lastBudgetMonth = lastBudget
    ? new Date(lastBudget.date).getMonth() + 1
    : null

  if (today.getMonth() + 1 != lastBudgetMonth) {
    return <BudgetSetupPage />
  } else {
    return (
      <>
        <div className=''>
          {successAlert && (
            <RegistrationSuccessAlert
              message1='Budget updated successfully!'
              message2=''
            />
          )}
          {invalidAlert && (
            <InvalidCredentialsAlert
              message1='Failed to save budget. Please try again.'
              message2=''
            />
          )}
        </div>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-sm:mt-10 max-sm:mb-30'>
          <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:text-center'>
            Budget Management
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 '>
            <BudgetBreakdownChart budget={budget} categories={categories} />
            <Button
              onClick={() => setIsModalOpen(true)}
              className='w-full sm:w-3/4 px-4 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700 '
            >
              Adjust Budget
            </Button>
          </div>
          {isModalOpen && (
            <AdjustBudgetModal
              budget={adjustments}
              onChange={handleBudgetChange}
              onSave={handleSaveBudget}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </>
    )
  }
=======
  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 max-sm:mt-10 max-sm:mb-30'>
      <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:text-center'>
        Budget Management
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 '>
        <BudgetBreakdownChart budget={budget} categories={categories} />
        <Button
          onClick={() => setIsModalOpen(true)}
          className='w-full sm:w-3/4 px-4 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700 '
        >
          Adjust Budget
        </Button>
      </div>
      {isModalOpen && (
        <AdjustBudgetModal
          budget={adjustments}
          onChange={handleBudgetChange}
          onSave={handleSaveBudget}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
>>>>>>> dafafa2 (updated code)
}

function BudgetBreakdownChart ({ budget, categories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.map(({ name, key }) => (
          <div key={key} className='mb-4'>
            <div className='flex justify-between mb-1'>
              <span>{name}</span>
              <span>₹{budget[key] || 0}</span>
            </div>
            <Progress value={(budget[key] / budget.monthlyBudget) * 100 || 0} />
          </div>
        ))}
        <div className='mt-4 font-bold'>
          Current Balance: ₹{budget.currentBalance || 0}
        </div>
      </CardContent>
    </Card>
  )
}

function AdjustBudgetModal ({ budget, onChange, onSave, onClose }) {
  return (
    <>
      <div className='fixed inset-0 sm:bg-gray-300 max-sm:bg-gray-50 sm:bg-opacity-50 flex justify-center items-center max-sm:mb-8'>
        <div className='w-full max-w-md max-sm:w-11/12 bg-gray-50 p-2 sm:p-6 rounded-lg sm:shadow-lg max-h-[90vh] overflow-y-auto'>
          <h2 className='text-lg sm:text-xl font-bold mb-4 text-center'>
            Adjust Budget
          </h2>

          <div className='space-y-2'>
            <Label>Monthly Budget</Label>
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-200 cursor-not-allowed'
              type='number'
              value={budget.monthlyBudget}
              disabled
            />

            {Object.entries(budget).map(([key, value]) => {
              if (
                ![
                  'budgetId',
                  'currentBalance',
                  'date',
                  'monthlyBudget',
                  'userId'
                ].includes(key)
              ) {
                return (
                  <div key={key}>
                    <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <input
                      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                      type='number'
                      value={value || 0}
                      onChange={e => onChange(key, e.target.value)}
                    />
                  </div>
                )
              }
              return null
            })}

            <div className='font-bold mt-4 text-center sm:text-left'>
              Remaining Balance: ₹{budget.currentBalance || 0}
            </div>

            <div className='flex flex-row-2 sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 max-sm:mb-12'>
              <Button
                onClick={onClose}
                className='bg-gray-500 text-white w-full sm:w-auto'
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                className='bg-violet-600 text-white w-full sm:w-auto'
              >
                Save Adjustments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
