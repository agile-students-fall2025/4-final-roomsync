import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'
import { getCurrentUser } from './api/users.js';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const Home = props => {
  const user = getCurrentUser()
  const [chores, setChores] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Only fetch if user has a room
    if (user?.roomId) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const token = localStorage.getItem('token')
          
          const response = await fetch(`${API_BASE}/rooms/${user.roomId}/chores`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            // Ensure it's an array
            setChores(Array.isArray(data) ? data : [])
          }
        } catch (error) {
          console.error('Error fetching chores:', error)
          setChores([])
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [user?.roomId])

  // Safe filtering
  const filteredChores = Array.isArray(chores) 
    ? chores.filter(chore => 
        chore.assignedTo === user?.id && 
        chore.finished === false
      )
    : []

  // Hardcoded for now
  // const [payments] = useState([
  //   { id: 1, name: "Pay electricity bill", amount: 120.5, createdAt: "2025-10-20", cleared: false, categoryId: 1, paidBy: 1, owedBy: [1, 2, 3, 4, 5] },
  //   { id: 2, name: "Refill water filter", amount: 35.0,  createdAt: "2025-10-18", cleared: true,  categoryId: 1, paidBy: 2, owedBy: [1, 2, 3] },
  //   { id: 3, name: "Buy milk",            amount: 4.25,  createdAt: "2025-10-25", cleared: true,  categoryId: 2, paidBy: 3, owedBy: [1, 3, 4] },
  //   { id: 4, name: "Buy vegetables",      amount: 18.6,  createdAt: "2025-10-26", cleared: false, categoryId: 2, paidBy: 1, owedBy: [1, 2, 5] },
  //   { id: 5, name: "Restock snacks",      amount: 22.4,  createdAt: "2025-10-23", cleared: false, categoryId: 2, paidBy: 4, owedBy: [1, 2, 3, 4] },
  //   { id: 6, name: "Change air filter",   amount: 15.0,  createdAt: "2025-10-21", cleared: false, categoryId: 3, paidBy: 5, owedBy: [1, 2, 3, 4, 5] },
  //   { id: 7, name: "Check smoke detector",amount: 10.0,  createdAt: "2025-10-19", cleared: true,  categoryId: 3, paidBy: 2, owedBy: [2, 3, 5] },
  // ]);

  // // Filter payments for current user
  // const filteredPayments = payments
  //   .filter(payment =>
  //     payment.owedBy.includes(user?.id) &&
  //     payment.cleared === false &&
  //     payment.paidBy !== user?.id
  //   )
  //   .map(payment => ({
  //     ...payment,
  //     amountPerPerson: payment.amount / payment.owedBy.length
  //   }));

  return (
    <>
      <div className="home-container">
        <h2>Welcome {user?.username || 'User'}</h2>
        
        {/* Show message if no room */}
        {!user?.roomId && (
          <div className="no-room-message" style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '15px',
            margin: '20px 0',
            color: '#856404'
          }}>
            <p>You are not in a household yet. Join or create one to see chores and payments.</p>
          </div>
        )}
        
        {user?.roomId && (
          <form>
            <div className="statistics-home">
              <div className="stats">
                <h3>Your Upcoming Chores</h3>
                {loading ? (
                  <p>Loading chores...</p>
                ) : filteredChores.length === 0 ? (
                  <p>No upcoming chores! 🎉</p>
                ) : (
                  <ul id="chores">
                    {filteredChores.map(chore => (
                      <li key={chore.id || chore._id || Math.random()}>
                        {chore.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* <div className="stats">
                <h3>Your Upcoming Payments</h3>
                {filteredPayments.length === 0 ? (
                  <p>No pending payments! 💰</p>
                ) : (
                  <ul id="payments">
                    {filteredPayments.map(payment => (
                      <li key={payment.id}>
                        {payment.name} | ${payment.amountPerPerson?.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div> */}
            </div>
          </form>
        )}
      </div>

      <div className="buttons-home">
        {/* <Link className="button-5" to="/skillswap">Skill Swap</Link> */}
        <Link className="button-5" to="/chores">Chores</Link>
        {/* <Link className="button-5" to="/payments">Payments</Link> */}
        <Link className="button-5" to="/compatibility">Compatibility Finder</Link>
        <Link className="button-5" to="/create">Invite Roommate</Link>
      </div>
    </>
  )
}

export default Home
