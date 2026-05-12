import axios from 'axios'
import authService from './authService'

const API_URL = 'http://localhost:8080/api/asistencia'

const getAuthHeaders = () => {
  const token = authService.getToken()
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const getAsistenciasPorEvento = async (eventoId) => {
  const response = await axios.get(`${API_URL}/evento/${eventoId}`, getAuthHeaders())
  return response.data
}

const asistenciaService = {
  getAsistenciasPorEvento
}

export default asistenciaService
