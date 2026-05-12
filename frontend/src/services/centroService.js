import axios from 'axios'
import authService from './authService'

// DESARROLLO: Vite hace proxy de /api a http://localhost:8080
const API_URL = '/api'

const centroService = {
  // se obtienen los centros del usuario (ADMIN ve todos, PROFESOR ve solo el suyo)
  getCentros: async () => {
    const token = authService.getToken()
    const response = await axios.get(`${API_URL}/centros`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // obtener un centro por ID
  getCentroById: async (id) => {
    const token = authService.getToken()
    const response = await axios.get(`${API_URL}/centros/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // POST /api/centros - crear centro (solo ADMIN)
  crearCentro: async (centroData) => {
    const token = authService.getToken()
    const response = await axios.post(`${API_URL}/centros`, centroData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // DELETE /api/centros/{id} - eliminar centro (solo ADMIN)
  eliminarCentro: async (id) => {
    const token = authService.getToken()
    await axios.delete(`${API_URL}/centros/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default centroService
