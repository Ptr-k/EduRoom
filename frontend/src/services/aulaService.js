import axios from 'axios'
import authService from './authService'

const API_URL = '/api'

const aulaService = {
  getAulasByCentro: async (centroId) => {
    const token = authService.getToken()
    const res = await axios.get(`${API_URL}/aulas/centro/${centroId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  getAulaById: async (id) => {
    const token = authService.getToken()
    const res = await axios.get(`${API_URL}/aulas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  }
}

export default aulaService
