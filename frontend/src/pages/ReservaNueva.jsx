import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import authService from '../services/authService'
import aulaService from '../services/aulaService'
import reservaService from '../services/reservaService'
import './CentroDetalle.css'

function ReservaNueva() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  const user = useMemo(() => authService.getCurrentUser(), [])
  const [aulas, setAulas] = useState([])
  const [selectedAulaId, setSelectedAulaId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [horaInicio, setHoraInicio] = useState('09:00')
  const [horaFin, setHoraFin] = useState('10:00')
  const [asignatura, setAsignatura] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    const cargar = async () => {
      try {
        setLoading(true)
        setError('')
        const listaAulas = await aulaService.getAulasByCentro(centroId)
        setAulas(listaAulas)
        if (listaAulas.length > 0) {
          setSelectedAulaId(String(listaAulas[0].id))
        }
      } catch (e) {
        console.error(e)
        setError('No se pudieron cargar las aulas del centro.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [centroId, navigate])

  const validarHoras = (ini, fin) => ini < fin

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!selectedAulaId) {
      setError('Selecciona un aula.')
      return
    }
    if (!validarHoras(horaInicio, horaFin)) {
      setError('La hora de inicio debe ser anterior a la hora de fin.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        aula: { id: Number(selectedAulaId) },
        profesor: { id: user?.id },
        fecha,
        horaInicio,
        horaFin,
        asignatura: asignatura || 'Clase'
      }
      await reservaService.crearReserva(payload)
      setMessage('Reserva creada correctamente.')
      setAsignatura('')
    } catch (e) {
      console.error(e)
      const msg = e.response?.data?.message || 'No se pudo crear la reserva.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="form-page-container">
        <nav className="centro-navbar">
          <div className="centro-navbar-brand">
            <div className="brand-dot" />
            <h2>EduRoom</h2>
          </div>
        </nav>
        <div className="state-container">
          <div className="spinner" />
          <p className="state-text">Cargando aulas...</p>
        </div>
      </div>
    )
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
          <h1>Nueva reserva</h1>
          <p>Selecciona el aula, la fecha y el horario que deseas reservar.</p>
        </div>

        <div className="form-card">
          <h2>📅 Datos de la reserva</h2>

          <form onSubmit={handleSubmit}>

            <div className="centro-field">
              <label className="form-label">Aula</label>
              <select
                className="centro-select"
                value={selectedAulaId}
                onChange={e => setSelectedAulaId(e.target.value)}
              >
                <option value="" disabled>Selecciona un aula</option>
                {aulas.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}{a.capacidad ? ` (cap. ${a.capacidad})` : ''}
                  </option>
                ))}
              </select>
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
              <label className="form-label">Asignatura</label>
              <input
                className="centro-input"
                type="text"
                value={asignatura}
                onChange={e => setAsignatura(e.target.value)}
                placeholder="Ej. Matemáticas"
              />
            </div>

            {error && <div className="mensaje-error">⚠️ {error}</div>}
            {message && <div className="mensaje-ok">✓ {message}</div>}

            <div className="form-submit-row">
              <button
                className="centro-btn"
                type="submit"
                disabled={saving || !selectedAulaId}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? 'Creando reserva...' : '📅 Crear reserva'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ReservaNueva
