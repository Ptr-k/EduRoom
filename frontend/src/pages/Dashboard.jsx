import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import centroService from '../services/centroService'
import './Dashboard.css'

/**
 * Página principal después del login.
 * Muestra los centros del usuario:
 * - ADMIN: ve todos los centros
 * - PROFESOR: ve solo su centro asignado
 */
function Dashboard() {
  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // datos del usuario desde localStorage
  const user = authService.getCurrentUser()

  useEffect(() => {
    // si no hay sesión, redirigir al login
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    cargarCentros()
  }, [navigate])

  const cargarCentros = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await centroService.getCentros()
      setCentros(data)
    } catch (err) {
      console.error('Error al cargar centros:', err)
      // si el token es inválido, redirigir al login
      if (err.response?.status === 401 || err.response?.status === 403) {
        authService.logout()
        navigate('/login')
        return
      }
      setError('Error al cargar los centros. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const handleCentroClick = (centroId) => {
    navigate(`/centros/${centroId}`)
  }

  // formatear hora de LocalTime (viene como "08:15" o array [8,15])
  const formatHora = (hora) => {
    if (!hora) return '--:--'
    if (typeof hora === 'string') return hora
    if (Array.isArray(hora)) {
      return `${String(hora[0]).padStart(2, '0')}:${String(hora[1]).padStart(2, '0')}`
    }
    return '--:--'
  }

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-dot"></span>
          <h2>EduRoom</h2>
        </div>
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-name">{user?.nombre || 'Usuario'}</div>
            <div className="user-role">{user?.rol || 'Sin rol'}</div>
          </div>
          <button className="logout-button" style={{ marginRight: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }} onClick={() => navigate('/configuracion')}>
            ⚙️ Configuración
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Mis Centros</h1>
          <p>
            {user?.rol === 'ADMIN'
              ? 'Tienes acceso a todos los centros como administrador'
              : 'Centro educativo al que perteneces'}
          </p>
        </div>

        {/* ESTADOS: cargando, error, vacío, o lista */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span className="loading-text">Cargando centros...</span>
          </div>
        ) : error ? (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="retry-button" onClick={cargarCentros}>
              Reintentar
            </button>
          </div>
        ) : centros.length === 0 ? (
          <div className="empty-container">
            <span className="empty-icon">🏫</span>
            <span className="empty-title">Sin centros asignados</span>
            <span className="empty-text">
              No tienes ningún centro educativo asignado. Contacta con un administrador.
            </span>
          </div>
        ) : (
          <div className="centros-grid">
            {centros.map((centro) => (
              <div
                key={centro.id}
                className="centro-card"
                onClick={() => handleCentroClick(centro.id)}
              >
                <div className="centro-card-header">
                  <div className="centro-icon">🏫</div>
                  <span className={`centro-badge ${user?.rol === 'ADMIN' ? 'admin' : 'profesor'}`}>
                    {user?.rol === 'ADMIN' ? 'Admin' : 'Profesor'}
                  </span>
                </div>

                <h3 className="centro-name">{centro.nombre}</h3>

                <div className="centro-details">
                  <div className="centro-detail">
                    <span className="detail-icon">🕐</span>
                    <div>
                      <div className="detail-label">Horario</div>
                      <div className="detail-value">
                        {formatHora(centro.horarioInicio)} - {formatHora(centro.horarioFin)}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="centro-card-footer">
                  <span className="centro-enter">
                    Entrar al centro <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
