import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { pb } from './ui/pocketbase.js'

function PrivateRoutes() {
  return pb.authStore.isValid ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
