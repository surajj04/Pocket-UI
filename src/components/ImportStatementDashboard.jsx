import Summary from './Summary'
import MonthlyExpenses from './MonthlyExpenses'
import TopSpendingCategories from './TopSpendingCategories'
import MerchantInsights from './MerchantInsights'
import RefundsAndFailed from './RefundsAndFailed'
import SpendingTrends from './SpendingTrends'
import RecentTransactions from './RecentTransactions'
import HighValueTransactions from './HighValueTransactions'

const Dashboard = ({ data, onUploadNewStatement }) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Statement Analysis</h1>
        <button
          onClick={onUploadNewStatement}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer'
        >
          Try Another Bank Statement
        </button>
      </div>
      {/* <BudgetWarning /> */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-3'>
          <Summary credit={data.totalCredit} debit={data.totalDebit} />
        </div>
        <div className='lg:col-span-2'>
          <MonthlyExpenses expenses={data.monthlyExpenses} />
        </div>
        <TopSpendingCategories topSpendings={data.topSpendings} />
        <div className='lg:col-span-2'>
          <MerchantInsights merchantInsights={data.merchantInsights} />
        </div>
        <RefundsAndFailed refundFaileds={data.refundFaileds} />
        <div className='lg:col-span-2'>
          <SpendingTrends dailyTrends={data.dailyTrends} />
        </div>
        <RecentTransactions recentTransactions={data.recentTransactions} />
        {/* <PaymentModeAnalysis /> */}
        <HighValueTransactions
          highValueTransactions={data.highValueTransactions}
        />
      </div>
    </div>
  )
}

export default Dashboard
