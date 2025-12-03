import { Link, useNavigate } from 'react-router-dom'
import './SkillSwap.css'

const SkillSwap = props => {
  const navigate = useNavigate()

  return (
    <div className="SkillSwap-container">
      <div>
       
        <h1 className="title">Skill Swap</h1>
        <p className="subtitle">See the events around your neighborhood</p>
      </div>
      

      <div className="SkillSwap-buttons">
        <button 
          className="nav-button" 
          onClick={() => navigate('/events')}
        >
          Events
        </button>

        <button 
          className="nav-button" 
          onClick={() => navigate('/eventcalendar')}
        >
          Calendar
        </button>

        <button 
          className="nav-button" 
          onClick={() => navigate('/profile')}
        >
          Your Profile
        </button>
      </div>
    </div>
  )
}

export default SkillSwap