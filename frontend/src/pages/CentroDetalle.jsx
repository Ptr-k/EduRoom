import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import authService from '../services/authService'
import centroService from '../services/centroService'
import aulaService from '../services/aulaService'
import reservaService from '../services/reservaService'
import eventoService from '../services/eventoService'
import './CentroDetalle.css'
import './CentroDetalle.admin.css'

function CentroDetalle() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  const [centro, setCentro] = useState(null)
  const [aulas, setAulas] = useState([])
  const [selectedAulaId, setSelectedAulaId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [reservas, setReservas] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estado para el panel de añadir aula (solo ADMIN)
  const [showAddAula, setShowAddAula] = useState(false)
  const [nuevaAulaNombre, setNuevaAulaNombre] = useState('')
  const [nuevaAulaCapacidad, setNuevaAulaCapacidad] = useState('')
  const [addAulaLoading, setAddAulaLoading] = useState(false)
  const [addAulaError, setAddAulaError] = useState('')
  const [addAulaSuccess, setAddAulaSuccess] = useState('')

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
        const [c, listaAulas, listaEventos] = await Promise.all([
          centroService.getCentroById(centroId),
          aulaService.getAulasByCentro(centroId),
          eventoService.getEventosByCentro(centroId)
        ])
        setCentro(c)
        setAulas(listaAulas)
        setEventos(listaEventos)
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

  // ── Añadir aula (solo ADMIN) ──
  const handleAddAula = async (e) => {
    e.preventDefault()
    if (!nuevaAulaNombre.trim()) {
      setAddAulaError('El nombre del aula es obligatorio.')
      return
    }
    try {
      setAddAulaLoading(true)
      setAddAulaError('')
      setAddAulaSuccess('')
      const nueva = await aulaService.crearAula(centroId, {
        nombre: nuevaAulaNombre.trim(),
        capacidad: nuevaAulaCapacidad ? parseInt(nuevaAulaCapacidad) : null
      })
      setAulas(prev => [...prev, nueva])
      if (!selectedAulaId) {
        setSelectedAulaId(String(nueva.id))
        await cargarReservas(nueva.id, fecha)
      }
      setAddAulaSuccess(`Aula "${nueva.nombre}" creada correctamente.`)
      setNuevaAulaNombre('')
      setNuevaAulaCapacidad('')
      setTimeout(() => {
        setAddAulaSuccess('')
        setShowAddAula(false)
      }, 1800)
    } catch (err) {
      console.error(err)
      setAddAulaError(err.response?.data?.error || 'Error al crear el aula.')
    } finally {
      setAddAulaLoading(false)
    }
  }

  const handleEliminarCentro = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este centro? Esta acción eliminará el centro y todo lo asociado a él. No se puede deshacer.')) {
      try {
        await centroService.eliminarCentro(centroId)
        navigate('/dashboard')
      } catch (err) {
        console.error('Error al eliminar centro:', err)
        alert('Hubo un error al eliminar el centro. Por favor, inténtalo de nuevo.')
      }
    }
  }

  const handleEliminarAula = async (aulaId, aulaNombre) => {
    if (!window.confirm(`¿Eliminar el aula "${aulaNombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await aulaService.eliminarAula(aulaId)
      const nuevasAulas = aulas.filter(a => a.id !== aulaId)
      setAulas(nuevasAulas)
      if (String(aulaId) === selectedAulaId) {
        if (nuevasAulas.length > 0) {
          setSelectedAulaId(String(nuevasAulas[0].id))
          await cargarReservas(nuevasAulas[0].id, fecha)
        } else {
          setSelectedAulaId('')
          setReservas([])
        }
      }
    } catch (err) {
      console.error('Error al eliminar aula:', err)
    }
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
        </div>

        {/* Menú de Opciones del Centro (ADMIN) */}
        {user?.rol === 'ADMIN' && (
          <div style={{ marginBottom: '24px', background: '#232333', padding: '20px', borderRadius: '12px', border: '1px solid #3a3a50' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚙️ Opciones del Centro
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link className="centro-btn secondary" to={`/centros/${centroId}/profesores/nuevo`}>
                👨‍🏫 Añadir profesor
              </Link>
              <button 
                className="centro-btn" 
                style={{ background: '#e53935', color: '#fff', border: 'none' }} 
                onClick={handleEliminarCentro}
              >
                🗑️ Eliminar centro
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="centro-grid">

          {/* Aulas y reservas */}
          <section className="centro-card">
            <div className="cd-section-header">
              <h3>📚 Aulas y reservas</h3>
              {user?.rol === 'ADMIN' && (
                <button
                  id="btn-add-aula"
                  className="cd-btn-add-aula"
                  onClick={() => { setShowAddAula(v => !v); setAddAulaError(''); setAddAulaSuccess('') }}
                >
                  {showAddAula ? '✕ Cerrar' : '＋ Añadir aula'}
                </button>
              )}
            </div>

            {/* Panel inline para añadir aula */}
            {showAddAula && user?.rol === 'ADMIN' && (
              <form className="cd-add-aula-panel" onSubmit={handleAddAula}>
                {addAulaError && (
                  <div className="cd-aula-msg cd-aula-msg-error">⚠️ {addAulaError}</div>
                )}
                {addAulaSuccess && (
                  <div className="cd-aula-msg cd-aula-msg-success">✅ {addAulaSuccess}</div>
                )}
                <div className="cd-add-aula-row">
                  <input
                    id="cd-nueva-aula-nombre"
                    type="text"
                    className="centro-input"
                    value={nuevaAulaNombre}
                    onChange={e => setNuevaAulaNombre(e.target.value)}
                    placeholder="Nombre del aula (ej. Aula 1)"
                    style={{ flex: 2 }}
                    autoFocus
                  />
                  <input
                    id="cd-nueva-aula-capacidad"
                    type="number"
                    className="centro-input"
                    value={nuevaAulaCapacidad}
                    onChange={e => setNuevaAulaCapacidad(e.target.value)}
                    placeholder="Capacidad"
                    min="1"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="centro-btn"
                    disabled={addAulaLoading}
                    style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}
                  >
                    {addAulaLoading ? 'Guardando...' : '+ Crear'}
                  </button>
                </div>
              </form>
            )}

            {aulas.length === 0 ? (
              <p className="reserva-empty">No hay aulas en este centro.</p>
            ) : (
              <>
                <div className="centro-field">
                  <label className="form-label">Aula</label>
                  <div className="cd-aula-select-row">
                    <select value={selectedAulaId} onChange={handleChangeAula} className="centro-select" style={{ flex: 1 }}>
                      {aulas.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre} {a.capacidad ? `(cap. ${a.capacidad})` : ''}</option>
                      ))}
                    </select>
                    {user?.rol === 'ADMIN' && selectedAulaId && (
                      <button
                        type="button"
                        className="cd-btn-delete-aula"
                        title="Eliminar esta aula"
                        onClick={() => {
                          const aula = aulas.find(a => String(a.id) === selectedAulaId)
                          if (aula) handleEliminarAula(aula.id, aula.nombre)
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
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
                      <li key={r.id} className="reserva-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/centros/${centroId}/reservas/${r.id}`)}>
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

          {/* Actividades (Eventos) */}
          <section className="centro-card">
            <h3>🎭 Actividades y Eventos</h3>
            {eventos.length === 0 ? (
              <p className="reserva-empty">No hay actividades activas en este centro.</p>
            ) : (
              <ul className="reserva-list">
                {eventos.map(e => (
                  <li key={e.id} className="reserva-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/centros/${centroId}/actividades/${e.id}`)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#e0e0e0', marginBottom: 4 }}>{e.titulo}</div>
                      <div style={{ fontSize: 13, color: '#aaa' }}>
                        {e.lugar} · {e.fecha} · {formatHora(e.horaInicio)} - {formatHora(e.horaFin)}
                      </div>
                    </div>
                    <span style={{ color: '#667eea', fontWeight: 500 }}>Ver detalles →</span>
                  </li>
                ))}
              </ul>
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
