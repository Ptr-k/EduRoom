import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import authService from '../services/authService'
import './CentroDetalle.css'

function ActividadNueva() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [horaInicio, setHoraInicio] = useState('16:00')
  const [horaFin, setHoraFin] = useState('18:00')
  const [plazas, setPlazas] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const user = authService.getCurrentUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!nombre.trim()) {
      setError('El nombre de la actividad es obligatorio.')
      return
    }
    if (horaInicio >= horaFin) {
      setError('La hora de inicio debe ser anterior a la hora de fin.')
      return
    }

    try {
      setSaving(true)
      // TODO: llamar al servicio cuando esté disponible
      // await actividadService.crearActividad({ centroId, nombre, descripcion, fecha, horaInicio, horaFin, plazas: Number(plazas) })
      await new Promise(r => setTimeout(r, 800)) // simulación temporal
      setMessage('Actividad creada correctamente.')
      setNombre('')
      setDescripcion('')
      setPlazas('')
    } catch (e) {
      console.error(e)
      const msg = e.response?.data?.message || 'No se pudo crear la actividad.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-page-container">

      {/* Navbar */}
      <nav className="centro-navbar">
        <div className="centro-navbar-brand">
          <div className="brand-dot" />
          <h2>EduRoom</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{user?.nombre || user?.username}</div>
            <div style={{ fontSize: 12, color: '#667eea', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.rol}</div>
          </div>
          <button className="volver-link" onClick={() => { authService.logout(); navigate('/login') }}>Cerrar sesión</button>
        </div>
      </nav>

      {/* Content */}
      <div className="form-page-content">
        <button className="volver-link" style={{ marginBottom: 28 }} onClick={() => navigate(`/centros/${centroId}`)}>
          ← Volver al centro
        </button>

        <div className="form-page-header">
          <h1>Nueva actividad extraescolar</h1>
          <p>Completa los datos para crear una nueva actividad en este centro.</p>
        </div>

        <div className="form-card">
          <h2>🎭 Datos de la actividad</h2>

          <form onSubmit={handleSubmit}>

            <div className="centro-field">
              <label className="form-label">Nombre de la actividad *</label>
              <input
                className="centro-input"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej. Taller de teatro"
              />
            </div>

            <div className="centro-field">
              <label className="form-label">Descripción</label>
              <textarea
                className="centro-input"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Describe brevemente la actividad..."
                rows={3}
                style={{ resize: 'vertical', minHeight: 80 }}
              />
            </div>

            <div className="centro-field">
              <label className="form-label">Fecha</label>
              <input
                className="centro-input"
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="centro-field">
                <label className="form-label">Hora inicio</label>
                <input
                  className="centro-input"
                  type="time"
                  value={horaInicio}
                  onChange={e => setHoraInicio(e.target.value)}
                />
              </div>
              <div className="centro-field">
                <label className="form-label">Hora fin</label>
                <input
                  className="centro-input"
                  type="time"
                  value={horaFin}
                  onChange={e => setHoraFin(e.target.value)}
                />
              </div>
            </div>

            <div className="centro-field">
              <label className="form-label">Plazas disponibles</label>
              <input
                className="centro-input"
                type="number"
                min="1"
                value={plazas}
                onChange={e => setPlazas(e.target.value)}
                placeholder="Ej. 20"
              />
            </div>

            {error && <div className="mensaje-error">⚠️ {error}</div>}
            {message && <div className="mensaje-ok">✓ {message}</div>}

            <div className="form-submit-row">
              <button className="centro-btn" type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                {saving ? 'Creando actividad...' : '🎭 Crear actividad'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ActividadNueva
