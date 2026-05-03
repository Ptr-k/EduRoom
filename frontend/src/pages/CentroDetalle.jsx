import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import authService from '../services/authService'
import centroService from '../services/centroService'
import aulaService from '../services/aulaService'
import reservaService from '../services/reservaService'
import './CentroDetalle.css'

function CentroDetalle() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  const [centro, setCentro] = useState(null)
  const [aulas, setAulas] = useState([])
  const [selectedAulaId, setSelectedAulaId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = useMemo(() => authService.getCurrentUser(), [])

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    const cargar = async () => {
      try {
        setLoading(true)
        setError('')
        const [c, listaAulas] = await Promise.all([
          centroService.getCentroById(centroId),
          aulaService.getAulasByCentro(centroId)
        ])
        setCentro(c)
        setAulas(listaAulas)
        if (listaAulas.length > 0) {
          const firstId = String(listaAulas[0].id)
          setSelectedAulaId(firstId)
          const rs = await reservaService.getReservasByAulaFecha(listaAulas[0].id, fecha)
          setReservas(rs)
        }
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar el centro o las aulas.')
      } finally {
        setLoading(false)
      }
    }
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centroId, navigate])

  const cargarReservas = async (aulaId, f) => {
    try {
      const rs = await reservaService.getReservasByAulaFecha(aulaId, f)
      setReservas(rs)
    } catch (e) {
      console.error(e)
    }
  }

  const handleChangeAula = async (e) => {
    const v = e.target.value
    setSelectedAulaId(v)
    if (v) await cargarReservas(Number(v), fecha)
  }

  const handleChangeFecha = async (e) => {
    const f = e.target.value
    setFecha(f)
    if (selectedAulaId) await cargarReservas(Number(selectedAulaId), f)
  }

  const formatHora = (hora) => {
    if (!hora) return '--:--'
    if (typeof hora === 'string') return hora.slice(0, 5)
    if (Array.isArray(hora)) {
      return `${String(hora[0]).padStart(2, '0')}:${String(hora[1]).padStart(2, '0')}`
    }
    return '--:--'
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="centro-container">
        <nav className="centro-navbar">
          <div className="centro-navbar-brand">
            <div className="brand-dot" />
            <h2>EduRoom</h2>
          </div>
        </nav>
        <div className="state-container">
          <div className="spinner" />
          <p className="state-text">Cargando centro...</p>
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="centro-container">
        <nav className="centro-navbar">
          <div className="centro-navbar-brand">
            <div className="brand-dot" />
            <h2>EduRoom</h2>
          </div>
          <button className="volver-link" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </nav>
        <div className="state-container">
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p className="state-text" style={{ color: '#ff8787' }}>{error}</p>
          <button className="centro-btn" onClick={() => navigate('/dashboard')}>Volver al dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="centro-container">

      {/* ── Navbar ── */}
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
          <button className="volver-link" onClick={() => navigate('/configuracion')}>⚙️ Configuración</button>
          <button className="volver-link" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="centro-content">

        <button className="volver-link" style={{ marginBottom: 28 }} onClick={() => navigate('/dashboard')}>
          ← Volver al dashboard
        </button>

        {/* Header */}
        <div className="centro-header">
          <h1 className="centro-title">{centro?.nombre}</h1>
          <p className="centro-subtitle">
            🕐 Horario: {formatHora(centro?.horarioInicio)} – {formatHora(centro?.horarioFin)}
          </p>
        </div>

        {/* Actions */}
        <div className="centro-actions">
          <Link className="centro-btn tertiary" to={`/centros/${centroId}/actividades/nueva`}>
            🎭 Actividad extraescolar
          </Link>
          <Link className="centro-btn" to={`/centros/${centroId}/reservas/nueva`}>
            📅 Nueva reserva
          </Link>
          {user?.rol === 'ADMIN' && (
            <Link className="centro-btn secondary" to={`/centros/${centroId}/profesores/nuevo`}>
              👨‍🏫 Nuevo profesor
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="centro-grid">

          {/* Aulas y reservas */}
          <section className="centro-card">
            <h3>📚 Aulas y reservas</h3>
            {aulas.length === 0 ? (
              <p className="reserva-empty">No hay aulas en este centro.</p>
            ) : (
              <>
                <div className="centro-field">
                  <label className="form-label">Aula</label>
                  <select value={selectedAulaId} onChange={handleChangeAula} className="centro-select">
                    {aulas.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre} {a.capacidad ? `(cap. ${a.capacidad})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="centro-field">
                  <label className="form-label">Fecha</label>
                  <input type="date" value={fecha} onChange={handleChangeFecha} className="centro-input" />
                </div>

                <p style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                  Reservas del día
                </p>

                {reservas.length === 0 ? (
                  <p className="reserva-empty">Sin reservas para la fecha seleccionada.</p>
                ) : (
                  <ul className="reserva-list">
                    {reservas.map(r => (
                      <li key={r.id} className="reserva-item">
                        <span className="hora">{formatHora(r.horaInicio)} – {formatHora(r.horaFin)}</span>
                        <span className="sep">·</span>
                        <span className="asignatura">{r.asignatura || 'Clase'}</span>
                        <span className="estado">{r.estado}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {/* Info del centro */}
          <section className="centro-card">
            <h3>🏫 Información del centro</h3>
            <div className="centro-field">
              <label className="form-label">Nombre</label>
              <div style={{ fontSize: 15, color: '#e0e0e0', fontWeight: 500 }}>{centro?.nombre}</div>
            </div>
            <div className="centro-field">
              <label className="form-label">Dirección</label>
              <div style={{ fontSize: 14, color: '#aaa' }}>{centro?.direccion || '—'}</div>
            </div>
            <div className="centro-field">
              <label className="form-label">Horario</label>
              <div style={{ fontSize: 14, color: '#aaa' }}>
                {formatHora(centro?.horarioInicio)} – {formatHora(centro?.horarioFin)}
              </div>
            </div>
            <div className="centro-field">
              <label className="form-label">Aulas disponibles</label>
              <div style={{ fontSize: 14, color: '#aaa' }}>{aulas.length}</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default CentroDetalle
