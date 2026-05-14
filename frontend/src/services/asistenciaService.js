import api from './api'

const asistenciaService = {
  getAsistenciasPorEvento: async (eventoId) => {
    const response = await api.get(`/asistencia/evento/${eventoId}`)
    return response.data
  }
}

export default asistenciaService
