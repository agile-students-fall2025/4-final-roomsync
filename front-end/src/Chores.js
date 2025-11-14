import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Chores.css'
import { user, getUsers } from './api/users'

const Chores = props => {
  const [chores, setChores] = useState([])
  const [users, setUsers] = useState([])
  const [showOnlyCurrentUser, setShowOnlyCurrentUser] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      const usersData = await getUsers()
      setUsers(usersData)

      // Fetch chores
      try {
        const response = await fetch(`/api/rooms/${user.roomId}/chores`)
        const choresData = await response.json()
        setChores(choresData)
      } catch (error) {
        console.error('Error fetching chores:', error)
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
      const response = await fetch(`/api/rooms/${user.roomId}/chores/${id}`, {
        method: 'PUT',
        headers: {
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

  const filteredChores = (showOnlyCurrentUser
    ? chores.filter(chore => chore.assignedTo === user.id)
    : chores
  ).sort((a, b) => a.finished - b.finished)

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
            {filteredChores.map(chore => (
              <li key={chore.id} className="Chore-item">
                <div>
                  <strong>{chore.name}</strong>
                  <div>Assigned to: {getUserName(chore.assignedTo)}</div>
                  <div>Status: {chore.finished ? 'Finished' : 'Not finished'}</div>
                </div>

                // toggle for complete
                <button onClick={() => toggleFinished(chore.id)}>
                  {chore.finished ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="Chores-footer">
          <Link to="/chores/add">Add New Chore</Link> | <Link to="/">Back to Home</Link>
        </p>
      </div>
    </>
  )
}

export default Chores
