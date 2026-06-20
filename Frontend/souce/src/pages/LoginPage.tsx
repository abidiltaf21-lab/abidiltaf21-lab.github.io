import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-toastify';
import apiClient from '../lib/apiClient';

// ── Password Strength Calculator ───────────────────────────────────────────────
type StrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';
interface StrengthInfo { level: StrengthLevel; score: number; label: string; color: string; tips: string[] }

function calcPasswordStrength(pwd: string): StrengthInfo {
  if (!pwd) return { level: 'empty', score: 0, label: '', color: 'transparent', tips: [] };

  let score = 0;
  const tips: string[] = [];

  if (pwd.length >= 10)  score += 1; else tips.push('At least 10 characters');
  if (pwd.length >= 14)  score += 1;
  if (/[A-Z]/.test(pwd)) score += 1; else tips.push('Uppercase letter');
  if (/[a-z]/.test(pwd)) score += 1; else tips.push('Lowercase letter');
  if (/[0-9]/.test(pwd)) score += 1; else tips.push('Number (0-9)');
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1; else tips.push('Special character (!@#$...)');
  if (new Set(pwd).size >= 4) score += 1; // unique chars

  const pct = Math.round((score / 7) * 100);

  if (pct < 30) return { level: 'weak',   score: pct, label: 'Weak',   color: '#ef4444', tips };
  if (pct < 55) return { level: 'fair',   score: pct, label: 'Fair',   color: '#f59e0b', tips };
  if (pct < 80) return { level: 'good',   score: pct, label: 'Good',   color: '#3b82f6', tips };
  return           { level: 'strong', score: pct, label: 'Strong', color: '#10b981', tips };
}

// ── Constants ──────────────────────────────────────────────────────────────────
const OTP_TTL_SECONDS = 600; // 10 minutes (matches server Security:OtpExpiryMinutes)

const inputStyle: React.CSSProperties = {
  background:   'rgba(255,255,255,0.08)',
  border:       '1.5px solid rgba(255,255,255,0.12)',
  color:        '#fff',
  padding:      '14px 16px',
  paddingRight: '48px',
  borderRadius: '12px',
  width:        '100%',
  fontSize:     '15px',
  outline:      'none',
  transition:   'border-color 0.2s ease',
  boxSizing:    'border-box',
};

const btnPrimary: React.CSSProperties = {
  padding:       '15px',
  fontSize:      '16px',
  fontWeight:    700,
  borderRadius:  '12px',
  background:    'linear-gradient(135deg, #ffae00, #f54200)',
  border:        'none',
  color:         '#fff',
  cursor:        'pointer',
  width:         '100%',
  transition:    'all 0.25s ease',
  boxShadow:     '0 8px 24px rgba(255,100,0,0.35)',
  letterSpacing: '0.01em',
};

const btnGhost: React.CSSProperties = {
  padding:      '13px',
  fontSize:     '15px',
  fontWeight:   500,
  borderRadius: '12px',
  background:   'rgba(255,255,255,0.07)',
  color:        'rgba(255,255,255,0.75)',
  border:       '1.5px solid rgba(255,255,255,0.12)',
  cursor:       'pointer',
  width:        '100%',
  transition:   'all 0.2s ease',
};

const toggleBtnStyle: React.CSSProperties = {
  position:        'absolute',
  right:           '14px',
  top:             '50%',
  transform:       'translateY(-50%)',
  background:      'none',
  border:          'none',
  color:           'rgba(255,255,255,0.45)',
  cursor:          'pointer',
  padding:         '4px',
  outline:         'none',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
};

const labelStyle: React.CSSProperties = {
  color:        'rgba(255,255,255,0.75)',
  marginBottom: '8px',
  display:      'block',
  fontSize:     '13.5px',
  fontWeight:   600,
  letterSpacing:'0.01em',
};

// ── PasswordInput helper ───────────────────────────────────────────────────────
const PasswordInput: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; id?: string;
}> = ({ value, onChange, placeholder = '••••••••', id }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        autoComplete="new-password"
      />
      <button type="button" style={toggleBtnStyle} onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
        <i className={show ? 'fas fa-eye-slash' : 'fas fa-eye'} style={{ fontSize: '15px' }} />
      </button>
    </div>
  );
};

// ── PasswordStrengthBar ────────────────────────────────────────────────────────
const PasswordStrengthBar: React.FC<{ password: string }> = ({ password }) => {
  const info = calcPasswordStrength(password);
  if (info.level === 'empty') return null;

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Password Strength
        </span>
        <span style={{ fontSize: '11.5px', fontWeight: 700, color: info.color }}>
          {info.label}
        </span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${info.score}%`,
          background: info.color,
          borderRadius: '99px',
          transition: 'width 0.4s ease, background 0.3s ease',
          boxShadow: `0 0 8px ${info.color}80`,
        }} />
      </div>
      {info.tips.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {info.tips.map(tip => (
            <span key={tip} style={{
              fontSize: '10.5px', fontWeight: 600,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px', padding: '2px 8px', color: 'rgba(255,255,255,0.45)',
            }}>
              + {tip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── OTP Countdown Timer ────────────────────────────────────────────────────────
const OtpCountdown: React.FC<{ totalSeconds: number; onExpire: () => void }> = ({ totalSeconds, onExpire }) => {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); onExpire(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [totalSeconds, onExpire]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const pct  = (remaining / totalSeconds) * 100;
  const color = remaining > 120 ? '#10b981' : remaining > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div style={{
        display:        'inline-flex', flexDirection: 'column', alignItems: 'center',
        background:     'rgba(255,255,255,0.04)', border: `1.5px solid ${color}40`,
        borderRadius:   '14px', padding: '12px 24px', gap: '6px',
      }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          OTP Expires In
        </div>
        <div style={{ fontSize: '28px', fontWeight: 800, color, letterSpacing: '0.08em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {mins}:{secs}
        </div>
        <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 1s linear, background 0.5s ease' }} />
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════════
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // View management
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');

  // Login lockout state
  const [lockoutInfo, setLockoutInfo] = useState<{ isLockedOut: boolean; minutes: number; attemptsRemaining?: number } | null>(null);

  // OTP / Reset states
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetOption, setShowResetOption] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);  // timestamp when OTP was sent
  const [otpExpired, setOtpExpired] = useState(false);

  // ── LOGIN HANDLER ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockoutInfo(null);
    setSubmitting(true);
    try {
      const { data, error } = await login(email, password);

      if (error) {
        const resp = (error as any)?.response?.data;

        if (resp?.isLockedOut) {
          setLockoutInfo({ isLockedOut: true, minutes: resp.retryAfterMinutes ?? 15 });
          toast.error(`Account locked. Try again in ${resp.retryAfterMinutes ?? 15} minute(s).`);
          return;
        }

        if (resp?.attemptsRemaining !== undefined) {
          setLockoutInfo({ isLockedOut: false, minutes: 0, attemptsRemaining: resp.attemptsRemaining });
        }

        toast.error(resp?.message || error.message || 'Invalid credentials');
        setShowResetOption(true);
        return;
      }

      if (data?.token) {
        setLockoutInfo(null);
        setShowResetOption(false);
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (err: any) {
      const resp = err?.response?.data;
      if (resp?.isLockedOut) {
        setLockoutInfo({ isLockedOut: true, minutes: resp.retryAfterMinutes ?? 15 });
      }
      toast.error(resp?.message || 'An unexpected error occurred');
      setShowResetOption(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── REQUEST OTP HANDLER ──────────────────────────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address first.'); return; }
    setSubmitting(true);
    setOtpExpired(false);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      toast.success(response.data.message || 'OTP sent! Please check your email.');
      setOtpSentAt(Date.now());
      setView('reset');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to send OTP.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── RESET PASSWORD HANDLER ───────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpExpired) { toast.error('OTP has expired. Please request a new one.'); return; }
    if (otp.length !== 6) { toast.error('OTP must be exactly 6 digits.'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match.'); return; }

    const strength = calcPasswordStrength(newPassword);
    if (strength.level === 'weak') {
      toast.error('Password is too weak. Please make it stronger.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post('/auth/reset-password-otp', { email, otp, newPassword });
      toast.success(response.data.message || 'Password reset successfully!');
      setPassword('');
      setView('login');
      setShowResetOption(false);
      setLockoutInfo(null);
      setOtpSentAt(null);
    } catch (err: any) {
      const resp   = err.response?.data;
      const msg    = resp?.message || 'Failed to reset password. Please check the OTP.';
      if (resp?.otpExpired) { setOtpExpired(true); }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpExpired = useCallback(() => setOtpExpired(true), []);

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 20% 20%, rgba(255,174,0,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(245,66,0,0.10) 0%, transparent 55%), #08090f',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '24px',
    }}>
      <div style={{
        background:     'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px) saturate(180%)',
        padding:        '44px 40px',
        borderRadius:   '24px',
        width:          '100%',
        maxWidth:       '440px',
        boxShadow:      '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
        border:         '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #ffae00, #f54200)', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255,100,0,0.4)',
          }}>
            <i className="fas fa-shield-alt" style={{ color: '#fff', fontSize: '20px' }} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {view === 'login' ? 'Admin Login' : view === 'forgot' ? 'Reset Password' : 'Verify OTP'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13.5px', margin: 0 }}>
            {view === 'login'  ? 'Enter credentials to access the admin panel'
           : view === 'forgot' ? "We'll send a 6-digit OTP to your email"
           : `OTP sent to ${email}`}
          </p>
        </div>

        {/* ── VIEW: LOGIN ── */}
        {view === 'login' && (
          <form onSubmit={handleSubmit} autoComplete="on">
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="login-email" style={labelStyle}>Email Address</label>
              <input
                id="login-email"
                type="email"
                style={inputStyle}
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor="login-password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: '#ffae00', cursor: 'pointer', fontSize: '12.5px', fontWeight: 700, padding: 0 }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type="password"
                  style={inputStyle}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Lockout / Attempts warning */}
            {lockoutInfo && (
              <div style={{
                marginBottom: '16px', padding: '14px 16px', borderRadius: '12px',
                background: lockoutInfo.isLockedOut ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                border: `1.5px solid ${lockoutInfo.isLockedOut ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
              }}>
                {lockoutInfo.isLockedOut ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <i className="fas fa-lock" style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#f87171', fontWeight: 700, fontSize: '13.5px', marginBottom: '2px' }}>Account Temporarily Locked</div>
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12.5px' }}>
                        Too many failed attempts. Try again in <strong style={{ color: '#f87171' }}>{lockoutInfo.minutes} minute(s)</strong>.
                      </div>
                    </div>
                  </div>
                ) : lockoutInfo.attemptsRemaining !== undefined ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '13.5px', marginBottom: '2px' }}>Invalid Password</div>
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12.5px' }}>
                        {lockoutInfo.attemptsRemaining > 0
                          ? <><strong style={{ color: '#fbbf24' }}>{lockoutInfo.attemptsRemaining}</strong> attempt(s) remaining before lockout.</>
                          : 'Account will be locked on the next failed attempt.'}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Forgot password hint */}
            {showResetOption && !lockoutInfo?.isLockedOut && (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <button type="button" onClick={() => setView('forgot')} style={{ background: 'none', border: 'none', color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Reset your password via OTP →
                </button>
              </div>
            )}

            <button type="submit" style={{ ...btnPrimary, marginTop: '8px', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }} />Signing in...</> : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── VIEW: FORGOT PASSWORD ── */}
        {view === 'forgot' && (
          <form onSubmit={handleRequestOtp}>
            <div style={{ marginBottom: '22px' }}>
              <label htmlFor="forgot-email" style={labelStyle}>Email Address</label>
              <input
                id="forgot-email"
                type="email"
                style={inputStyle}
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" style={{ ...btnPrimary, marginBottom: '12px', opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
              {submitting ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }} />Sending OTP...</> : <><i className="fas fa-paper-plane" style={{ marginRight: '8px' }} />Send OTP Code</>}
            </button>
            <button type="button" style={btnGhost} onClick={() => setView('login')}>
              ← Back to Login
            </button>
          </form>
        )}

        {/* ── VIEW: RESET (OTP + New Password) ── */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword}>
            {/* OTP Countdown */}
            {otpSentAt && !otpExpired && (
              <OtpCountdown
                totalSeconds={OTP_TTL_SECONDS}
                onExpire={handleOtpExpired}
              />
            )}

            {otpExpired && (
              <div style={{ marginBottom: '18px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.25)', textAlign: 'center' }}>
                <i className="fas fa-clock" style={{ color: '#ef4444', marginRight: '8px' }} />
                <span style={{ color: '#f87171', fontWeight: 600, fontSize: '13px' }}>OTP has expired.</span>
                <button type="button" onClick={() => setView('forgot')} style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '13px', fontWeight: 700, textDecoration: 'underline' }}>
                  Request a new OTP
                </button>
              </div>
            )}

            {/* OTP Input */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="otp-input" style={labelStyle}>6-Digit OTP Code</label>
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                style={{ ...inputStyle, letterSpacing: '10px', textAlign: 'center', fontSize: '22px', fontWeight: 800, paddingRight: '16px' }}
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoComplete="one-time-code"
              />
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '8px' }}>
              <label htmlFor="new-password" style={labelStyle}>New Password</label>
              <PasswordInput id="new-password" value={newPassword} onChange={setNewPassword} placeholder="New Password (min 10 chars)" />
              <PasswordStrengthBar password={newPassword} />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '22px', marginTop: '16px' }}>
              <label htmlFor="confirm-password" style={labelStyle}>Confirm New Password</label>
              <PasswordInput id="confirm-password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm New Password" />
              {confirmPassword && newPassword !== confirmPassword && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-times-circle" /> Passwords do not match
                </div>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-check-circle" /> Passwords match
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{ ...btnPrimary, marginBottom: '12px', opacity: (submitting || otpExpired) ? 0.6 : 1 }}
              disabled={submitting || otpExpired}
            >
              {submitting
                ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }} />Resetting...</>
                : <><i className="fas fa-key" style={{ marginRight: '8px' }} />Reset Password</>}
            </button>
            <button type="button" style={btnGhost} onClick={() => { setView('login'); setOtpSentAt(null); setOtpExpired(false); }}>
              Cancel
            </button>
          </form>
        )}

        {/* Footer */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
