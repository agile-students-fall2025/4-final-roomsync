/**
 * USER MANAGEMENT API CLIENT
 *
 * Data Structure:
 * - User: { id, name, roomId }
 * - roomId: Associates users with a specific room/household
 *
 * Available Functions:
 * - getUsers(): Get all users in the current user's room
 * - getUserById(id): Get a specific user by ID
 * - getUserByEmail(email): Get a specific user by email
 * - getUserName(id): Get a user's name by ID
 * - addUser(name, email): Add a new user to the current(existing) room by using email
 * - removeUser(id): Remove a user from the current(existing) room
 * - assignUserToRoom(userId, roomId): Assign a user to a different room
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

    const response = await fetch(`${API_URL}/rooms/${currentUser.roomId}/users`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) return []

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const getUserById = async id => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) return null
    
    const user = await response.json()
    return user
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

    const user = await response.json();
    return user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getUserName = async (id) => {
  const foundUser = await getUserById(id);
  return foundUser ? foundUser.username : "Unknown";
};

export const addUser = async (username, email) => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser?.roomId) return null

    const response = await fetch(`${API_URL}/rooms/${currentUser.roomId}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ username , email }),
    });

    const newUser = await response.json();
    return newUser;

  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

export const removeUser = async (id) => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser?.roomId) return null

    const response = await fetch(`${API_URL}/rooms/${currentUser.roomId}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    const result = await response.json()
    return result.success

  } catch (error) {
    console.error('Error removing user:', error)
    return false
  }
}

export const assignUserToRoom = async (userId, roomId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/assign-room`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roomId }),
    })

    const result = await response.json()
    return result.success

  } catch (error) {
    console.error('Error assigning user to room:', error)
    return false
  }
}


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
