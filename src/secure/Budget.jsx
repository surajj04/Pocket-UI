import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { fetchData } from '../store/userSlice'
import BudgetSetupPage from './BudgetSetup'
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'
import {
  Pencil,
  RefreshCw,
  PieChart,
  BarChart,
  X,
  Wallet,
  TrendingUp
} from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState('breakdown')
  const [sparklineData, setSparklineData] = useState([])
  const modalRef = useRef(null)

  const dispatch = useDispatch()

  const categories = [
    { name: 'Food', key: 'food', color: 'bg-amber-500', icon: '🍔' },
    { name: 'Travel', key: 'travel', color: 'bg-sky-500', icon: '✈️' },
    {
      name: 'Entertainment',
      key: 'entertainment',
      color: 'bg-fuchsia-500',
      icon: '🎭'
    },
    { name: 'Shopping', key: 'shopping', color: 'bg-emerald-500', icon: '🛍️' },
    { name: 'Bills', key: 'bills', color: 'bg-indigo-500', icon: '📊' },
    { name: 'Medical', key: 'medical', color: 'bg-rose-500', icon: '⚕️' },
    { name: 'Rent', key: 'rent', color: 'bg-cyan-500', icon: '🏠' },
    { name: 'Personal', key: 'personal', color: 'bg-violet-500', icon: '👤' },
    { name: 'Other', key: 'other', color: 'bg-lime-500', icon: '📦' }
  ]

  useEffect(() => {
    if (lastBudget) {
      setBudget(lastBudget)
      setAdjustments(lastBudget)
      generateSparklineData(lastBudget)
    }
  }, [user])

  function generateSparklineData (currentBudget) {
    const data = categories.map(category => {
      const value = currentBudget[category.key] || 0
      const percentage = (value / currentBudget.monthlyBudget) * 100
      return {
        category: category.name,
        value,
        percentage: Math.min(100, Math.max(5, percentage)) // Ensure visible sparkline
      }
    })
    setSparklineData(data)
  }

  function calculateBalance (newAdjustments) {
    const totalExpenses = categories.reduce(
      (sum, { key }) => sum + (newAdjustments[key] || 0),
      0
    )
    return (newAdjustments.monthlyBudget || 0) - totalExpenses
  }

  const handleBudgetChange = (key, value) => {
    const val = parseFloat(value) || 0
    const updatedAdjustments = {
      ...adjustments,
      [key]: val
    }
    updatedAdjustments.currentBalance = calculateBalance(updatedAdjustments)
    setAdjustments(updatedAdjustments)
  }

  const resetAdjustments = () => {
    setAdjustments({ ...budget })
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
        generateSparklineData(budgetData)
      } else {
        setInvalidAlert(true)
        setTimeout(() => setInvalidAlert(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting budget:', error)
      setInvalidAlert(true)
      setTimeout(() => setInvalidAlert(false), 5000)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  if (!isBudgetForCurrentMonth) {
    return <BudgetSetupPage />
  }

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 max-sm:mt-10 max-sm:mb-30'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-8 mt-6'>
        <div className='flex items-center space-x-3'>
          <div className='p-3 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl'>
            <Wallet className='w-8 h-8 text-violet-700' />
          </div>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-violet-800 max-sm:text-center'>
              Budget Management
            </h1>
            <p className='text-indigo-500 text-sm mt-1'>
              {today.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className='flex space-x-2 mt-4 sm:mt-0'>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-300 hover:shadow-violet-400 transition-all'
          >
            <Pencil className='w-4 h-4 mr-2' /> Adjust Budget
          </Button>
        </div>
      </div>

      {successAlert && (
        <div className='mb-6 animate-fadeIn'>
          <RegistrationSuccessAlert
            message='Budget updated successfully!'
            onClose={() => setSuccessAlert(false)}
          />
        </div>
      )}

      {invalidAlert && (
        <div className='mb-6 animate-fadeIn'>
          <InvalidCredentialsAlert
            message='Failed to update budget. Please try again.'
            onClose={() => setInvalidAlert(false)}
          />
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2 border border-violet-100 rounded-2xl shadow-sm'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle className='text-violet-800'>Budget Overview</CardTitle>
              <div className='flex space-x-1 bg-violet-50 p-1 rounded-lg'>
                <Button
                  variant={activeTab === 'breakdown' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setActiveTab('breakdown')}
                  className='rounded-lg'
                >
                  <BarChart className='w-4 h-4 mr-1' /> Breakdown
                </Button>
                {/* <Button
                  variant={activeTab === 'visual' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setActiveTab('visual')}
                  className='rounded-lg'
                >
                  <PieChart className='w-4 h-4 mr-1' /> Visualization
                </Button> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'breakdown' ? (
              <BudgetBreakdownChart
                budget={budget}
                categories={categories}
                sparklineData={sparklineData}
              />
            ) : (
              <BudgetVisualization budget={budget} categories={categories} />
            )}
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl shadow-sm'>
          <CardHeader>
            <CardTitle className='text-violet-800'>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-xl shadow-sm border border-violet-100'>
                  <p className='text-sm text-gray-500 mb-1'>Monthly Budget</p>
                  <p className='text-xl font-bold text-violet-700'>
                    ₹{budget.monthlyBudget?.toLocaleString() || 0}
                  </p>
                </div>

                <div className='bg-white p-4 rounded-xl shadow-sm border border-violet-100'>
                  <p className='text-sm text-gray-500 mb-1'>Total Allocated</p>
                  <p className='text-xl font-medium'>
                    ₹
                    {categories
                      .reduce((sum, { key }) => sum + (budget[key] || 0), 0)
                      ?.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`bg-white p-4 rounded-xl shadow-sm border ${
                    budget.currentBalance < 0
                      ? 'border-red-100 bg-red-50'
                      : 'border-emerald-100 bg-emerald-50'
                  }`}
                >
                  <p className='text-sm text-gray-500 mb-1'>Remaining</p>
                  <p
                    className={`text-xl font-bold ${
                      budget.currentBalance < 0
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    ₹{(budget.currentBalance || 0)?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='bg-white p-4 rounded-xl shadow-sm border border-violet-100'>
                <div className='flex justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700'>
                    Budget Utilization
                  </span>
                  <span className='text-sm font-medium text-violet-600'>
                    {Math.round(
                      ((budget.monthlyBudget - (budget.currentBalance || 0)) /
                        budget.monthlyBudget) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className='bg-gradient-to-r from-violet-500 to-indigo-600 h-3 rounded-full'
                    style={{
                      width: `${Math.min(
                        100,
                        ((budget.monthlyBudget - (budget.currentBalance || 0)) /
                          budget.monthlyBudget) *
                          100
                      ).toFixed(2)}%`
                    }}
                  ></div>
                </div>
                <div className='flex justify-between text-xs text-gray-500 mt-2'>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className='bg-gradient-to-r from-violet-500 to-indigo-600 p-4 rounded-xl text-white'>
                <div className='flex items-start'>
                  <TrendingUp className='w-6 h-6 mr-3 mt-1 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold'>Budget Tip</h3>
                    <p className='text-sm opacity-90 mt-1'>
                      {budget.currentBalance < 0
                        ? "You've exceeded your budget. Consider adjusting allocations."
                        : "You're on track! Great job managing your finances."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div
            ref={modalRef}
            className='w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn'
          >
            <AdjustBudgetModal
              budget={adjustments}
              categories={categories}
              onChange={handleBudgetChange}
              onSave={handleSaveBudget}
              onReset={resetAdjustments}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function BudgetBreakdownChart ({ budget, categories, sparklineData }) {
  return (
    <div className='space-y-6'>
      {categories.map(({ name, key, color, icon }) => {
        const value = budget[key] || 0
        const percentage = Math.round((value / budget.monthlyBudget) * 100 || 0)
        const sparkline =
          sparklineData.find(d => d.category === name)?.percentage || 0

        return (
          <div key={key} className='mb-5'>
            <div className='flex justify-between mb-3'>
              <div className='flex items-center'>
                <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 text-violet-700 mr-3'>
                  <span className='text-lg'>{icon}</span>
                </div>
                <div>
                  <span className='font-medium'>{name}</span>
                  <div className='text-xs text-gray-500'>
                    {percentage}% of total
                  </div>
                </div>
              </div>
              <span className='font-semibold'>₹{value?.toLocaleString()}</span>
            </div>

            <div className='flex items-center'>
              <div className='w-full mr-3'>
                <Progress
                  value={Math.min(100, percentage)}
                  className='h-3 flex-grow'
                  indicatorClass={`${color.replace('bg-', 'bg-')} rounded-full`}
                />
              </div>

              {/* Mini sparkline bar */}
              <div className='relative w-10 h-8'>
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full'></div>
                <div
                  className={`absolute bottom-0 left-0 ${color} rounded-full`}
                  style={{
                    width: `${sparkline}%`,
                    height: '0.25rem'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BudgetVisualization ({ budget, categories }) {
  const totalAllocated = categories.reduce(
    (sum, { key }) => sum + (budget[key] || 0),
    0
  )

  // Calculate percentages and cumulative angles
  let cumulativeAngle = 0
  const segments = categories.map(({ key, color }) => {
    const value = budget[key] || 0
    const percentage = totalAllocated > 0 ? (value / totalAllocated) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = cumulativeAngle
    cumulativeAngle += angle

    return {
      key,
      color,
      percentage,
      angle,
      startAngle
    }
  })

  return (
    <div className='flex flex-col items-center'>
      <div className='relative w-64 h-64 mb-6'>
        <svg viewBox='0 0 100 100' className='w-full h-full'>
          <circle cx='50' cy='50' r='45' fill='#f3f4f6' />
          {segments.map(({ key, color, startAngle, angle }) => {
            if (angle <= 0) return null

            const startRad = (startAngle - 90) * (Math.PI / 180)
            const endRad = (startAngle + angle - 90) * (Math.PI / 180)
            const largeArcFlag = angle > 180 ? 1 : 0

            const startX = 50 + 45 * Math.cos(startRad)
            const startY = 50 + 45 * Math.sin(startRad)
            const endX = 50 + 45 * Math.cos(endRad)
            const endY = 50 + 45 * Math.sin(endRad)

            return (
              <path
                key={key}
                d={`M 50,50 L ${startX},${startY} A 45,45 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                fill={color.replace('bg-', '#').split('-')[0]}
                stroke='white'
                strokeWidth='2'
              />
            )
          })}
          <circle cx='50' cy='50' r='20' fill='white' />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center'>
            <span className='text-lg font-bold text-violet-700'>
              ₹{(budget.currentBalance || 0)?.toLocaleString()}
            </span>
            <p className='text-sm text-gray-600'>Remaining</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-3 w-full'>
        {segments
          .filter(segment => segment.percentage > 0)
          .map((segment, index) => {
            const category = categories.find(c => c.key === segment.key)
            return (
              <div
                key={index}
                className='flex items-center p-2 bg-violet-50 rounded-lg transition-transform duration-200 hover:scale-[1.03]'
              >
                <div
                  className={`w-3 h-3 ${category.color} rounded-full mr-2`}
                ></div>
                <div>
                  <span className='text-sm font-medium'>{category.name}</span>
                  <p className='text-xs text-gray-600'>
                    ₹{(budget[category.key] || 0)?.toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function AdjustBudgetModal ({
  budget,
  categories,
  onChange,
  onSave,
  onReset,
  onClose
}) {
  const totalAllocated = categories.reduce(
    (sum, { key }) => sum + (budget[key] || 0),
    0
  )

  const remaining = budget.monthlyBudget - totalAllocated
  const isOverBudget = remaining < 0

  return (
    <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
      <div className='bg-gradient-to-r from-violet-600 to-indigo-700 p-6 text-white'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Adjust Your Budget</h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='text-white hover:bg-white/10'
          >
            <X className='w-5 h-5' />
          </Button>
        </div>
        <p className='text-violet-200 mt-2'>
          Modify your budget allocations for the current month
        </p>
      </div>

      <div className='p-6'>
        <div className='mb-6 p-5 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <Label className='block mb-2 font-medium text-violet-800'>
                Monthly Budget
              </Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  ₹
                </span>
                <Input
                  className='w-full bg-white pl-8 text-lg font-semibold text-violet-800'
                  type='number'
                  value={budget.monthlyBudget}
                  onChange={e => onChange('monthlyBudget', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className='block mb-2 font-medium text-violet-800'>
                Remaining Balance
              </Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                  ₹
                </span>
                <Input
                  className={`w-full pl-8 text-lg font-bold ${
                    isOverBudget ? 'text-red-600' : 'text-emerald-600'
                  } bg-white`}
                  type='number'
                  value={remaining || 0}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className='flex justify-between text-sm font-medium mt-3'>
            <span className={isOverBudget ? 'text-red-600' : 'text-gray-700'}>
              Total Allocated: ₹{totalAllocated?.toLocaleString()}
            </span>
            <span
              className={
                isOverBudget ? 'text-red-600 font-bold' : 'text-emerald-600'
              }
            >
              {isOverBudget ? 'Over budget!' : 'Within budget'}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {categories.map(({ name, key }) => {
            const value = budget[key] || 0
            const percentage = budget.monthlyBudget
              ? Math.min(100, (value / budget.monthlyBudget) * 100)
              : 0

            return (
              <div key={key} className='space-y-3'>
                <div className='flex justify-between'>
                  <Label className='text-violet-800'>{name}</Label>
                  <span className='text-sm text-gray-500'>
                    {Math.round(percentage)}%
                  </span>
                </div>

                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div
                      className={`h-1 rounded-full ${
                        percentage > 75
                          ? 'bg-red-200'
                          : percentage > 50
                          ? 'bg-amber-200'
                          : 'bg-emerald-200'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <Input
                    className='w-full pl-8 relative z-10'
                    type='number'
                    value={value}
                    onChange={e => onChange(key, e.target.value)}
                  />
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                    ₹
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className='flex justify-between mt-8'>
          <Button
            variant='outline'
            className='border-violet-600 text-violet-600 hover:bg-violet-50 rounded-lg'
            onClick={onReset}
          >
            <RefreshCw className='w-4 h-4 mr-2' /> Reset
          </Button>

          <div className='flex space-x-3'>
            <Button
              variant='outline'
              className='border-violet-600 text-violet-600 hover:bg-violet-50 rounded-lg'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className='text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg shadow-lg shadow-violet-300'
              onClick={onSave}
              disabled={isOverBudget}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
