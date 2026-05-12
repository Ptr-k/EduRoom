import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CentroDetalle from './pages/CentroDetalle'
import CentroNuevo from './pages/CentroNuevo'
import ReservaNueva from './pages/ReservaNueva'
import ActividadNueva from './pages/ActividadNueva'
import ActividadDetalle from './pages/ActividadDetalle'
import ProfesorNuevo from './pages/ProfesorNuevo'
import Configuracion from './pages/Configuracion'
import RegistroAsistencia from './pages/RegistroAsistencia'
import ReservaDetalle from './pages/ReservaDetalle'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/centros/nuevo" element={<CentroNuevo />} />
        <Route path="/centros/:id" element={<CentroDetalle />} />
        <Route path="/centros/:id/reservas/nueva" element={<ReservaNueva />} />
        <Route path="/centros/:id/reservas/:reservaId" element={<ReservaDetalle />} />
        <Route path="/centros/:id/actividades/nueva" element={<ActividadNueva />} />
        <Route path="/centros/:id/actividades/:actividadId" element={<ActividadDetalle />} />
        <Route path="/centros/:id/profesores/nuevo" element={<ProfesorNuevo />} />
        <Route path="/eventos/:qrToken/registro" element={<RegistroAsistencia />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
