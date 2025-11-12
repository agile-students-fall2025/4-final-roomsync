import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Payments.css'
import { user, getUsers } from './api/users'

const Payments = props => {
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState([])
  const [collapsedIds, setCollapsedIds] = useState(new Set())

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      const usersData = await getUsers()
      setUsers(usersData)

      // Fetch categories
      try {
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
        setCollapsedIds(new Set(categoriesData.map(category => category.id)))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }

      // Fetch payments
      try {
        const paymentsResponse = await fetch(`/api/rooms/${user.roomId}/payments`)
        const paymentsData = await paymentsResponse.json()
        setExpenses(paymentsData)
      } catch (error) {
        console.error('Error fetching payments:', error)
      }
    }
    fetchData()
  }, [])

  const getUserNameSync = id => {
    const foundUser = users.find(u => u.id === id)
    return foundUser ? foundUser.name : 'Unknown'
  }

  const toggleCategory = id => {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getExpensesByCategory = categoryId => {
    return expenses.filter(expense => expense.categoryId === categoryId)
  }

  const totalFor = items => items.reduce((sum, itm) => sum + (Number(itm.amount) || 0), 0).toFixed(2)

  const calculateBalance = userId => {
    let totalPaid = 0
    let totalOwed = 0

    expenses.forEach(expense => {
      if (!expense.cleared) {
        if (expense.paidBy === userId) {
          totalPaid += expense.amount
        }

        if (expense.owedBy.includes(userId)) {
          const share = expense.amount / expense.owedBy.length
          totalOwed += share
        }
      }
    })

    return (totalPaid - totalOwed).toFixed(2)
  }

  const userBalance = calculateBalance(user.id)

  return (
    <>
      <div
        style={{
          margin: '20px auto',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #ddd',
          maxWidth: '1200px',
        }}
      >
        <h2
          style={{
            margin: '0',
            fontSize: '20px',
            color: '#333',
            fontWeight: '600',
          }}
        >
          Current User: {user.name}
        </h2>
        <div style={{ marginTop: '10px', fontSize: '16px' }}>
          {userBalance >= 0 ? <span style={{ color: '#2d5016' }}>You are owed: ${userBalance}</span> : <span style={{ color: '#8b0000' }}>You owe: ${Math.abs(userBalance)}</span>}
        </div>
      </div>

      <ul className="Payments-list">
        {categories.map(category => {
          const isCollapsed = collapsedIds.has(category.id)
          const categoryExpenses = getExpensesByCategory(category.id)
          return (
            <li key={category.id} className="Payment-Category">
              <button type="button" onClick={() => toggleCategory(category.id)} aria-expanded={!isCollapsed} className="CategoryHeader">
                <div>Category: {category.name}</div>
                <div>Amount: {totalFor(categoryExpenses)}$</div>
                <div style={{ fontSize: 13, color: '#7f8c8d', fontWeight: 'normal' }}>{isCollapsed ? 'Click to expand ▼' : 'Click to collapse ▲'}</div>
              </button>

              {!isCollapsed &&
                categoryExpenses.map(expense => (
                  <div key={expense.id} className="PaymentItem">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <strong>
                          {expense.name} - ${expense.amount}
                          <span style={{ marginLeft: '10px' }} className={expense.cleared ? 'Cleared' : 'NotCleared'}>
                            {expense.cleared ? 'Cleared' : 'Not cleared'}
                          </span>
                        </strong>
                        <span style={{ marginLeft: '15px', fontSize: '14px' }}>
                          Paid by: <span style={{ color: expense.paidBy === user.id ? '#1a5490' : 'inherit' }}>{getUserNameSync(expense.paidBy)}</span> • Owed by:{' '}
                          {expense.owedBy.map((id, index) => (
                            <span key={id}>
                              <span style={{ color: id === user.id ? '#1a5490' : 'inherit' }}>{getUserNameSync(id)}</span>
                              {index < expense.owedBy.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      </div>
                      <Link to={`/payments/${expense.id}`}>
                        <button className="EditButton">Edit</button>
                      </Link>
                    </div>
                  </div>
                ))}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Payments
