import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../store/userSlice'
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function GoalsPage () {
  const user = useSelector(state => state.user.user)
<<<<<<< HEAD

  const [goals, setGoals] = useState(user?.goals)
  const [successAlert, setSuccessAlert] = useState(false)
  const [invalidAlert, setInvalidAlert] = useState(false)

  useEffect(() => {
    setGoals(user?.goals)
  }, [user])
=======
  const [goals, setGoals] = useState(user?.goals || [])
>>>>>>> dafafa2 (updated code)

  return (
    <>
      <div className=''>
        {successAlert && (
          <RegistrationSuccessAlert
            message1='Goal added successfully!'
            message2=''
          />
        )}
        {invalidAlert && (
          <InvalidCredentialsAlert
            message1='Failed to add goal. Please try again.'
            message2=''
          />
        )}
      </div>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:text-center max-sm:mt-10'>
          Savings Goals
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <CurrentGoals goals={goals} />
          <NewGoal
            userId={user?.userId}
            setGoals={setGoals}
            setSuccessAlert={setSuccessAlert} // Pass setSuccessAlert
            setInvalidAlert={setInvalidAlert} // Pass setInvalidAlert
            token={user?.token}
          />
        </div>
        <SavingTips />
      </div>
    </>
  )
}

function CurrentGoals ({ goals }) {
  const calculateDaysLeft = targetDate => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

<<<<<<< HEAD
  const calculateProgress = (amount, targetAmount) => {
    if (targetAmount <= 0) return 0 // Avoid division by 0
    return (amount / targetAmount) * 100 // Calculate the percentage of completion
  }
=======
  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.targetDate) - new Date(b.targetDate)
  )
>>>>>>> dafafa2 (updated code)

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='text-xl font-semibold text-gray-900 mb-4'>
        Current Goals
      </div>
<<<<<<< HEAD
      <div>
        {goals && goals.length > 0 ? (
          goals.map(goal => (
            <div key={goal.id} className='mb-6'>
              <div className='flex justify-between mb-2'>
                <span className='font-semibold'>{goal.description}</span>
                <span>{calculateDaysLeft(goal.targetDate)} days left</span>
              </div>
              {/* Progress Bar (Working) */}
              <div className='h-2 bg-gray-200 rounded-full'>
                <div
                  className='h-2 bg-blue-500 rounded-full'
                  style={{
                    width: `${calculateProgress(
                      goal.amount,
                      goal.targetAmount
                    )}%`
                  }}
                ></div>
              </div>
              <div className='flex justify-between mt-1 text-sm text-gray-600'>
                <span>₹{goal.amount}</span>
                <span>₹{goal.targetAmount}</span>
              </div>
            </div>
          ))
=======
      <div className='space-y-6'>
        {sortedGoals.length > 0 ? (
          sortedGoals.map(goal => {
            const statusColor =
              {
                'In Progress': 'bg-blue-100 text-blue-800',
                Completed: 'bg-green-100 text-green-800',
                Incomplete: 'bg-orange-100 text-orange-800'
              }[goal.status] || 'bg-gray-100 text-gray-800'

            const daysLeft = calculateDaysLeft(goal.targetDate)
            const showTarget = goal.targetAmount > 0

            return (
              <div key={goal.id} className='border-b pb-4 last:border-b-0'>
                <div className='flex justify-between items-start gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>
                      {goal.description}
                    </h3>
                    <div className='flex items-center flex-wrap gap-2 mt-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${statusColor}`}
                      >
                        {goal.status}
                      </span>
                      {goal.amount > 0 && (
                        <span className='text-gray-600'>
                          Saved: ₹{Number(goal.amount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'>
                      {daysLeft > 0
                        ? `${daysLeft} days left`
                        : 'Target date passed'}
                    </div>
                    {showTarget && (
                      <div className='mt-1 text-sm text-gray-500'>
                        Target: ₹
                        {Number(goal.targetAmount).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
>>>>>>> dafafa2 (updated code)
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

<<<<<<< HEAD
function NewGoal ({
  userId,
  setGoals,
  setSuccessAlert,
  setInvalidAlert,
  token
}) {
=======
function NewGoal ({ userId, setGoals, token }) {
>>>>>>> dafafa2 (updated code)
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
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

      const res = await axios.post(`${API_KEY}/goal`, newGoal)
      setGoals(prev => [...prev, res.data])
      dispatch(fetchData(token))

<<<<<<< HEAD
      if (res.data) {
        setGoalName('')
        setTargetAmount('')
        setTargetDate('')
        dispatch(fetchData(token))
        setSuccessAlert(true)
        setTimeout(() => setSuccessAlert(false), 5000) // Hide the success alert after 5 seconds
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      setInvalidAlert(true)
      setTimeout(() => setInvalidAlert(false), 5000) // Hide the invalid alert after 5 seconds
=======
      setGoalName('')
      setTargetAmount('')
      setTargetDate('')
      setSuccessMessage('Goal created successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error adding goal:', error)
      alert('Failed to add goal. Please try again.')
    } finally {
      setIsSubmitting(false)
>>>>>>> dafafa2 (updated code)
    }
  }

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='text-xl font-semibold text-gray-900 mb-4'>New Goal</div>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor='goalName'
            className='block text-sm font-medium text-gray-600'
          >
            Goal Name
          </label>
          <input
            id='goalName'
            placeholder='e.g., New Car'
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            className={`input border ${
              errors.goalName ? 'border-red-500' : 'border-gray-300'
            } rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.goalName && (
            <p className='text-red-500 text-sm mt-1'>{errors.goalName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='targetAmount'
            className='block text-sm font-medium text-gray-600'
          >
            Target Amount (₹)
          </label>
          <input
            id='targetAmount'
            type='number'
            placeholder='0'
            min='1'
            value={targetAmount}
            onChange={e => setTargetAmount(e.target.value)}
            className={`input border ${
              errors.targetAmount ? 'border-red-500' : 'border-gray-300'
            } rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.targetAmount && (
            <p className='text-red-500 text-sm mt-1'>{errors.targetAmount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='targetDate'
            className='block text-sm font-medium text-gray-600'
          >
            Target Date
          </label>
          <input
            id='targetDate'
            type='date'
            min={new Date().toISOString().split('T')[0]}
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className={`input border ${
              errors.targetDate ? 'border-red-500' : 'border-gray-300'
            } rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.targetDate && (
            <p className='text-red-500 text-sm mt-1'>{errors.targetDate}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className={`btn w-full py-2 px-4 rounded-md transition-colors ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white focus:outline-none`}
        >
          {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
        </button>

        {successMessage && (
          <div className='text-green-600 text-center animate-fade-in'>
            {successMessage}
          </div>
        )}
      </form>
    </div>
  )
}

function SavingTips () {
  const tips = [
    {
      title: 'Automate Savings',
      content: 'Set up automatic transfers right after payday'
    },
    {
      title: 'Track Progress Weekly',
      content: 'Review your goals every week to stay motivated'
    },
    {
      title: 'Windfall Strategy',
      content: 'Use bonuses or tax returns to boost your savings'
    },
    {
      title: 'Reduce Expenses',
      content: 'Identify and cut one unnecessary monthly expense'
    },
    {
      title: 'Earn Interest',
      content: 'Keep savings in high-yield accounts to grow faster'
    }
  ]

  return (
    <div className='bg-white shadow-lg rounded-lg p-6 mt-8 max-sm:mb-28'>
      <div className='text-xl font-semibold text-gray-900 mb-4'>
        Saving Strategies
      </div>
      <div className='space-y-4'>
        {tips.map((tip, index) => (
          <div
            key={index}
            className='group cursor-help border-l-4 border-blue-100 pl-4 py-2 hover:border-blue-200 transition-colors'
          >
            <h3 className='font-medium text-blue-800'>{tip.title}</h3>
            <p className='text-gray-600 text-sm hidden group-hover:block mt-1'>
              {tip.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
