import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import reservaService from '../services/reservaService'
import './CentroDetalle.css'

function ReservaDetalle() {
  const { id, reservaId } = useParams()
  const navigate = useNavigate()

  const [reserva, setReserva] = useState(null)
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
        const data = await reservaService.getReservaById(reservaId)
        setReserva(data)
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar la reserva.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [reservaId, navigate])

  const formatHora = (hora) => {
    if (!hora) return '--:--'
    if (typeof hora === 'string') return hora.slice(0, 5)
    if (Array.isArray(hora)) {
      return `${String(hora[0]).padStart(2, '0')}:${String(hora[1]).padStart(2, '0')}`
    }
    return '--:--'
  }

  const handleCancelar = async () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
      try {
        await reservaService.deleteReserva(reservaId)
        navigate(`/centros/${id}`)
      } catch (e) {
        console.error(e)
        alert('No se pudo cancelar la reserva.')
      }
    }
  }

  if (loading) {
    return (
      <div className="centro-container">
        <div className="state-container">
          <div className="spinner" />
          <p className="state-text">Cargando reserva...</p>
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
          <h1 className="centro-title">Reserva: {reserva?.asignatura || 'Clase'}</h1>
          <p className="centro-subtitle">
            Aula: {reserva?.aula?.nombre} | Fecha: {reserva?.fecha}
          </p>
        </div>

        <div className="centro-grid" style={{ gridTemplateColumns: '1fr' }}>
          <section className="centro-card">
            <h3>ℹ️ Detalles de la Reserva</h3>
            <div className="centro-field">
              <label className="form-label">Asignatura / Motivo</label>
              <div style={{ fontSize: 16, color: '#e0e0e0', fontWeight: 500 }}>{reserva?.asignatura || 'No especificada'}</div>
            </div>
            <div className="centro-field">
              <label className="form-label">Horario</label>
              <div style={{ fontSize: 15, color: '#aaa' }}>
                {formatHora(reserva?.horaInicio)} – {formatHora(reserva?.horaFin)}
              </div>
            </div>
            <div className="centro-field">
              <label className="form-label">Estado</label>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: reserva?.estado === 'ACTIVA' ? '#4caf50' : '#ff9800',
                textTransform: 'uppercase'
              }}>
                {reserva?.estado}
              </div>
            </div>
            <div className="centro-field">
              <label className="form-label">Profesor</label>
              <div style={{ fontSize: 15, color: '#aaa' }}>{reserva?.profesor?.nombre || reserva?.profesor?.username}</div>
            </div>

            <div style={{ marginTop: 32 }}>
              <button className="centro-btn secondary" onClick={handleCancelar} style={{ width: 'fit-content' }}>
                🗑️ Cancelar Reserva
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReservaDetalle
