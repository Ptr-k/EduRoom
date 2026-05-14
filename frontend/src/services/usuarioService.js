import api from './api'

const usuarioService = {
  borrarMiCuenta: async () => {
    const response = await api.delete('/usuarios/me')
    return response.data
  },

  descargarLogs: async () => {
    const response = await api.get('/admin/logs', {
      responseType: 'blob'
    })
    
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
