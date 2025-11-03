import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = props => {
  const navigate = useNavigate()
  
  
  const [user] = useState({
    id: 1,
    name: 'John Doe',
    community: 'Midtown West',
    profilePicture: null, 
    about: '',
    skills: ['Guitar', 'Cooking', 'Photography'],
    isPublic: true
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePrivacyChange = (isPublic) => {
    setEditedUser(prev => ({
      ...prev,
      isPublic: isPublic
    }))
  }

  const toggleSkillsDropdown = () => {
    setIsSkillsOpen(!isSkillsOpen)
  }

  const handleSave = () => {
    console.log('Saving profile:', editedUser)
    setIsEditing(false)
  }

  return (
    <div className="Profile-container">
      <div className="Profile-header">
        <h1>Profile</h1>
      </div>

      <div className="Profile-content">
        <div className="Profile-top">
          <div className="Profile-picture">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <div className="picture-placeholder">Picture</div>
            )}
          </div>
          <div className="Profile-info">
            <h2>{user.name}</h2>
            <p>Community: {user.community}</p>
          </div>
        </div>

        <div className="Profile-section">
          <label>About me</label>
          <textarea
            name="about"
            value={editedUser.about}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows="4"
          />
        </div>

        <div className="Profile-section">
          <label>My skills</label>
          <div className="Skills-dropdown">
            <button 
              className="Skills-header"
              onClick={toggleSkillsDropdown}
            >
              <span>Skills</span>
              <span className={`arrow ${isSkillsOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isSkillsOpen && (
              <div className="Skills-list">
                {user.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    {skill}
                  </div>
                ))}
                <div className="skill-item others">
                  Others: ...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="Profile-section privacy-section">
          <label>Profile</label>
          <div className="Privacy-options">
            <label className="radio-option">
              <input
                type="radio"
                name="privacy"
                checked={editedUser.isPublic === true}
                onChange={() => handlePrivacyChange(true)}
              />
              <span>Public</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="privacy"
                checked={editedUser.isPublic === false}
                onChange={() => handlePrivacyChange(false)}
              />
              <span>Private</span>
            </label>
          </div>
          <p className="privacy-note">
            Public profile allows other people to see your profile when you add a skill to the calendar
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile