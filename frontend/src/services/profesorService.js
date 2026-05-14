import api from './api'

const profesorService = {
  crearProfesor: async (centroId, datos) => {
    const response = await api.post(`/centros/${centroId}/profesores`, datos)
    return response.data
  }
}

export default profesorService
