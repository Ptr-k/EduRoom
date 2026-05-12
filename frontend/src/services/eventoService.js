import axios from 'axios'
import authService from './authService'

const API_URL = 'http://localhost:8080/api/eventos'

const getAuthHeaders = () => {
  const token = authService.getToken()
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

const getEventosByCentro = async (centroId) => {
  const response = await axios.get(`${API_URL}/centro/${centroId}`, getAuthHeaders())
  return response.data
}

const getEventoById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders())
  return response.data
}

const createEvento = async (eventoData) => {
  const response = await axios.post(API_URL, eventoData, getAuthHeaders())
  return response.data
}

const deleteEvento = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders())
  return response.data
}

const eventoService = {
  getEventosByCentro,
  getEventoById,
  createEvento,
  deleteEvento
}

export default eventoService
