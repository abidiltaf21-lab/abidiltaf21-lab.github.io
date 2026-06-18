import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const ProfileManager: React.FC = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({ userName: '', email: '' });
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Sync profile data from user context or localStorage
    useEffect(() => {
        const resolveUser = () => {
            if (user) return user;
            const savedUser = localStorage.getItem('adminUser');
            return savedUser ? JSON.parse(savedUser) : null;
        };
        const u = resolveUser();
        if (u) {
            setProfileData({
                userName: u.userName || u.UserName || '',
                email: u.email || u.Email || '',
            });
        }
    }, [user]);

    const getUserId = (): string | null => {
        // Check context first
        const sources = [user];
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            try { sources.push(JSON.parse(savedUser)); } catch (_e) { /* ignore parse error */ }
        }

        for (const src of sources) {
            if (!src) continue;
            const id = src.Id || src.id || src.userId || src.UserId || src.sub;
            if (id) return String(id);
        }

        // Last resort: try JWT token claims
        const token = localStorage.getItem('adminToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const id = payload.UserId || payload.userId || payload.sub || payload.nameid;
                if (id) return String(id);
            } catch (_e) { /* ignore decode error */ }
        }

        return null;
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = getUserId();

        if (!userId) {
            toast.error('Session error: Could not retrieve user ID. Please log out and log in again.');
            return;
        }

        try {
            setProfileLoading(true);
            await apiService.updateProfile(userId, {
                UserName: profileData.userName,
                Email: profileData.email
            });
            toast.success('Profile updated successfully! Log out and back in to see changes.');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data || 'Update failed';
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = getUserId();

        if (!userId) {
            toast.error('Session error: Could not verify user identity.');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Passwords do not match. Please try again.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        try {
            setPasswordLoading(true);
            await apiService.updatePassword(userId, { Password: passwords.newPassword });
            toast.success('Password updated successfully! Use your new password next time you log in.');
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error('Password update failed. Must include Uppercase, Lowercase, Number, and Special Character.');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="animate-fade-in p-2">
            <div className="admin-page-header mb-5">
                <div>
                    <h2 className="admin-title fw-900 fs-2" style={{ letterSpacing: '-1px' }}>Security & Profile</h2>
                    <p className="admin-subtitle text-muted">Update your identity and security credentials.</p>
                </div>
            </div>

            <div className="row g-5">
                {/* Identity Card */}
                <div className="col-lg-6">
                    <div className="profile-glass-card p-5">
                        <h4 className="fw-800 mb-4 text-white d-flex align-items-center">
                            <span className="icon-badge-blue me-3"><i className="fas fa-id-card"></i></span>
                            Identity Sync
                        </h4>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-4">
                                <label className="admin-label-modern">Username</label>
                                <input
                                    type="text"
                                    className="admin-input-modern"
                                    value={profileData.userName}
                                    onChange={(e) => setProfileData({ ...profileData, userName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="admin-label-modern">Email Address</label>
                                <input
                                    type="email"
                                    className="admin-input-modern"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn-modern-primary w-100 mt-3" type="submit" disabled={profileLoading}>
                                {profileLoading ? <><i className="fas fa-sync fa-spin me-2"></i>Saving...</> : 'Synchronize Identity'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Password Card */}
                <div className="col-lg-6">
                    <div className="profile-glass-card p-5">
                        <h4 className="fw-800 mb-4 text-white d-flex align-items-center">
                            <span className="icon-badge-purple me-3"><i className="fas fa-key"></i></span>
                            Security Key
                        </h4>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-4">
                                <label className="admin-label-modern">New Password</label>
                                <div className="password-input-wrap">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        className="admin-input-modern"
                                        placeholder="••••••••••••"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        required
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowNew(v => !v)}>
                                        <i className={`fas ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="admin-label-modern">Confirm Password</label>
                                <div className="password-input-wrap">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        className="admin-input-modern"
                                        placeholder="••••••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        required
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)}>
                                        <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <button className="btn-modern-purple w-100 mt-3" type="submit" disabled={passwordLoading}>
                                {passwordLoading ? <><i className="fas fa-sync fa-spin me-2"></i>Updating...</> : 'Update Security Key'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 30px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    transition: all 0.4s ease;
                }
                .profile-glass-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-5px);
                }
                .admin-label-modern {
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #8b5cf6;
                    margin-bottom: 12px;
                    display: block;
                }
                .admin-input-modern {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    width: 100%;
                    padding: 16px 24px;
                    border-radius: 18px;
                    font-size: 15px;
                    transition: all 0.3s;
                }
                .admin-input-modern:focus {
                    border-color: #8b5cf6;
                    background: rgba(0, 0, 0, 0.4);
                    outline: none;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
                }
                .password-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .password-input-wrap .admin-input-modern {
                    padding-right: 52px;
                }
                .eye-btn {
                    position: absolute;
                    right: 18px;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.4);
                    font-size: 16px;
                    cursor: pointer;
                    transition: color 0.2s;
                    padding: 0;
                    line-height: 1;
                }
                .eye-btn:hover { color: #8b5cf6; }
                .btn-modern-primary {
                    background: #4f46e5;
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 18px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .btn-modern-primary:hover:not(:disabled) {
                    background: #4338ca;
                    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
                }
                .btn-modern-purple {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 18px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .btn-modern-purple:hover:not(:disabled) {
                    background: #7c3aed;
                    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
                }
                .btn-modern-primary:disabled,
                .btn-modern-purple:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .icon-badge-blue {
                    width: 40px; height: 40px;
                    background: rgba(79, 70, 229, 0.2);
                    color: #6366f1;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 12px;
                }
                .icon-badge-purple {
                    width: 40px; height: 40px;
                    background: rgba(139, 92, 246, 0.2);
                    color: #a78bfa;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 12px;
                }
            `}</style>
        </div>
    );
};

export default ProfileManager;
