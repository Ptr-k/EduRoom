import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import eventoService from '../services/eventoService'
import asistenciaService from '../services/asistenciaService'
import './CentroDetalle.css'

function ActividadDetalle() {
  const { id, actividadId } = useParams()
  const navigate = useNavigate()

  const [evento, setEvento] = useState(null)
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    const cargar = async () => {
      try {
        setLoading(true)
        const [dataEvento, dataAsistencias] = await Promise.all([
          eventoService.getEventoById(actividadId),
          asistenciaService.getAsistenciasPorEvento(actividadId)
        ])
        setEvento(dataEvento)
        setAsistencias(dataAsistencias)
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar la actividad.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [actividadId, navigate])

  const formatHora = (hora) => {
    if (!hora) return '--:--'
    if (typeof hora === 'string') return hora.slice(0, 5)
    if (Array.isArray(hora)) {
      return `${String(hora[0]).padStart(2, '0')}:${String(hora[1]).padStart(2, '0')}`
    }
    return '--:--'
  }

  const handleCancelar = async () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta actividad? Esta acción no se puede deshacer.')) {
      try {
        await eventoService.deleteEvento(actividadId)
        navigate(`/centros/${id}`)
      } catch (e) {
        console.error(e)
        alert('No se pudo cancelar la actividad.')
      }
    }
  }

  if (loading) {
    return (
      <div className="centro-container">
        <div className="state-container">
          <div className="spinner" />
          <p className="state-text">Cargando actividad...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="centro-container">
        <div className="state-container">
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p className="state-text" style={{ color: '#ff8787' }}>{error}</p>
          <button className="centro-btn" onClick={() => navigate(`/centros/${id}`)}>Volver al centro</button>
        </div>
      </div>
    )
  }

  return (
    <div className="centro-container">
      <nav className="centro-navbar">
        <div className="centro-navbar-brand">
          <div className="brand-dot" />
          <h2>EduRoom</h2>
        </div>
        <button className="volver-link" onClick={() => navigate(`/centros/${id}`)}>← Volver al Centro</button>
      </nav>

      <div className="centro-content">
        <div className="centro-header">
          <h1 className="centro-title">{evento?.titulo}</h1>
          <p className="centro-subtitle">
            Fecha: {evento?.fecha} | Horario: {formatHora(evento?.horaInicio)} – {formatHora(evento?.horaFin)}<br />
            Reservado por: {evento?.creador?.nombre || evento?.creador?.email || 'Desconocido'}
          </p>
        </div>

        <div className="centro-grid">
          <section className="centro-card" style={{ flex: 1 }}>
            <h3>ℹ️ Detalles</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: 24 }}>{evento?.descripcion || 'No hay descripción disponible.'}</p>
            <button className="centro-btn secondary" onClick={handleCancelar} style={{ width: 'fit-content' }}>
              🗑️ Cancelar Actividad
            </button>
          </section>

          <section className="centro-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>📷 Código QR de Asistencia</h3>
            <p style={{ color: '#aaa', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
              Los asistentes pueden escanear este código para registrar su asistencia a la actividad.
            </p>
            <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
              <img
                src={`${import.meta.env.VITE_API_URL || ''}/api/eventos/${actividadId}/qr`}
                alt="QR Asistencia"
                style={{ width: 200, height: 200, objectFit: 'contain' }}
              />
            </div>

            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>O comparte este enlace directo:</p>
              <input
                type="text"
                className="centro-input"
                readOnly
                value={`${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/eventos/${evento?.qrToken}/registro`}
                style={{ textAlign: 'center', fontSize: 13 }}
                onClick={e => e.target.select()}
              />
            </div>
          </section>
        </div>

        {/* Lista de asistentes */}
        <div className="centro-grid" style={{ marginTop: 24, gridTemplateColumns: '1fr' }}>
          <section className="centro-card">
            <h3>👥 Asistentes Registrados ({asistencias.length})</h3>
            {asistencias.length === 0 ? (
              <p className="reserva-empty" style={{ textAlign: 'left' }}>Aún no hay personas registradas.</p>
            ) : (
              <ul className="reserva-list">
                {asistencias.map(a => (
                  <li key={a.id} className="reserva-item">
                    <span style={{ fontWeight: 600, color: '#e0e0e0' }}>{a.nombreAlumno}</span>
                    <span style={{ fontSize: 13, color: '#aaa' }}>
                      {new Date(a.timestampCheckin).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ActividadDetalle
