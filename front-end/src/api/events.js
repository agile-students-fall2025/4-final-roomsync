// front-end/src/api/events.js
import { API_BASE_URL, getAuthHeaders, getCurrentUser } from './config'

export const getRoomEvents = async () => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      console.log('User has no room assigned')
      return []
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events`, {
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
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/date/${date}`, {
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
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/month/${year}/${month}`, {
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

export const addEvent = async (eventData) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      throw new Error('You need to be in a household to create events')
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...eventData,
        createdBy: currentUser.id
      })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return { success: false, message: error.message || 'Failed to create event' }
    }
    
    const result = await response.json()
    return { success: true, ...result }
  } catch (error) {
    console.error('Error adding event:', error)
    return { success: false, message: error.message || 'Network error' }
  }
}

export const updateEvent = async (eventId, eventData) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      throw new Error('You need to be in a household to update events')
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return { success: false, message: error.message || 'Failed to update event' }
    }
    
    const result = await response.json()
    return { success: true, ...result }
  } catch (error) {
    console.error('Error updating event:', error)
    return { success: false, message: error.message || 'Network error' }
  }
}

export const deleteEvent = async (eventId) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      throw new Error('You need to be in a household to delete events')
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return { success: false, message: error.message || 'Failed to delete event' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { success: false, message: error.message || 'Network error' }
  }
}

export const getEventById = async (eventId) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      console.log('User has no room assigned')
      return null
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/${eventId}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export const toggleAttendance = async (eventId, userId, isAttending) => {
  try {
    const currentUser = getCurrentUser()
    
    if (!currentUser?.roomId) {
      throw new Error('You need to be in a household')
    }
    
    const response = await fetch(`${API_BASE_URL}/rooms/${currentUser.roomId}/events/${eventId}/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, isAttending })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return { success: false, message: error.message || 'Failed to update attendance' }
    }
    
    const result = await response.json()
    return { success: true, ...result }
  } catch (error) {
    console.error('Error updating attendance:', error)
    return { success: false, message: error.message || 'Network error' }
  }
}