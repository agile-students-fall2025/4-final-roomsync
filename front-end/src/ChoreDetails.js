import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './ChoreDetails.css'
import { getUsers, getCurrentUser } from './api/users'
import { API_BASE_URL } from './api/config'

const ChoreDetails = props => {
  const user = getCurrentUser();
  const navigate = useNavigate()
  const { id } = useParams()
  const [users, setUsers] = useState([])
  const [choreName, setChoreName] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const isEditMode = !!id

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      const usersData = await getUsers()
      setUsers(usersData)

      // If editing, fetch the chore data
      if (id) {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE_URL}/api/rooms/${user.roomId}/chores/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          const chore = await response.json()
          setChoreName(chore.name)
          setAssignedTo(chore.assignedTo.toString())
        } catch (error) {
          console.error('Error fetching chore:', error)
        }
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const choreData = {
      name: choreName,
      assignedTo: assignedTo
    }

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/api/rooms/${user.roomId}/chores/${id}`
        : `${API_BASE_URL}/api/rooms/${user.roomId}/chores`
      const method = isEditMode ? 'PUT' : 'POST'
      const token = localStorage.getItem('token')

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(choreData),
      })
      const result = await response.json()
      console.log(isEditMode ? 'Chore updated:' : 'New chore created:', result)
      navigate('/chores')
    } catch (error) {
      console.error('Error saving chore:', error)
    }
  }

  return (
    <>
      <div className="ChoreDetails-container">
        <h1>{isEditMode ? 'Edit Chore' : 'Add New Chore'}</h1>

        <form className="ChoreDetails-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Chore Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter chore name"
              value={choreName}
              onChange={(e) => setChoreName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To:</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
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

          <button type="submit" className="ChoreDetails-button">
            {isEditMode ? 'Update Chore' : 'Add Chore'}
          </button>
        </form>

        <p className="ChoreDetails-footer">
          <Link to="/chores">Back to Chores</Link>
        </p>
      </div>
    </>
  )
}

export default ChoreDetails
