import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import centroService from '../services/centroService'
import aulaService from '../services/aulaService'
import './CentroDetalle.css'
import './CentroNuevo.css'

/**
 * Página para que el ADMIN cree un nuevo Centro educativo
 * y opcionalmente añada aulas en el mismo flujo.
 */
function CentroNuevo() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  // Redirigir si no es ADMIN
  useEffect(() => {
    if (!authService.isAuthenticated() || user?.rol !== 'ADMIN') {
      navigate('/dashboard')
    }
  }, [navigate, user])

  // ── Estado del formulario del centro ──
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [horarioInicio, setHorarioInicio] = useState('08:15')
  const [horarioFin, setHorarioFin] = useState('14:45')

  // ── Estado de aulas a crear ──
  const [aulas, setAulas] = useState([])
  const [aulaNombre, setAulaNombre] = useState('')
  const [aulaCapacidad, setAulaCapacidad] = useState('')

  // ── Estado de UI ──
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState(1) // 1=datos centro, 2=aulas

  // ── Añadir aula a la lista local ──
  const handleAddAula = () => {
    if (!aulaNombre.trim()) return
    setAulas(prev => [...prev, {
      nombre: aulaNombre.trim(),
      capacidad: aulaCapacidad ? parseInt(aulaCapacidad) : null,
      _tempId: Date.now()
    }])
    setAulaNombre('')
    setAulaCapacidad('')
  }

  const handleRemoveAula = (tempId) => {
    setAulas(prev => prev.filter(a => a._tempId !== tempId))
  }

  const handleAulaKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddAula()
    }
  }

  // ── Validar datos del centro antes de pasar al paso 2 ──
  const handleNextStep = (e) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError('El nombre del centro es obligatorio.')
      return
    }
    if (!horarioInicio || !horarioFin) {
      setError('El horario es obligatorio.')
      return
    }
    setError('')
    setStep(2)
  }

  // ── Guardar todo ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Crear el centro
      const centroPayload = {
        nombre: nombre.trim(),
        direccion: direccion.trim() || null,
        horarioInicio,
        horarioFin
      }
      const nuevoCentro = await centroService.crearCentro(centroPayload)

      // 2. Crear las aulas asociadas (si las hay)
      if (aulas.length > 0) {
        await Promise.all(
          aulas.map(a => aulaService.crearAula(nuevoCentro.id, {
            nombre: a.nombre,
            capacidad: a.capacidad
          }))
        )
      }

      setSuccess(`Centro "${nuevoCentro.nombre}" creado correctamente.`)
      setTimeout(() => {
        navigate(`/centros/${nuevoCentro.id}`)
      }, 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Error al crear el centro. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="centro-container">
      {/* Navbar */}
      <nav className="centro-navbar">
        <div className="centro-navbar-brand">
          <div className="brand-dot" />
          <h2>EduRoom</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{user?.nombre}</div>
            <div style={{ fontSize: 12, color: '#667eea', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.rol}</div>
          </div>
          <button className="volver-link" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </nav>

      <div className="centro-content">
        <button className="volver-link" style={{ marginBottom: 28 }} onClick={() => navigate('/dashboard')}>
          ← Volver al dashboard
        </button>

        <div className="centro-header">
          <h1 className="centro-title">🏫 Crear nuevo centro</h1>
          <p className="centro-subtitle">Completa la información del centro educativo</p>
        </div>

        {/* Stepper */}
        <div className="cn-stepper">
          <div className={`cn-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <div className="cn-step-circle">{step > 1 ? '✓' : '1'}</div>
            <span className="cn-step-label">Datos del centro</span>
          </div>
          <div className="cn-step-line" />
          <div className={`cn-step ${step >= 2 ? 'active' : ''}`}>
            <div className="cn-step-circle">2</div>
            <span className="cn-step-label">Aulas</span>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="cn-alert cn-alert-error">⚠️ {error}</div>
        )}
        {success && (
          <div className="cn-alert cn-alert-success">✅ {success}</div>
        )}

        {/* ── PASO 1: Datos del centro ── */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="cn-form-card">
            <div className="cn-section-title">Información del centro</div>

            <div className="centro-field">
              <label className="form-label">Nombre del centro *</label>
              <input
                id="cn-nombre"
                type="text"
                className="centro-input"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej. IES García Lorca"
                required
              />
            </div>

            <div className="centro-field">
              <label className="form-label">Dirección</label>
              <input
                id="cn-direccion"
                type="text"
                className="centro-input"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                placeholder="Ej. Calle Mayor 12, Madrid"
              />
            </div>

            <div className="cn-horario-row">
              <div className="centro-field" style={{ flex: 1 }}>
                <label className="form-label">Hora de inicio *</label>
                <input
                  id="cn-horario-inicio"
                  type="time"
                  className="centro-input"
                  value={horarioInicio}
                  onChange={e => setHorarioInicio(e.target.value)}
                  required
                />
              </div>
              <div className="centro-field" style={{ flex: 1 }}>
                <label className="form-label">Hora de fin *</label>
                <input
                  id="cn-horario-fin"
                  type="time"
                  className="centro-input"
                  value={horarioFin}
                  onChange={e => setHorarioFin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cn-form-actions">
              <button type="button" className="centro-btn secondary" onClick={() => navigate('/dashboard')}>
                Cancelar
              </button>
              <button type="submit" className="centro-btn" id="cn-btn-siguiente">
                Siguiente → Configurar aulas
              </button>
            </div>
          </form>
        )}

        {/* ── PASO 2: Aulas ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="cn-form-card">

            {/* Resumen del centro */}
            <div className="cn-resumen-centro">
              <span className="cn-resumen-icon">🏫</span>
              <div>
                <div className="cn-resumen-nombre">{nombre}</div>
                {direccion && <div className="cn-resumen-dir">{direccion}</div>}
                <div className="cn-resumen-horario">🕐 {horarioInicio} – {horarioFin}</div>
              </div>
              <button type="button" className="cn-edit-btn" onClick={() => setStep(1)}>✏️ Editar</button>
            </div>

            <div className="cn-section-title" style={{ marginTop: 28 }}>Añadir aulas (opcional)</div>
            <p className="cn-section-hint">Puedes añadir aulas ahora o hacerlo más tarde desde el centro.</p>

            {/* Formulario inline de aula */}
            <div className="cn-aula-row">
              <input
                id="cn-aula-nombre"
                type="text"
                className="centro-input"
                value={aulaNombre}
                onChange={e => setAulaNombre(e.target.value)}
                onKeyDown={handleAulaKeyDown}
                placeholder="Nombre del aula (ej. Aula 1)"
                style={{ flex: 2 }}
              />
              <input
                id="cn-aula-capacidad"
                type="number"
                className="centro-input"
                value={aulaCapacidad}
                onChange={e => setAulaCapacidad(e.target.value)}
                onKeyDown={handleAulaKeyDown}
                placeholder="Capacidad"
                min="1"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="centro-btn"
                onClick={handleAddAula}
                style={{ whiteSpace: 'nowrap', padding: '10px 18px' }}
                id="cn-btn-add-aula"
              >
                + Añadir
              </button>
            </div>

            {/* Lista de aulas pendientes */}
            {aulas.length > 0 && (
              <div className="cn-aulas-list">
                {aulas.map((a, i) => (
                  <div key={a._tempId} className="cn-aula-chip" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className="cn-aula-chip-icon">📚</span>
                    <span className="cn-aula-chip-nombre">{a.nombre}</span>
                    {a.capacidad && (
                      <span className="cn-aula-chip-cap">cap. {a.capacidad}</span>
                    )}
                    <button
                      type="button"
                      className="cn-aula-chip-remove"
                      onClick={() => handleRemoveAula(a._tempId)}
                      title="Eliminar aula"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {aulas.length === 0 && (
              <div className="cn-aulas-empty">
                <span>Sin aulas añadidas todavía.</span>
                <span>Puedes crearlas ahora o más tarde desde el centro.</span>
              </div>
            )}

            <div className="cn-form-actions">
              <button type="button" className="centro-btn secondary" onClick={() => setStep(1)}>
                ← Atrás
              </button>
              <button
                type="submit"
                className="centro-btn"
                disabled={loading}
                id="cn-btn-crear"
              >
                {loading
                  ? 'Creando...'
                  : aulas.length > 0
                    ? `🏫 Crear centro con ${aulas.length} aula${aulas.length !== 1 ? 's' : ''}`
                    : '🏫 Crear centro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CentroNuevo
