import axios from 'axios'
import authService from './authService'

const API_URL = '/api'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
})

const profesorService = {
  /**
   * Crea un nuevo profesor asociado a un centro.
   * POST /api/centros/{centroId}/profesores
   */
  crearProfesor: async (centroId, datos) => {
    const response = await axios.post(
      `${API_URL}/centros/${centroId}/profesores`,
      datos,
      getAuthHeaders()
    )
    return response.data
  }
}

export default profesorService
