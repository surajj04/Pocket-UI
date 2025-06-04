import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function ExpensesPage () {
  const user = useSelector(state => state.user.user)
  const [expenses, setExpenses] = useState(user?.expenses || [])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear())

  useEffect(() => {
    let updatedExpenses = [...expenses]

    // Filter expenses for the selected year
    updatedExpenses = updatedExpenses.filter(
      expense => new Date(expense.date).getFullYear() === parseInt(yearFilter)
    )

    // Apply other filters
    if (searchQuery) {
      updatedExpenses = updatedExpenses.filter(expense =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      updatedExpenses = updatedExpenses.filter(
        expense => expense.category === categoryFilter
      )
    }

    if (paymentMethodFilter !== 'all') {
      updatedExpenses = updatedExpenses.filter(
        expense => expense.paymentMethod === paymentMethodFilter
      )
    }

    if (dateFilter) {
      updatedExpenses = updatedExpenses.filter(
        expense =>
          new Date(expense.date).toISOString().split('T')[0] === dateFilter
      )
    }

    // Sort expenses
    updatedExpenses.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date) - new Date(b.date)
      } else if (sortBy === 'amount') {
        return a.amount - b.amount
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category)
      }
    })

    setFilteredExpenses(updatedExpenses)
  }, [
    searchQuery,
    sortBy,
    categoryFilter,
    paymentMethodFilter,
    dateFilter,
    yearFilter,
    expenses
  ])

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Generate year options dynamically
  const years = Array.from(
    new Set(expenses.map(expense => new Date(expense.date).getFullYear()))
  ).sort((a, b) => b - a)

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8'>
      <h1 className='max-sm:text-center text-3xl md:text-4xl font-bold text-violet-900 mb-8 mt-5 max-sm:mt-10'>
        Expense Tracking
      </h1>

      <div className='mb-8'>
        <div className='border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-blue-900'>
            Filter &amp; Search
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          <div>
            <label
              htmlFor='search'
              className='block text-sm font-medium text-gray-700'
            >
              Search by Name
            </label>
            <input
              id='search'
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Enter transaction name'
              className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          <div>
            <label
              htmlFor='categoryFilter'
              className='block text-sm font-medium text-gray-700'
            >
              Category
            </label>
            <select
              id='categoryFilter'
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='all'>All Categories</option>
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

          <div>
            <label
              htmlFor='paymentMethodFilter'
              className='block text-sm font-medium text-gray-700'
            >
              Payment Method
            </label>
            <select
              id='paymentMethodFilter'
              value={paymentMethodFilter}
              onChange={e => setPaymentMethodFilter(e.target.value)}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='all'>All Methods</option>
              <option value='cash'>Cash</option>
              <option value='card'>Card</option>
              <option value='upi'>UPI</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='dateFilter'
              className='block text-sm font-medium text-gray-700'
            >
              Select Date
            </label>
            <input
              id='dateFilter'
              type='date'
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          <div>
            <label
              htmlFor='yearFilter'
              className='block text-sm font-medium text-gray-700'
            >
              Filter by Year
            </label>
            <select
              id='yearFilter'
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='sortBy'
              className='block text-sm font-medium text-gray-700'
            >
              Sort By
            </label>
            <select
              id='sortBy'
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            >
              <option value='date'>Date</option>
              <option value='amount'>Amount</option>
              <option value='category'>Category</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className='border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-blue-900'>Expense List</h2>
        </div>

        <div className='mt-4 overflow-x-auto max-sm:mb-24'>
          <table className='min-w-full table-auto'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='py-2 px-4 text-left'>Transaction Name</th>
                <th className='py-2 px-4 text-left'>Amount</th>
                <th className='py-2 px-4 text-left'>Date</th>
                <th className='py-2 px-4 text-left'>Category</th>
                <th className='py-2 px-4 text-left'>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr key={index}>
                    <td className='py-2 px-4'>{expense.description}</td>
                    <td className='py-2 px-4'>₹{expense.amount}</td>
                    <td className='py-2 px-4'>{formatDate(expense.date)}</td>
                    <td className='py-2 px-4'>{expense.category}</td>
                    <td className='py-2 px-4'>{expense.paymentMethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className='py-2 px-4 text-center text-gray-500'
                  >
                    No expenses found for the selected year
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
