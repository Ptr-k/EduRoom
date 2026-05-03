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
      setMessage('Reserva creada correctamente')
      setAsignatura('')
    } catch (e) {
      console.error(e)
      const msg = e.response?.data?.message || 'No se pudo crear la reserva.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="centro-container">
        <h2>Cargando...</h2>
      </div>
    )
  }

  return (
    <div className="centro-container">
      <button className="volver-link centro-back" onClick={() => navigate(`/centros/${centroId}`)}>← Volver al centro</button>

      <div className="centro-card">
        <h2>Nueva reserva</h2>
        <form onSubmit={handleSubmit}>
          <div className="centro-field">
            <label>Aula
              <select className="centro-select" value={selectedAulaId} onChange={(e) => setSelectedAulaId(e.target.value)}>
                <option value="" disabled>Selecciona un aula</option>
                {aulas.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre} {a.capacidad ? `(cap. ${a.capacidad})` : ''}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="centro-field">
            <label>Fecha
              <input className="centro-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </label>
          </div>
          <div className="centro-field">
            <label>Hora inicio
              <input className="centro-input" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </label>
          </div>
          <div className="centro-field">
            <label>Hora fin
              <input className="centro-input" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </label>
          </div>
          <div className="centro-field">
            <label>Asignatura
              <input className="centro-input" type="text" value={asignatura} onChange={(e) => setAsignatura(e.target.value)} placeholder="Ej. Matemáticas" />
            </label>
          </div>

          {error && <div className="mensaje-error">{error}</div>}
          {message && <div className="mensaje-ok">{message}</div>}

          <button className="centro-btn" type="submit" disabled={saving || !selectedAulaId}>
            {saving ? 'Creando...' : 'Crear reserva'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReservaNueva
