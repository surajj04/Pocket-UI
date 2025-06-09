import React, { useState } from 'react'
import ImportStatementDashboard from '../components/ImportStatementDashboard'
import StatementForm from './StatementForm'

function ImportStatements () {
  const [data, setData] = useState(() => {
    try {
      const storedData = localStorage.getItem('data')
      return storedData ? JSON.parse(storedData) : null
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error)
      localStorage.removeItem('data') // Remove corrupted data
      return null
    }
  })

  console.log(data)

  // const [data, setData] = useState({
  //   totalCredit: 187650, // Salary, freelance income, etc.
  //   totalDebit: 132845.5, // Total expenses
  //   monthlyExpenses: [
  //     {
  //       month: 'July 2023',
  //       food: 920,
  //       shopping: 1350,
  //       travel: 620,
  //       bills: 850, // Higher due to AC usage
  //       entertainment: 280,
  //       medical: 120,
  //       personal: 150,
  //       amount: 4290
  //     },
  //     {
  //       month: 'August 2023',
  //       food: 880,
  //       shopping: 980, // Back-to-school sales
  //       travel: 450,
  //       bills: 820,
  //       entertainment: 150,
  //       medical: 0,
  //       personal: 200,
  //       amount: 3480
  //     },
  //     {
  //       month: 'September 2023',
  //       food: 790,
  //       shopping: 2100, // Festival spending (Onam/Ganesh Chaturthi)
  //       travel: 320,
  //       bills: 780,
  //       entertainment: 400,
  //       medical: 90,
  //       personal: 180,
  //       amount: 4660
  //     },
  //     {
  //       month: 'October 2023',
  //       food: 840,
  //       shopping: 1650, // Early Diwali shopping
  //       travel: 150,
  //       bills: 810,
  //       entertainment: 320,
  //       medical: 0,
  //       personal: 250,
  //       amount: 4020
  //     }
  //   ],
  //   topSpendings: [
  //     { category: 'Rent', amount: 60000 },
  //     { category: 'Groceries', amount: 15420 },
  //     { category: 'EMI (Car Loan)', amount: 12800 },
  //     { category: 'Utilities', amount: 9800 },
  //     { category: 'Online Shopping', amount: 8450 },
  //     { category: 'Fuel', amount: 6700 },
  //     { category: 'Dining Out', amount: 4320 }
  //   ],
  //   merchantInsights: [
  //     { merchant: 'Amazon', totalSpent: 8450 },
  //     { merchant: 'Swiggy', totalSpent: 3200 },
  //     { merchant: 'Zomato', totalSpent: 2800 },
  //     { merchant: 'Flipkart', totalSpent: 6100 },
  //     { merchant: 'BSES (Electricity)', totalSpent: 9800 },
  //     { merchant: 'Indian Oil', totalSpent: 6700 },
  //     { merchant: 'Netflix', totalSpent: 1500 }
  //   ],
  //   refundFaileds: [
  //     {
  //       date: '2023-10-12',
  //       amount: 1499,
  //       reason: 'Insufficient balance',
  //       merchant: 'Flipkart'
  //     },
  //     {
  //       date: '2023-09-05',
  //       amount: 650,
  //       reason: 'Merchant cancellation',
  //       merchant: 'Zomato'
  //     }
  //   ],
  //   dailyTrends: {
  //     Monday: { totalTransactions: 8 },
  //     Tuesday: { totalTransactions: 7 },
  //     Wednesday: { totalTransactions: 9 },
  //     Thursday: { totalTransactions: 6 },
  //     Friday: { totalTransactions: 12 }, // Payday effects
  //     Saturday: { totalTransactions: 15 }, // Weekend shopping
  //     Sunday: { totalTransactions: 10 }
  //   },
  //   recentTransactions: [
  //     {
  //       date: '2023-10-25',
  //       description: 'Paid to Amazon - Diwali Shopping',
  //       amount: 4499,
  //       type: 'Debit'
  //     },
  //     {
  //       date: '2023-10-24',
  //       description: 'Salary Credited - XYZ Corp',
  //       amount: 75000,
  //       type: 'Credit'
  //     },
  //     {
  //       date: '2023-10-23',
  //       description: 'Paid to BSES - Electricity Bill',
  //       amount: 2450,
  //       type: 'Debit'
  //     }
  //   ],
  //   highValueTransactions: [
  //     {
  //       date: '2023-10-01',
  //       amount: 60000,
  //       description: 'Monthly Rent Transfer'
  //     },
  //     {
  //       date: '2023-09-28',
  //       amount: 12800,
  //       description: 'Car Loan EMI'
  //     },
  //     {
  //       date: '2023-08-05',
  //       amount: 22000,
  //       description: 'Laptop Purchase - Apple Store'
  //     }
  //   ]
  // })

  const onHandleNewStatement = () => {
    setData(null)
    localStorage.removeItem('data')
  }

  return (
    <div>
      {!data ? (
        <StatementForm />
      ) : (
        <ImportStatementDashboard
          data={data}
          onUploadNewStatement={onHandleNewStatement}
        />
      )}
    </div>
  )
}

export default ImportStatements
