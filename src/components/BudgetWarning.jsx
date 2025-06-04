const BudgetWarning = () => {
  return (
    <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 flex items-center'>
      <svg
        className='h-6 w-6 mr-2 text-yellow-700'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M8.257 3.099c.747-1.321 2.739-1.321 3.486 0l6.514 11.5c.75 1.322-.213 3-1.743 3H3.486c-1.53 0-2.493-1.678-1.743-3l6.514-11.5zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
      <div>
        <p className='font-bold'>Budget Warning</p>
        <p>
          You have spent 30% more than last month. Consider reviewing your
          expenses.
        </p>
      </div>
    </div>
  )
}

export default BudgetWarning
