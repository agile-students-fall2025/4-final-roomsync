import { useState, useEffect } from 'react'
import './Profile.css'
import { user } from './api/users'

const Profile = props => {
  const [profile, setProfile] = useState(null)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)

  const [formData, setFormData] = useState({
    about: '',
    isPublic: true,
    community: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/profile`)

        if (!res.ok) {
          console.error('Failed to fetch profile')
          return
        }

        const data = await res.json()
        setProfile(data)
        setFormData({
          about: data.about || '',
          isPublic: data.isPublic ?? true,
          community: data.community || '',
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePrivacyChange = isPublic => {
    setFormData(prev => ({
      ...prev,
      isPublic,
    }))
  }

  const toggleSkillsDropdown = () => {
    setIsSkillsOpen(prev => !prev)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          about: formData.about,
          isPublic: formData.isPublic,
          community: formData.community,
        }),
      })

      if (!res.ok) {
        console.error('Failed to save profile changes')
        return
      }

      const updatedProfile = await res.json()
      setProfile(updatedProfile)
      setFormData({
        about: updatedProfile.about || '',
        isPublic: updatedProfile.isPublic ?? true,
        community: updatedProfile.community || '',
      })
      console.log('Profile saved:', updatedProfile)
    } catch (err) {
      console.error('Error saving profile:', err)
    }
  }

  if (!profile) {
    return <div className="Profile-container">Loading profile...</div>
  }

  return (
    <div className="Profile-container">
      <div className="Profile-header">
        <h1>Profile</h1>
      </div>

      <div className="Profile-content">
        <div className="Profile-top">
          <div className="Profile-picture">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" />
            ) : (
              <div className="picture-placeholder">Picture</div>
            )}
          </div>
          <div className="Profile-info">
            <h2>{user.name}</h2>
            <p>Community: {formData.community || 'Not set'}</p>
          </div>
        </div>

        <div className="Profile-section">
          <label>Community</label>
          <input
            type="text"
            name="community"
            value={formData.community}
            onChange={handleInputChange}
            placeholder="e.g. Midtown West"
          />
        </div>

        <div className="Profile-section">
          <label>About me</label>
          <textarea
            name="about"
            value={formData.about}
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
                {(profile.skills || []).map((skill, index) => (
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
                checked={formData.isPublic === true}
                onChange={() => handlePrivacyChange(true)}
              />
              <span>Public</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="privacy"
                checked={formData.isPublic === false}
                onChange={() => handlePrivacyChange(false)}
              />
              <span>Private</span>
            </label>
          </div>
          <p className="privacy-note">
            Public profile allows other people to see your profile when you add a skill to the calendar
          </p>
        </div>

        <div className="Profile-section">
          <button className="Save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
