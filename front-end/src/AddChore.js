import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './AddChore.css'

const AddChore = props => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const choreData = {
      name: formData.get('name'),
      assignedTo: formData.get('assignedTo')
    }
    // TODO: Send data to backend
    console.log('New chore:', choreData)
    navigate('/chores')
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
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              placeholder="Enter roommate name"
              required
            />
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
