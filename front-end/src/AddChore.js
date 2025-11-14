import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './AddChore.css'
import { user, getUsers } from './api/users'

const AddChore = props => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers()
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const choreData = {
      name: formData.get('name'),
      assignedTo: parseInt(formData.get('assignedTo'))
    }

    try {
      const response = await fetch(`/api/rooms/${user.roomId}/chores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(choreData),
      })
      const newChore = await response.json()
      console.log('New chore created:', newChore)
      navigate('/chores')
    } catch (error) {
      console.error('Error creating chore:', error)
    }
  }

  return (
    <>
      <div className="AddChore-container">
        <h1>Add New Chore</h1>

        <form className="AddChore-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Chore Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter chore name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To:</label>
            <select
              id="assignedTo"
              name="assignedTo"
              required
            >
              <option value="">Select a roommate</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="AddChore-button">Add Chore</button>
        </form>

        <p className="AddChore-footer">
          <Link to="/chores">Back to Chores</Link>
        </p>
      </div>
    </>
  )
}

export default AddChore
