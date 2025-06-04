const RecentTransactions = ({ recentTransactions = [] }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recent Transactions</h2>
      <ul style={styles.list}>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <li key={index} style={styles.listItem}>
              <div style={styles.itemLeft}>
                {transaction.type === 'Credit' ? (
                  <svg
                    style={{ ...styles.icon, color: 'green' }}
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    style={{ ...styles.icon, color: 'red' }}
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 17a1 1 0 01-1-1V5.414L5.707 8.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 11-1.414 1.414L11 5.414V16a1 1 0 01-1 1z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                <span>{transaction.description}</span>
              </div>
              <span
                style={
                  transaction.type === 'Credit' ? styles.credit : styles.debit
                }
              >
                {transaction.type === 'Credit' ? '+' : '-'}₹
                {transaction.amount.toFixed(2)}
              </span>
            </li>
          ))
        ) : (
          <p style={styles.noTransactions}>No recent transactions</p>
        )}
      </ul>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#4A5568'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: '16px',
    height: '16px',
    marginRight: '8px'
  },
  credit: {
    fontWeight: '600',
    color: 'green'
  },
  debit: {
    fontWeight: '600',
    color: 'red'
  },
  noTransactions: {
    color: '#A0AEC0',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '10px'
  }
}

export default RecentTransactions
