import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import profesorService from '../services/profesorService'
import authService from '../services/authService'
import './CentroDetalle.css'

function ProfesorNuevo() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.rol !== 'ADMIN') {
      navigate(`/centros/${centroId}`)
    }
  }, [centroId, navigate])

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      await profesorService.crearProfesor(centroId, {
        nombre,
        email,
        password
      })
      
      setSuccess('Profesor creado correctamente')
      setTimeout(() => {
        navigate(`/centros/${centroId}`)
      }, 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Error al crear el profesor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="centro-container">
      <nav className="centro-navbar">
        <div className="centro-navbar-brand">
          <div className="brand-dot" />
          <h2>EduRoom</h2>
        </div>
      </nav>

      <div className="centro-content">
        <button className="volver-link" style={{ marginBottom: 28 }} onClick={() => navigate(`/centros/${centroId}`)}>
          ← Volver al centro
        </button>

        <div className="centro-header">
          <h1 className="centro-title">Crear Nuevo Profesor</h1>
          <p className="centro-subtitle">El profesor será asignado a este centro</p>
        </div>

        <div className="centro-card" style={{ maxWidth: 500, margin: '0 auto' }}>
          {error && <div style={{ color: '#ff8787', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255, 135, 135, 0.1)', borderRadius: '8px' }}>{error}</div>}
          {success && <div style={{ color: '#69db7c', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(105, 219, 124, 0.1)', borderRadius: '8px' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="centro-field">
              <label className="form-label">Nombre completo</label>
              <input 
                type="text" 
                className="centro-input" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej. Juan Pérez"
              />
            </div>
            
            <div className="centro-field">
              <label className="form-label">Correo electrónico</label>
              <input 
                type="email" 
                className="centro-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="ejemplo@escuela.com"
              />
            </div>
            
            <div className="centro-field">
              <label className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="centro-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            
            <button 
              type="submit" 
              className="centro-btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear profesor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfesorNuevo
