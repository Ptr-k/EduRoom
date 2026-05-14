import api from './api'

const centroService = {
  getCentros: async () => {
    const response = await api.get('/centros')
    return response.data
  },

  getCentroById: async (id) => {
    const response = await api.get(`/centros/${id}`)
    return response.data
  },

  crearCentro: async (centroData) => {
    const response = await api.post('/centros', centroData)
    return response.data
  },

  eliminarCentro: async (id) => {
    await api.delete(`/centros/${id}`)
  }
}

export default centroService
