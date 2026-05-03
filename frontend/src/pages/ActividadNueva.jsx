import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './CentroDetalle.css'

function ActividadNueva() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  return (
    <div className="centro-container">
      <button className="volver-link centro-back" onClick={() => navigate(`/centros/${centroId}`)}>← Volver al centro</button>

      <div className="centro-card">
        <h2>Nueva actividad extraescolar</h2>
        <p className="reserva-empty">Pendiente de implementar el formulario. Aquí podrás crear una actividad extraescolar asociada a este centro.</p>
      </div>
    </div>
  )
}

export default ActividadNueva
