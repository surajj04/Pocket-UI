import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import RegistrationSuccessAlert from '../components/SuccessAlert'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

const InputField = ({ label, value, onChange, placeholder = '' }) => (
  <div className='w-full'>
    <label className='block text-gray-700 text-sm font-medium mb-1'>
      {label}
    </label>
    <input
      type='number'
      min='0'
      value={value}
      onChange={e => onChange(e.target.value)}
      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
      placeholder={placeholder}
    />
  </div>
)

const BudgetSetupPage = () => {
  const navigate = useNavigate()
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  // State for all categories
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [bills, setBills] = useState('')
  const [food, setFood] = useState('')
  const [entertainment, setEntertainment] = useState('')
  const [travel, setTravel] = useState('')
  const [shopping, setShopping] = useState('')
  const [medical, setMedical] = useState('')
  const [rent, setRent] = useState('')
  const [personal, setPersonal] = useState('')
  const [other, setOther] = useState('')

  const calculateBalance = () => {
    const totalExpenses = [
      bills,
      food,
      entertainment,
      travel,
      shopping,
      medical,
      rent,
      personal,
      other
    ]
      .map(expense => parseFloat(expense) || 0)
      .reduce((acc, value) => acc + value, 0)

    return (parseFloat(monthlyBudget) || 0) - totalExpenses
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const budgetData = {
      userId: user?.userId,
      date: Date.now(),
      monthlyBudget: parseFloat(monthlyBudget),
      currentBalance: calculateBalance(),
      bills: parseFloat(bills),
      food: parseFloat(food),
      entertainment: parseFloat(entertainment),
      travel: parseFloat(travel),
      shopping: parseFloat(shopping),
      medical: parseFloat(medical),
      rent: parseFloat(rent),
      personal: parseFloat(personal),
      other: parseFloat(other)
    }

    try {
      const res = await axios.post(`${API_KEY}/budget`, budgetData)

      if (res.data?.budgetId > 0) {
        dispatch(fetchData(user?.token))
        alert('Budget setup completed successfully!')
        navigate('/')
      } else {
        alert('Failed to save budget. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting budget:', error)
      alert(
        'An error occurred while saving your budget. Please try again later.'
      )
    }
  }

  return (
    <div className='flex justify-center px-4 sm:px-6 lg:px-8 py-10'>
      {loginSuccess && (
        <RegistrationSuccessAlert
          message1='Budget Setup Successful!'
          message2='You can now access your account.'
        />
      )}
      {errorMessage && (
        <div className='alert alert-error'>
          <span>Budget Setup Failed</span>
        </div>
      )}

      <div className='w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 sm:p-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center'>
          Setup Your Budget
        </h1>
        <p className='text-gray-600 text-center mb-6'>
          Complete the form below to start managing your expenses
        </p>

        <form onSubmit={handleSubmit}>
          {/* Monthly Budget */}
          <div className='mb-6'>
            <InputField
              label='Monthly Budget (₹)'
              value={monthlyBudget}
              onChange={setMonthlyBudget}
              placeholder='Enter your monthly budget'
            />
          </div>

          {/* Expense Categories */}
          <h3 className='text-lg font-semibold text-gray-800 mt-4 mb-3'>
            Expense Breakdown
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <InputField label='Bills (₹)' value={bills} onChange={setBills} />
            <InputField label='Food (₹)' value={food} onChange={setFood} />
            <InputField label='Rent (₹)' value={rent} onChange={setRent} />
            <InputField
              label='Travel (₹)'
              value={travel}
              onChange={setTravel}
            />
            <InputField
              label='Shopping (₹)'
              value={shopping}
              onChange={setShopping}
            />
            <InputField
              label='Medical (₹)'
              value={medical}
              onChange={setMedical}
            />
            <InputField
              label='Personal (₹)'
              value={personal}
              onChange={setPersonal}
            />
            <InputField
              label='Entertainment (₹)'
              value={entertainment}
              onChange={setEntertainment}
            />
            <InputField
              label='Other Expenses (₹)'
              value={other}
              onChange={setOther}
              placeholder='Miscellaneous expenses'
            />
          </div>

          {/* Current Balance */}
          <div className='mt-6 text-center'>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Remaining Balance (₹):
            </h3>
            <p
              className={`text-2xl font-bold ${
                calculateBalance() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {calculateBalance().toFixed(2)}
            </p>
          </div>

          {/* Submit Button */}
          <div className='mt-8 text-center'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-semibold transition duration-200'
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetSetupPage
