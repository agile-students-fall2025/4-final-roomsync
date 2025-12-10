import { useState, useEffect } from 'react'
import './Profile.css'
import { getCurrentUser, getProfile, createProfile, updateProfile } from './api/users'

const Profile = () => {
  const user = getCurrentUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const [formData, setFormData] = useState({
    about: '',
    isPublic: true,
    community: '',
    skills: []
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getProfile(user.id)

        if (data) {
          setProfile(data)
          setFormData({
            about: data.about || '',
            isPublic: data.isPublic ?? true,
            community: data.community || '',
            skills: data.skills || []
          })
        } else {
          // Profile doesn't exist, create one automatically
          console.log('Profile not found, creating new profile...')
          const newProfile = await createProfile(user.id, {
            about: '',
            isPublic: true,
            community: '',
            skills: [],
            profilePicture: null
          })

          if (newProfile && newProfile.success !== false) {
            setProfile(newProfile)
            setFormData({
              about: newProfile.about || '',
              isPublic: newProfile.isPublic ?? true,
              community: newProfile.community || '',
              skills: newProfile.skills || []
            })
          } else {
            console.error('Failed to create profile:', newProfile?.message)
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

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

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim()
    
    if (!trimmedSkill) {
      alert('Please enter a skill')
      return
    }

    if (formData.skills.includes(trimmedSkill)) {
      alert('This skill already exists')
      return
    }

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }))
    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSave = async () => {
    try {
      const result = await updateProfile(user.id, {
        about: formData.about,
        isPublic: formData.isPublic,
        community: formData.community,
        skills: formData.skills
      })

      if (result.success === false) {
        console.error('Failed to save profile changes')
        alert(result.message || 'Failed to save profile')
        return
      }

      setProfile(result)
      setFormData({
        about: result.about || '',
        isPublic: result.isPublic ?? true,
        community: result.community || '',
        skills: result.skills || []
      })
      alert('Profile saved successfully!')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Error saving profile')
    }
  }

  if (!user) {
    return (
      <div className="Profile-container">
        <div className="Profile-header">
          <h1>Profile</h1>
        </div>
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="Profile-container">
        <div className="Profile-header">
          <h1>Profile</h1>
        </div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="Profile-container">
        <div className="Profile-header">
          <h1>Profile</h1>
        </div>
        <p>Unable to load or create profile. Please try refreshing the page or contact support.</p>
      </div>
    )
  }

  return (
    <div className="Profile-container">
      <div className="Profile-header">
        <h1>Profile</h1>
      </div>

      <div className="Profile-content">
        <div className="Profile-top">
          <div className="Profile-info">
            <h2>{user.username}</h2>
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
          
          {/* Add new skill input */}
          <div className="skill-input-container">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Add a skill (e.g., Cooking, Guitar, Coding)"
              className="skill-input"
            />
            <button 
              type="button" 
              onClick={handleAddSkill}
              className="add-skill-button"
            >
              Add
            </button>
          </div>

          {/* Display skills */}
          <div className="skills-list-container">
            {formData.skills.length > 0 ? (
              <div className="skills-tags">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill-button"
                      aria-label="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-skills-message">No skills added yet. Add your first skill above!</p>
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