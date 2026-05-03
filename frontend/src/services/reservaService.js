import axios from 'axios'
import authService from './authService'

const API_URL = '/api'

const reservaService = {
  crearReserva: async (reserva) => {
    const token = authService.getToken()
    const res = await axios.post(`${API_URL}/reservas`, reserva, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  getReservasByCentro: async (centroId) => {
    const token = authService.getToken()
    const res = await axios.get(`${API_URL}/reservas/centro/${centroId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  getReservasByAulaFecha: async (aulaId, fecha) => {
    const token = authService.getToken()
    const url = fecha ? `${API_URL}/reservas/aula/${aulaId}?fecha=${fecha}` : `${API_URL}/reservas/aula/${aulaId}`
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default reservaService
