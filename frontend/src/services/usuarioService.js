import axios from 'axios'
import authService from './authService'

const API_URL = '/api'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
})

const usuarioService = {
  // Eliminar la cuenta del usuario actual
  borrarMiCuenta: async () => {
    const response = await axios.delete(`${API_URL}/usuarios/me`, getAuthHeaders())
    return response.data
  },

  // Descargar logs del sistema (solo ADMIN)
  descargarLogs: async () => {
    const response = await axios.get(`${API_URL}/admin/logs`, {
      ...getAuthHeaders(),
      responseType: 'blob' // Importante para manejar archivos
    })
    
    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'eduroom.log')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

export default usuarioService
