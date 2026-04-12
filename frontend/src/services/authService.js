import axios from 'axios'

// DESARROLLO, Vite hace proxy de /api a http://localhost:8080 ( ver vite.config.js para ajustes sii )
const API_URL = '/api'

const authService = {
  // Login de usuario
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    })
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token')
  }
}

export default authService
