import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Chores.css'

const Chores = props => {
  //Temperary data
  const [chores, setChores] = useState([
    { id: 1, name: 'Clean Kitchen', assignedTo: 'Brian', finished: false },
    { id: 2, name: 'Take Out Trash', assignedTo: 'Eslem', finished: false },
    { id: 3, name: 'Vacuum Living Room', assignedTo: 'Jacod', finished: true }
  ])

  const [showOnlyBrian, setShowOnlyBrian] = useState(false)

  const toggleFinished = (id) => {
    // TODO: implement back end communication
    setChores(chores.map(chore =>
      chore.id === id ? { ...chore, finished: !chore.finished } : chore
    ))
  }

  // TODO: toggle for certain user's chore
  // also sort by finished/unfinished (handle sorting + filtering)
  const filteredChores = (showOnlyBrian? chores.filter(chore => chore.assignedTo === 'Brian') : chores
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
                checked={showOnlyBrian}
                onChange={(e) => setShowOnlyBrian(e.target.checked)}
              />
              Show only Brian's chores
            </label>
          </div>
          <ul className="Chores-list">
            {filteredChores.map(chore => (
              <li key={chore.id} className="Chore-item">
                <div>
                  <strong>{chore.name}</strong>
                  <div>Assigned to: {chore.assignedTo}</div>
                  <div>Status: {chore.finished ? 'Finished' : 'Not finished'}</div>
                </div>

                {/* Toggle for complete/imcomplete */}
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
