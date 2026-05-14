import api from './api'

const reservaService = {
  crearReserva: async (reserva) => {
    const res = await api.post('/reservas', reserva)
    return res.data
  },
  
  getReservaById: async (id) => {
    const res = await api.get(`/reservas/${id}`)
    return res.data
  },

  getReservasByCentro: async (centroId) => {
    const res = await api.get(`/reservas/centro/${centroId}`)
    return res.data
  },

  getReservasByAulaFecha: async (aulaId, fecha) => {
    const url = fecha ? `/reservas/aula/${aulaId}?fecha=${fecha}` : `/reservas/aula/${aulaId}`
    const res = await api.get(url)
    return res.data
  },
  
  deleteReserva: async (id) => {
    const res = await api.delete(`/reservas/${id}`)
    return res.data
  }
}

export default reservaService
