import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './CentroDetalle.css'

function ProfesorNuevo() {
  const { id } = useParams()
  const centroId = Number(id)
  const navigate = useNavigate()

  return (
    <div className="centro-container">
      <button className="volver-link centro-back" onClick={() => navigate(`/centros/${centroId}`)}>← Volver al centro</button>

      <div className="centro-card">
        <h2>Crear profesor</h2>
        <p className="reserva-empty">Pendiente de implementar el formulario. Aquí podrás crear un profesor asociado a este centro.</p>
      </div>
    </div>
  )
}

export default ProfesorNuevo
