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
  const [horaInicio, setHoraInicio] = useState('09:00')
  const [horaFin, setHoraFin] = useState('10:00')
  const [asignatura, setAsignatura] = useState('')
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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
          const first = String(listaAulas[0].id)
          setSelectedAulaId(first)
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
      setError('Error al cargar las reservas del aula seleccionada.')
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

  const validarHoras = (ini, fin) => {
    // comparar HH:MM
    return ini < fin
  }

  const handleCrearReserva = async (e) => {
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
      setMessage('Reserva creada correctamente')
      setAsignatura('')
      await cargarReservas(Number(selectedAulaId), fecha)
    } catch (e) {
      console.error(e)
      const msg = e.response?.data?.message || 'No se pudo crear la reserva.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const formatHora = (hora) => {
    if (!hora) return '--:--'
    if (typeof hora === 'string') return hora.slice(0,5)
    if (Array.isArray(hora)) {
      return `${String(hora[0]).padStart(2, '0')}:${String(hora[1]).padStart(2, '0')}`
    }
    return '--:--'
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Cargando centro...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Centro</h2>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    )
  }

  return (
    <div className="centro-container">
      <button className="volver-link centro-back" onClick={() => navigate('/dashboard')}>← Volver</button>

      <div className="centro-header">
        <div>
          <h1 className="centro-title">{centro?.nombre}</h1>
          <p className="centro-subtitle">Horario: {formatHora(centro?.horarioInicio)} - {formatHora(centro?.horarioFin)}</p>
        </div>
      </div>

      <div className="centro-actions">
        <Link className="centro-btn tertiary" to={`/centros/${centroId}/actividades/nueva`}>Crear actividad extraescolar</Link>
        <Link className="centro-btn" to={`/centros/${centroId}/reservas/nueva`}>Crear reserva</Link>
        <Link className="centro-btn secondary" to={`/centros/${centroId}/profesores/nuevo`}>Crear profesor</Link>
      </div>

      <div className="centro-grid">
        <section className="centro-card">
          <h3>Aulas y reservas</h3>
          {aulas.length === 0 ? (
            <p>No hay aulas en este centro.</p>
          ) : (
            <>
              <label>
                Aula:
                <select value={selectedAulaId} onChange={handleChangeAula} className="centro-select">
                  {aulas.map(a => (
                    <option key={a.id} value={a.id}>{a.nombre} (cap. {a.capacidad || '-'})</option>
                  ))}
                </select>
              </label>

              <div className="centro-field">
                <label>
                  Fecha:
                  <input type="date" value={fecha} onChange={handleChangeFecha} className="centro-input" />
                </label>
              </div>

              <h4>Reservas para el aula seleccionada</h4>
              {reservas.length === 0 ? (
                <p className="reserva-empty">Sin reservas para la fecha seleccionada.</p>
              ) : (
                <ul className="reserva-list">
                  {reservas.map(r => (
                    <li key={r.id}>
                      {formatHora(r.horaInicio)} - {formatHora(r.horaFin)} · {r.asignatura || 'Clase'} · {r.profesor?.nombre || 'Profesor'} ({r.estado})
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  )
}

export default CentroDetalle
