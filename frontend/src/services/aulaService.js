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
  },

  // POST /api/aulas/centro/{centroId} - crear aula (solo ADMIN)
  crearAula: async (centroId, aulaData) => {
    const token = authService.getToken()
    const res = await axios.post(`${API_URL}/aulas/centro/${centroId}`, aulaData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },

  // DELETE /api/aulas/{id} - eliminar aula (solo ADMIN)
  eliminarAula: async (id) => {
    const token = authService.getToken()
    await axios.delete(`${API_URL}/aulas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}

export default aulaService
