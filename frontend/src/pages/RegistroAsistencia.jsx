import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './CentroDetalle.css'

function RegistroAsistencia() {
  const { qrToken } = useParams()
  const [nombreAlumno, setNombreAlumno] = useState('')
  const [estado, setEstado] = useState('formulario') // formulario, cargando, exito, error

  const handleRegistrar = async (e) => {
    e.preventDefault()
    if (!nombreAlumno.trim()) return

    setEstado('cargando')
    try {
      await axios.post(`http://localhost:8080/api/asistencia/registro/${qrToken}`, {
        nombreAlumno
      })
      setEstado('exito')
    } catch (e) {
      console.error(e)
      setEstado('error')
    }
  }

  return (
    <div className="centro-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div className="centro-card" style={{ maxWidth: 400, width: '100%', textAlign: 'center', margin: 'auto' }}>
        
        {estado === 'formulario' && (
          <>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Registro de Asistencia</h3>
            <p style={{ color: '#aaa', marginBottom: 24 }}>Introduce tu nombre para confirmar tu asistencia a la actividad.</p>
            <form onSubmit={handleRegistrar} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="text" 
                className="centro-input" 
                placeholder="Tu nombre completo" 
                value={nombreAlumno}
                onChange={e => setNombreAlumno(e.target.value)}
                required
              />
              <button type="submit" className="centro-btn">Confirmar Asistencia</button>
            </form>
          </>
        )}

        {estado === 'cargando' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 20px auto' }} />
            <h3 style={{ color: '#fff' }}>Registrando asistencia...</h3>
            <p style={{ color: '#aaa' }}>Por favor, espera un momento.</p>
          </>
        )}
        
        {estado === 'exito' && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: '#fff' }}>¡Asistencia Registrada!</h3>
            <p style={{ color: '#aaa' }}>Tu asistencia a esta actividad ha sido confirmada con éxito. ¡Gracias, {nombreAlumno}!</p>
          </>
        )}
        
        {estado === 'error' && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <h3 style={{ color: '#fff' }}>Error en el registro</h3>
            <p style={{ color: '#aaa' }}>El código QR puede haber expirado o no es válido.</p>
            <button className="centro-btn" style={{ marginTop: 16 }} onClick={() => setEstado('formulario')}>Intentar de nuevo</button>
          </>
        )}
      </div>
    </div>
  )
}

export default RegistroAsistencia
