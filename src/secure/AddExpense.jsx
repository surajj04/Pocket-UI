import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../store/userSlice'
<<<<<<< HEAD
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'
=======
import RegistrationSuccessAlert from '../components/RegistrationSuccessAlert'
import { useNavigate } from 'react-router-dom'
>>>>>>> dafafa2 (updated code)

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function AddExpensePage () {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const [successAlert, setSuccessAlert] = useState(false)
  const [invalidAlert, setInvalidAlert] = useState(false)

  const getCurrentDate = () => {
    return new Date().toISOString().slice(0, 16)
  }

  const handleSubmit = async e => {
    e.preventDefault()

<<<<<<< HEAD
    if (
      !category ||
      category === 'Select Category' ||
      !paymentMethod ||
      paymentMethod === 'Select Payment Method'
    ) {
      alert('Please select a valid category and payment method.')
      return
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.')
=======
    if (!amount || !category || !paymentMethod) {
      alert('Please fill in all required fields.')
>>>>>>> dafafa2 (updated code)
      return
    }

    try {
      const response = await axios.post(`${API_KEY}/expense`, {
        userId: user?.userId,
        amount,
        category,
        date: date || getCurrentDate(),
        description,
        paymentMethod
      })

<<<<<<< HEAD
      if (res.status === 200 || res.status === 201) {
        setSuccessAlert(true)
        setTimeout(() => setSuccessAlert(false), 5000)
        setCategory('')
        setAmount('')
        setDate(getCurrentDate())
        setDescription('')
        setPaymentMethod('')
=======
      if (response.status === 200 || response.status === 201) {
        setLoginSuccess(true)
>>>>>>> dafafa2 (updated code)
        dispatch(fetchData(user?.token))

        setTimeout(() => {
          navigate('/add-expense')
        }, 2000)

        resetForm()
      } else {
        alert('Failed to add expense. Please try again.')
        setInvalidAlert(true)
        setTimeout(() => setInvalidAlert(false), 5000)
      }
    } catch (err) {
      console.error('Error adding expense:', err)
      alert('An error occurred while adding the expense.')
    }
  }

<<<<<<< HEAD
  return (
    <>
      <div className=''>
        {successAlert && (
          <RegistrationSuccessAlert
            message1='Expense added successfully!'
            message2=''
          />
        )}
        {invalidAlert && (
          <InvalidCredentialsAlert
            message1='Failed to add expense. Please try again.'
            message2=''
          />
        )}
      </div>
      <div className='mx-auto sm:px-6 lg:px-8 max-sm:mt-10 max-sm:mb-20'>
        <div className='mx-auto w-full'>
          <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:mx-4 max-sm:mb-0 max-sm:text-center'>
            Add Expense
          </h1>
          <div className='shadow-lg rounded-lg p-6 sm:p-8'>
            <h2 className='text-2xl font-semibold mb-6 max-sm:text-lg max-sm:hidden'>
              New Expense
            </h2>
            <form
              onSubmit={handleSubmit}
              className='space-y-6 max-sm:space-y-4'
            >
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                  <label
                    htmlFor='amount'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Amount (₹)
                  </label>
                  <input
                    id='amount'
                    type='number'
                    placeholder='0.00'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor='category'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Category
                  </label>
                  <select
                    id='category'
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                  >
                    <option value=''>Select Category</option>
                    <option value='food'>Food</option>
                    <option value='travel'>Travel</option>
                    <option value='shopping'>Shopping</option>
                    <option value='bills'>Bills</option>
                    <option value='entertainment'>Entertainment</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                  <label
                    htmlFor='paymentMethod'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Payment Method
                  </label>
                  <select
                    id='paymentMethod'
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                  >
                    <option value=''>Select Payment Method</option>
                    <option value='cash'>Cash</option>
                    <option value='card'>Card</option>
                    <option value='upi'>UPI</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='date'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Date & Time
                  </label>
                  <input
                    id='date'
                    type='datetime-local'
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>
=======
  const resetForm = () => {
    setCategory('')
    setAmount('')
    setDate(getCurrentDate())
    setDescription('')
    setPaymentMethod('')
  }

  return (
    <div className='mx-auto  sm:px-6 lg:px-8 max-sm:mt-10 max-sm:mb-20'>
      {loginSuccess && (
        <RegistrationSuccessAlert
          message1='Expense added successfully!'
          message2=''
        />
      )}
      <div className='mx-auto w-full'>
        <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:mx-4 max-sm:mb-0 max-sm:text-center'>
          Add Expense
        </h1>
        <div className='shadow-lg rounded-lg p-6 sm:p-8'>
          <h2 className='text-2xl font-semibold mb-6 max-sm:text-lg max-sm:hidden'>
            New Expense
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6 max-sm:space-y-4'>
            {/* Form fields */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              <div>
                <label
                  htmlFor='amount'
                  className='block text-sm font-medium text-gray-700'
                >
                  Amount (₹)
                </label>
                <input
                  id='amount'
                  type='number'
                  placeholder='0.00'
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-gray-700'
                >
                  Category
                </label>
                <select
                  id='category'
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                >
                  <option value='Food'>Food</option>
                  <option value='Travel'>Travel</option>
                  <option value='Shopping'>Shopping</option>
                  <option value='Bills'>Bills</option>
                  <option value='Medical'>Medical</option>
                  <option value='Rent'>Rent</option>
                  <option value='Personal'>Personal</option>
                  <option value='Entertainment'>Entertainment</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            </div>
>>>>>>> dafafa2 (updated code)

              <div>
                <label
                  htmlFor='notes'
                  className='block text-sm font-medium text-gray-700'
                >
                  Notes/Tags
                </label>
                <textarea
                  id='notes'
                  placeholder='Add any additional notes or tags'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className='flex justify-center'>
                <button
                  type='submit'
                  className='w-full sm:w-3/4 px-4 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500'
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
