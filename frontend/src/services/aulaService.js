import api from './api'

const aulaService = {
  getAulasByCentro: async (centroId) => {
    const res = await api.get(`/aulas/centro/${centroId}`)
    return res.data
  },

  getAulaById: async (id) => {
    const res = await api.get(`/aulas/${id}`)
    return res.data
  },

  crearAula: async (centroId, aulaData) => {
    const res = await api.post(`/aulas/centro/${centroId}`, aulaData)
    return res.data
  },

  eliminarAula: async (id) => {
    await api.delete(`/aulas/${id}`)
  }
}

export default aulaService
