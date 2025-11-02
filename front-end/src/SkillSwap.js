import { Link,useNavigate } from 'react-router-dom'
import './SkillSwap.css'

const SkillSwap = props => {
  const navigate = useNavigate()

  return (
    <div className="SkillSwap-container">
      <div className="SkillSwap-header">
        {/* We may not need this */}
        {/* <button className="Back-button" onClick={() => navigate(-1)}> 
          &lt;
        </button> */}  
        <h1>Skill Swap</h1>
      </div>
      <p>See the events around your neighborhood</p>

      <div className="SkillSwap-buttons">
        <button 
          className="nav-button" 
          onClick={() => navigate('/events')}
        >
          Events
        </button>

        <button 
          className="nav-button" 
          // onClick={() => navigate('/calendar')} uncomment on calendar page is created
        >
          Calendar
        </button>

        <button 
          className="nav-button" 
          // onClick={() => navigate('/profile')} uncomment once profile page is created
        >
          Your Profile
        </button>
      </div>
    </div>
  )
}

export default SkillSwap