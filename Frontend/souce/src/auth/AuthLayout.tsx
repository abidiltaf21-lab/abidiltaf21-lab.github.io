import React, { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed' 
         style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1e2d 0%, #151521 100%)' }}>
      
      {/* Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* Logo */}
        <Link to='/' className='mb-12'>
          <img alt='Logo' src='/assets/img/logo/logo-light.png' className='h-45px' style={{ maxHeight: '60px' }} />
        </Link>

        {/* Wrapper */}
        <div className='w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto' 
             style={{ 
               background: 'rgba(255, 255, 255, 0.03)', 
               backdropFilter: 'blur(10px)', 
               border: '1px solid rgba(255, 255, 255, 0.1)',
               width: '100%',
               maxWidth: '500px'
             }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <Link to='#' className='text-muted text-hover-primary px-2'>About</Link>
          <Link to='#' className='text-muted text-hover-primary px-2'>Contact</Link>
          <Link to='#' className='text-muted text-hover-primary px-2'>Contact Us</Link>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
