import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Chores.css'
import { getUsers, getCurrentUser } from './api/users'

const Chores = props => {
  const user = getCurrentUser() //eslem
  const [chores, setChores] = useState([])
  const [users, setUsers] = useState([])
  const [showOnlyCurrentUser, setShowOnlyCurrentUser] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      // Fetch users
      const usersData = await getUsers()
      setUsers(usersData)

      // Fetch chores
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/rooms/${user.roomId}/chores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const choresData = await response.json()
        setChores(Array.isArray(choresData) ? choresData : [])
      } catch (error) {
        console.error('Error fetching chores:', error)
        setChores([])
      }
    }
    fetchData()
  }, [])

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId)
    return foundUser ? foundUser.name : 'Unknown'
  }

  const toggleFinished = async (id) => {
    const chore = chores.find(c => c.id === id)
    if (!chore) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/rooms/${user.roomId}/chores/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finished: !chore.finished }),
      })
      const updatedChore = await response.json()
      setChores(chores.map(c => c.id === id ? updatedChore : c))
    } catch (error) {
      console.error('Error updating chore:', error)
    }
  }

  if (!user) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <h2>Please log in to view chores</h2>
        <Link to="/login">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Go to Login
          </button>
        </Link>
      </div>
    )
  }

  const filteredChores = (showOnlyCurrentUser
    ? chores.filter(chore => chore.assignedTo === user.id)
    : chores
  ).sort((a, b) => a.finished - b.finished)

  const notFinishedChores = filteredChores.filter(chore => !chore.finished)
  const finishedChores = filteredChores.filter(chore => chore.finished)

  return (
    <>
      <div className="Chores-container">
        <h1>Chores Management</h1>
        <p>Manage and track household chores for your roommates.</p>

        <section>
          <div className="Chores-header">
            <h2>Current Chores</h2>
            <label className="Chores-filter">
              <input
                type="checkbox"
                checked={showOnlyCurrentUser}
                onChange={(e) => setShowOnlyCurrentUser(e.target.checked)}
              />
              Show only my chores
            </label>
          </div>
          <ul className="Chores-list">
            {notFinishedChores.map(chore => (
              <li key={chore.id} className="Chore-item">
                <div>
                  <strong>{chore.name}</strong>
                  <div>Assigned to: {getUserName(chore.assignedTo)}</div>
                  <div>Status: {chore.finished ? 'Finished' : 'Not finished'}</div>
                </div>

                <div>
                  <button onClick={() => toggleFinished(chore.id)}>
                    {chore.finished ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <Link to={`/chores/edit/${chore.id}`}>
                    <button style={{ marginLeft: '10px' }}>Edit</button>
                  </Link>
                </div>
              </li>
            ))}
            {notFinishedChores.length > 0 && finishedChores.length > 0 && (
              <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #ddd' }} />
            )}
            {finishedChores.map(chore => (
              <li key={chore.id} className="Chore-item">
                <div>
                  <strong>{chore.name}</strong>
                  <div>Assigned to: {getUserName(chore.assignedTo)}</div>
                  <div>Status: {chore.finished ? 'Finished' : 'Not finished'}</div>
                </div>

                <div>
                  <button onClick={() => toggleFinished(chore.id)}>
                    {chore.finished ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <Link to={`/chores/edit/${chore.id}`}>
                    <button style={{ marginLeft: '10px' }}>Edit</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="Chores-footer">
          <Link to="/chores/add">Add New Chore</Link> | <Link to="/dashbard">Back to Home</Link>
        </p>
      </div>
    </>
  )
}

export default Chores
