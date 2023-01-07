import React from 'react'
import { usePersistedStore } from './ui/store/store.js'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoutes() {
  const user = usePersistedStore((state) => state.user)
  return user?.username ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
