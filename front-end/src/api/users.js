/**
 * USER MANAGEMENT API CLIENT
 *
 * Data Structure:
 * - User: { id, name, roomId }
 * - roomId: Associates users with a specific room/household
 *
 * Available Functions:
 * - getCurrentUser(): get the current user 
 * - getUsers(): Get all users in the current user's room 
 * - addUser(name, email): Add a new user to the current(existing) room by using email
 * - removeUser(id): Remove a user from the current(existing) room
 * 
 * - getUserById(id): Get a specific user by ID
 * - getUserByEmail(email): Get a specific user by email
 * - getUserName(id): Get a user's name by ID
 * 
 *
 * Back-end Endpoints:
 * - GET    /api/rooms/:roomId/users          - Get all users in a room
 * - POST   /api/rooms/:roomId/users          - Add user to room
 * - DELETE /api/rooms/:roomId/users/:id      - Remove user from room
 * - POST   /api/users/:userId/assign-room    - Assign user to room
 */


const API_URL = 'http://localhost:3001'

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

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const getUsers = async () => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser?.roomId) return []

    const response = await fetch(`${API_URL}/api/rooms/members`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.members || []

  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}


export const addUser = async (username, email) => {
  try {
    // const inviter = getCurrentUser()

    const response = await fetch(`${API_URL}/api/rooms/invite`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ emails: [email] }),
    });

    const newUser = await response.json();
    return newUser;

  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

// Leave current room
export const leaveRoom = async () => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/leave`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Update local user data
      const user = getCurrentUser()
      if (user) {
        user.roomId = null
        localStorage.setItem('user', JSON.stringify(user))
      }
    }
    
    return result
  } catch (error) {
    console.error('Leave room error:', error)
    return { success: false, message: 'Network error' }
  }
}

// Delete entire room (creator only)
export const deleteRoom = async () => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Update local user data
      const user = getCurrentUser()
      if (user) {
        user.roomId = null
        localStorage.setItem('user', JSON.stringify(user))
      }
    }
    
    return result
  } catch (error) {
    console.error('Delete room error:', error)
    return { success: false, message: 'Network error' }
  }
}


export const getRoomInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/my-room`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching room info:', error)
    return null
  }
}

export const inviteRoommates = async (emails) => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ emails })
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error inviting roommates:', error)
    return { success: false, message: 'Network error' }
  }
}






export const getUserById = async userId => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}

export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/users/email/${email}`, {
      headers: getAuthHeaders()
    });

    if (response.status === 404) return null;
    if (!response.ok) return null

    const data = await response.json();
    return data.user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getUserName = async (id) => {
  const foundUser = await getUserById(id);
  return foundUser ? foundUser.username : "Unknown";
};



// register the new user
export const registerUser = async (username, email, password) => {
  try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Save token and user data to localStorage
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
      }
    
      return result
    
    }catch (error) {
      console.error('Registration error:', error)
      return false
    }
}

export const loginUser = async(email , password) => {
  try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
      // Save token and user data to localStorage
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }

      return result
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
}

// Get current user info from backend (protected)
export const getCurrentUserInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return null
    
    const result = await response.json()
    return result.user
  } catch (error) {
    console.error('Error fetching current user info:', error)
    return null
  }
}

export const getProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export const createProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, message: 'Network error' }
  }
}

export const updateProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, message: 'Network error' }
  }
}
