import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../store/userSlice'
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function GoalsPage () {
  const user = useSelector(state => state.user.user)
  const [goals, setGoals] = useState(user?.goals || [])
  const [successAlert, setSuccessAlert] = useState(false)
  const [invalidAlert, setInvalidAlert] = useState(false)
  const [showAllocation, setShowAllocation] = useState(false)

  // Get current budget
  const currentBudget = user?.budgets?.[user.budgets.length - 1] || {}
  const availableSavings = currentBudget?.currentBalance || 0

  return (
    <>
      <div className=''>
        {successAlert && (
          <RegistrationSuccessAlert
            message1='Goal added successfully!'
            message2=''
            onClose={() => setSuccessAlert(false)}
          />
        )}
        {invalidAlert && (
          <InvalidCredentialsAlert
            message1='Failed to add goal. Please try again.'
            message2=''
            onClose={() => setInvalidAlert(false)}
          />
        )}
      </div>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mt-5 max-sm:text-center max-sm:mt-10'>
            Savings Goals
          </h1>

          <div className='bg-purple-50 p-4 rounded-lg shadow-sm'>
            <div className='flex items-center gap-2'>
              <div className='text-sm font-medium text-purple-800'>
                Available to allocate:
              </div>
              <div className='text-lg font-bold text-purple-900'>
                ₹{new Intl.NumberFormat('en-IN').format(availableSavings)}
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <CurrentGoals
            goals={goals}
            onAddSavings={() => setShowAllocation(true)}
          />
          <NewGoal
            userId={user?.userId}
            setGoals={setGoals}
            setSuccessAlert={setSuccessAlert}
            setInvalidAlert={setInvalidAlert}
            token={user?.token}
          />
        </div>

        {showAllocation && (
          <AllocateSavingsModal
            goals={goals}
            availableSavings={availableSavings}
            onClose={() => setShowAllocation(false)}
            onSave={allocations => {
              // This would be implemented with API calls to update goals
              console.log('Savings allocated:', allocations)
              setShowAllocation(false)
              setSuccessAlert(true)
            }}
          />
        )}

        <SavingTips />
      </div>
    </>
  )
}

function CurrentGoals ({ goals, onAddSavings }) {
  const calculateDaysLeft = targetDate => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  const calculateProgress = (amount, targetAmount) => {
    if (!targetAmount || targetAmount === 0) return 0
    const progress = (amount / targetAmount) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const getStatusDetails = goal => {
    const progress = calculateProgress(goal.amount, goal.targetAmount)
    const daysLeft = calculateDaysLeft(goal.targetDate)

    if (progress >= 100) {
      return {
        status: 'Completed',
        color: 'bg-green-100 text-green-800',
        progressColor: '#10B981'
      }
    }

    if (daysLeft <= 0 && progress < 100) {
      return {
        status: 'Incomplete',
        color: 'bg-red-100 text-red-800',
        progressColor: '#EF4444'
      }
    }

    return {
      status: 'In Progress',
      color: 'bg-blue-100 text-blue-800',
      progressColor: '#3B82F6'
    }
  }

  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.targetDate) - new Date(b.targetDate)
  )

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-xl font-semibold text-gray-900'>Current Goals</div>
        <button
          onClick={onAddSavings}
          className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
          Allocate Savings
        </button>
      </div>

      <div className='space-y-6'>
        {sortedGoals.length > 0 ? (
          sortedGoals.map(goal => {
            const { status, color, progressColor } = getStatusDetails(goal)
            const daysLeft = calculateDaysLeft(goal.targetDate)
            const progress = calculateProgress(goal.amount, goal.targetAmount)
            const showTarget = goal.targetAmount > 0

            return (
              <div
                key={goal.id}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex gap-4'>
                  <div className='w-20 h-20'>
                    <CircularProgressbar
                      value={progress}
                      text={`${Math.round(progress)}%`}
                      styles={buildStyles({
                        textSize: '24px',
                        pathColor: progressColor,
                        textColor: progressColor,
                        trailColor: '#E5E7EB'
                      })}
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-lg text-gray-900'>
                          {goal.description}
                        </h3>
                        <div className='flex items-center flex-wrap gap-2 mt-1'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${color}`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      <div className='text-right'>
                        <div className='bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs'>
                          {daysLeft > 0
                            ? `${daysLeft} days left`
                            : 'Target date passed'}
                        </div>
                      </div>
                    </div>

                    <div className='mt-3'>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-gray-600'>Saved</span>
                        <span className='font-medium'>
                          ₹
                          {new Intl.NumberFormat('en-IN').format(
                            goal.amount || 0
                          )}
                        </span>
                      </div>

                      {showTarget && (
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Target</span>
                          <span className='font-medium'>
                            ₹
                            {new Intl.NumberFormat('en-IN').format(
                              goal.targetAmount
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {status === 'In Progress' && (
                      <div className='mt-3'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='h-2 rounded-full bg-purple-600'
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className='text-center py-8'>
            <div className='mx-auto mb-4 text-4xl'>🎯</div>
            <p className='text-gray-500'>
              No savings goals found. Create your first goal!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function NewGoal ({
  userId,
  setGoals,
  token,
  setSuccessAlert,
  setInvalidAlert
}) {
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()

  const validateForm = () => {
    const newErrors = {}
    if (!goalName.trim()) newErrors.goalName = 'Goal name is required'
    if (!targetAmount || Number(targetAmount) <= 0)
      newErrors.targetAmount = 'Invalid amount'
    if (!targetDate || new Date(targetDate) < new Date())
      newErrors.targetDate = 'Date must be in future'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const newGoal = {
        userId,
        description: goalName,
        amount: 0,
        targetAmount: Number(targetAmount),
        status: 'In Progress',
        targetDate
      }

      const res = await axios.post(`${API_KEY}/goal`, newGoal, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setGoals(prev => [...prev, res.data])
      dispatch(fetchData(token))

      // Reset form
      setGoalName('')
      setTargetAmount('')
      setTargetDate('')

      // Show success alert
      setSuccessAlert(true)
    } catch (error) {
      console.error('Error adding goal:', error)
      setInvalidAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='text-xl font-semibold text-gray-900 mb-4'>
        Create New Goal
      </div>
      <form className='space-y-5' onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor='goalName'
            className='block text-sm font-medium text-gray-600 mb-1'
          >
            What are you saving for?
          </label>
          <input
            id='goalName'
            placeholder='e.g., Vacation, New Car, Emergency Fund'
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            className={`input w-full px-4 py-2 border ${
              errors.goalName ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          {errors.goalName && (
            <p className='text-red-500 text-sm mt-1'>{errors.goalName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='targetAmount'
            className='block text-sm font-medium text-gray-600 mb-1'
          >
            Target Amount (₹)
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
              ₹
            </span>
            <input
              id='targetAmount'
              type='number'
              placeholder='0'
              min='1'
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              className={`input w-full pl-8 pr-4 py-2 border ${
                errors.targetAmount ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          {errors.targetAmount && (
            <p className='text-red-500 text-sm mt-1'>{errors.targetAmount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='targetDate'
            className='block text-sm font-medium text-gray-600 mb-1'
          >
            Target Date
          </label>
          <input
            id='targetDate'
            type='date'
            min={new Date().toISOString().split('T')[0]}
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className={`input w-full px-4 py-2 border ${
              errors.targetDate ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          {errors.targetDate && (
            <p className='text-red-500 text-sm mt-1'>{errors.targetDate}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`btn w-full py-3 px-4 rounded-lg transition-colors ${
            isSubmitting
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex justify-center items-center`}
        >
          {isSubmitting ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Creating Goal...
            </>
          ) : (
            'Create Goal'
          )}
        </button>
      </form>
    </div>
  )
}

function AllocateSavingsModal ({ goals, availableSavings, onClose, onSave }) {
  const [allocations, setAllocations] = useState({})
  const [error, setError] = useState('')

  // Initialize allocations with 0 for each goal
  useState(() => {
    const initialAllocations = {}
    goals.forEach(goal => {
      initialAllocations[goal.id] = 0
    })
    setAllocations(initialAllocations)
  }, [goals])

  const handleAllocationChange = (goalId, value) => {
    const numValue = Number(value) || 0
    setAllocations(prev => ({
      ...prev,
      [goalId]: numValue
    }))
  }

  const getRemainingAmount = () => {
    const allocatedTotal = Object.values(allocations).reduce(
      (sum, val) => sum + val,
      0
    )
    return availableSavings - allocatedTotal
  }

  const handleSubmit = () => {
    const allocatedTotal = Object.values(allocations).reduce(
      (sum, val) => sum + val,
      0
    )

    if (allocatedTotal > availableSavings) {
      setError('Total allocation exceeds available savings')
      return
    }

    if (allocatedTotal === 0) {
      setError('Please allocate some amount to your goals')
      return
    }

    onSave(allocations)
  }

  const remainingAmount = getRemainingAmount()

  return (
    <div className='fixed inset-0 bg-gray-100 border border-gray-300 shadow bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Allocate Savings to Goals
            </h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='mb-6 p-4 bg-purple-50 rounded-lg'>
            <div className='flex justify-between items-center'>
              <div className='text-lg font-medium text-purple-800'>
                Available Savings
              </div>
              <div className='text-xl font-bold text-purple-900'>
                ₹{new Intl.NumberFormat('en-IN').format(availableSavings)}
              </div>
            </div>
          </div>

          <div className='space-y-4 mb-6'>
            {goals.map(goal => (
              <div
                key={goal.id}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-semibold text-gray-900'>
                    {goal.description}
                  </h3>
                  <div className='text-sm text-gray-600'>
                    Saved: ₹
                    {new Intl.NumberFormat('en-IN').format(goal.amount || 0)}
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex-1'>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                        ₹
                      </span>
                      <input
                        type='number'
                        min='0'
                        max={availableSavings}
                        value={allocations[goal.id] || 0}
                        onChange={e =>
                          handleAllocationChange(goal.id, e.target.value)
                        }
                        className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                      />
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>
                    Max: ₹
                    {new Intl.NumberFormat('en-IN').format(
                      goal.targetAmount - goal.amount
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <div className='flex justify-between items-center'>
              <div className='text-lg font-medium text-gray-800'>
                Remaining Amount
              </div>
              <div
                className={`text-xl font-bold ${
                  remainingAmount < 0 ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                ₹{new Intl.NumberFormat('en-IN').format(remainingAmount)}
              </div>
            </div>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
              Save Allocation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SavingTips () {
  const tips = [
    {
      title: 'Pay Yourself First',
      content:
        'Automatically transfer a portion of your income to savings before spending',
      icon: '💸'
    },
    {
      title: 'Set Micro-Goals',
      content: 'Break large goals into smaller milestones to stay motivated',
      icon: '🎯'
    },
    {
      title: 'Track Your Progress',
      content: 'Review your goals weekly to make adjustments as needed',
      icon: '📊'
    },
    {
      title: 'Reduce Expenses',
      content: 'Identify and eliminate one unnecessary expense each month',
      icon: '✂️'
    },
    {
      title: 'Earn More Interest',
      content: 'Use high-yield savings accounts to grow your money faster',
      icon: '📈'
    }
  ]

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 mt-8 max-sm:mb-28'>
      <div className='text-xl font-semibold text-gray-900 mb-4'>
        Smart Saving Strategies
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tips.map((tip, index) => (
          <div
            key={index}
            className='bg-gray-50 hover:bg-purple-50 border border-gray-200 rounded-lg p-4 transition-all'
          >
            <div className='flex items-start gap-3'>
              <div className='text-2xl'>{tip.icon}</div>
              <div>
                <h3 className='font-semibold text-purple-800'>{tip.title}</h3>
                <p className='text-gray-600 text-sm mt-1'>{tip.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
