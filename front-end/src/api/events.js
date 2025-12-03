// Create a new file: front-end/src/api/events.js
const API_BASE = 'http://localhost:3001'

const getAuthToken = () => {
  return localStorage.getItem('token')
}

const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const getRoomEvents = async () => {
  try {
    const currentUser = getCurrentUser()
    
    // Check if user has a room
    if (!currentUser?.roomId) {
      console.log('User has no room assigned')
      return []
    }
    
    const response = await fetch(`${API_BASE}/api/rooms/${currentUser.roomId}/events`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export const getEventsByDate = async (date) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      console.log('User has no room assigned')
      return []
    }
    
    const response = await fetch(`${API_BASE}/api/rooms/${currentUser.roomId}/events/date/${date}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching events by date:', error)
    return []
  }
}

export const getEventsByMonth = async (year, month) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      console.log('User has no room assigned')
      return []
    }
    
    const response = await fetch(`${API_BASE}/api/rooms/${currentUser.roomId}/events/month/${year}/${month}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching events by month:', error)
    return []
  }
}

// Add new event
export const addEvent = async (eventData) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      throw new Error('You need to be in a household to create events')
    }
    
    const response = await fetch(`${API_BASE}/api/rooms/${currentUser.roomId}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...eventData,
        createdBy: currentUser.id
      })
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error adding event:', error)
    return { success: false, message: 'Network error' }
  }
}