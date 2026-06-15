import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error: loginError } = await login(email, password)
      if (loginError) {
        setError(loginError.message)
      } else {
        toast.success('Signed in successfully!')
        navigate('/admin')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='form w-100' onSubmit={handleSubmit} noValidate id='kt_login_signin_form'>
      {/* Heading */}
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3' style={{ fontWeight: 700 }}>Sign In to Antux</h1>
        <div className='text-gray-600 fw-bold fs-4'>
          New Here? <span className='text-primary fw-bolder cursor-pointer'>Create an Account</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{error}</div>
        </div>
      )}

      {/* Email */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
        <input
          placeholder='Email'
          type='email'
          name='email'
          autoComplete='off'
          className='form-control bg-transparent'
          style={{ 
            color: '#333', 
            border: '1px solid #ddd', 
            padding: '12px 15px',
            background: '#fff'
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className='fv-row mb-10'>
        <div className='d-flex flex-stack mb-2'>
          <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
          <span className='link-primary fs-6 fw-bolder cursor-pointer' style={{ color: 'var(--color-primary)' }}>
            Forgot Password ?
          </span>
        </div>
        <input
          placeholder='Password'
          type='password'
          name='password'
          autoComplete='off'
          className='form-control bg-transparent'
          style={{ 
            color: '#333', 
            border: '1px solid #ddd', 
            padding: '12px 15px',
            background: '#fff'
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={loading}
          style={{ 
            background: 'var(--color-primary)', 
            border: 'none', 
            padding: '15px', 
            fontWeight: 600,
            borderRadius: '10px'
          }}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}

export default Login
