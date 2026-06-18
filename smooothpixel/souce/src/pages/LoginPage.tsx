import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await login(email, password);
      
      if (error) {
        toast.error(error.message || 'Invalid credentials');
        return;
      }

      if (data && data.token) {
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
    }}>
      <div className="login-card" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '50px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="text-center mb-40">
          <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '700' }}>Admin Login</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Enter your credentials to access the panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-20">
            <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                color: '#fff', 
                padding: '15px',
                borderRadius: '10px'
              }}
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-30">
            <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px', display: 'block' }}>Password</label>
            <input 
              type="password" 
              className="form-control" 
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                color: '#fff', 
                padding: '15px',
                borderRadius: '10px'
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={submitting}
            style={{ 
              padding: '15px', 
              fontSize: '18px', 
              fontWeight: '600', 
              borderRadius: '10px',
              background: 'var(--color-primary)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-30 text-center">
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
