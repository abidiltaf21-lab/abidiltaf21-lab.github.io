import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import AuthLayout from './AuthLayout'

const AuthPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
        {/* You can add Registration, Forgot Password, etc. here */}
        <Route index element={<Login />} />
        <Route path='*' element={<Navigate to='/auth/login' />} />
      </Route>
    </Routes>
  )
}

export { AuthPage }
