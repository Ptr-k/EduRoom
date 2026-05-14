import axios from 'axios'

// se usa la URL de la variable de entorno, o /api por defecto (para Nginx si se prefiere)
const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${API_URL}/api`
})

// Añadir el token a todas las peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
