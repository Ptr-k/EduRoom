import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import usuarioService from '../services/usuarioService'
import './CentroDetalle.css'

function Configuracion() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    setUser(authService.getCurrentUser())
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const handleDescargarLogs = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await usuarioService.descargarLogs()
      setSuccess('Logs descargados correctamente.')
    } catch (err) {
      console.error(err)
      setError('Error al descargar los logs. Asegúrate de que el archivo existe en el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      setError('')
      await usuarioService.borrarMiCuenta()
      // Si se borra correctamente, cerrar sesión
      authService.logout()
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Error al eliminar la cuenta. Es posible que tengas datos asociados (ej. reservas).')
      setShowConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="centro-container">
      {/* NAVBAR */}
      <nav className="centro-navbar">
        <div className="centro-navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div className="brand-dot" />
          <h2>EduRoom</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{user?.nombre || user?.username}</div>
            <div style={{ fontSize: 12, color: '#667eea', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.rol}</div>
          </div>
          <button className="volver-link" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="centro-content" style={{ maxWidth: '800px' }}>
        <button className="volver-link" style={{ marginBottom: 28 }} onClick={() => navigate('/dashboard')}>
          ← Volver al dashboard
        </button>

        <div className="centro-header">
          <h1 className="centro-title">Configuración de la cuenta</h1>
          <p className="centro-subtitle">Gestiona tu información y preferencias</p>
        </div>

        {error && <div className="mensaje-error">⚠️ {error}</div>}
        {success && <div className="mensaje-ok">✅ {success}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Perfil */}
          <div className="centro-card">
            <h3>👤 Perfil</h3>
            <div className="centro-field">
              <label className="form-label">Nombre</label>
              <div style={{ fontSize: 15, color: '#e0e0e0', fontWeight: 500 }}>{user.nombre}</div>
            </div>
            <div className="centro-field">
              <label className="form-label">Email</label>
              <div style={{ fontSize: 14, color: '#aaa' }}>{user.email}</div>
            </div>
            <div className="centro-field">
              <label className="form-label">Rol</label>
              <div style={{ fontSize: 14, color: '#667eea', fontWeight: 'bold' }}>{user.rol}</div>
            </div>
          </div>

          {/* Administración */}
          {user.rol === 'ADMIN' && (
            <div className="centro-card">
              <h3>🛠️ Administración del Sistema</h3>
              <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
                Descarga el archivo de registro (logs) completo del backend para auditar errores o actividad del sistema.
              </p>
              <button 
                className="centro-btn secondary" 
                onClick={handleDescargarLogs}
                disabled={loading}
              >
                {loading ? 'Descargando...' : '📥 Descargar Logs'}
              </button>
            </div>
          )}

          {/* Zona de Peligro */}
          <div className="centro-card" style={{ borderColor: 'rgba(255, 107, 107, 0.3)' }}>
            <h3 style={{ color: '#ff6b6b' }}>⚠️ Zona de peligro</h3>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
              Una vez que elimines tu cuenta, no hay vuelta atrás. Se borrará tu acceso al sistema permanentemente.
            </p>
            
            {!showConfirm ? (
              <button 
                className="centro-btn" 
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)', boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)' }} 
                onClick={() => setShowConfirm(true)}
              >
                🗑️ Eliminar mi cuenta
              </button>
            ) : (
              <div style={{ padding: '20px', backgroundColor: 'rgba(255, 107, 107, 0.05)', border: '1px solid rgba(255, 107, 107, 0.2)', borderRadius: '12px' }}>
                <p style={{ color: '#fff', marginBottom: '20px', fontWeight: '600', fontSize: '15px' }}>
                  ¿Estás completamente seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button 
                    className="centro-btn" 
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)', boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)' }}
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
                  </button>
                  <button className="volver-link" onClick={() => setShowConfirm(false)} disabled={loading} style={{ margin: 0 }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Configuracion
