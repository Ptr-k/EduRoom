import api from './api'

const eventoService = {
  getEventosByCentro: async (centroId) => {
    const response = await api.get(`/eventos/centro/${centroId}`)
    return response.data
  },

  getEventoById: async (id) => {
    const response = await api.get(`/eventos/${id}`)
    return response.data
  },

  createEvento: async (eventoData) => {
    const response = await api.post('/eventos', eventoData)
    return response.data
  },

  deleteEvento: async (id) => {
    const response = await api.delete(`/eventos/${id}`)
    return response.data
  }
}

export default eventoService
