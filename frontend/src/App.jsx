import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CentroDetalle from './pages/CentroDetalle'
import ReservaNueva from './pages/ReservaNueva'
import ActividadNueva from './pages/ActividadNueva'
import ProfesorNuevo from './pages/ProfesorNuevo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/centros/:id" element={<CentroDetalle />} />
        <Route path="/centros/:id/reservas/nueva" element={<ReservaNueva />} />
        <Route path="/centros/:id/actividades/nueva" element={<ActividadNueva />} />
        <Route path="/centros/:id/profesores/nuevo" element={<ProfesorNuevo />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
