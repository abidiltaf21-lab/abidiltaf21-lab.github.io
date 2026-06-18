import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

const TeamManager: React.FC = () => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentMember, setCurrentMember] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education'>('basic');

    // Local form data
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        bio: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        skills: '',
        resumeEntries: [] as any[]
    });

    // Sub-forms — one state PER tab so they never bleed into each other
    const [showExpForm, setShowExpForm] = useState(false);
    const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);

    const [showEduForm, setShowEduForm] = useState(false);
    const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null);

    const emptyEntry = (type: 'experience' | 'education') => ({
        id: 0,
        type,
        title: '',
        subtitle: '',
        dateRange: '',
        description: '',
        sortOrder: 0,
        isActive: true
    });

    const [expForm, setExpForm] = useState(emptyEntry('experience'));
    const [eduForm, setEduForm] = useState(emptyEntry('education'));

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getTeam();
            const normalized = data.map((m: any) => ({
                id: m.id || m.Id || m._id,
                name: m.name || m.Name || '',
                role: m.role || m.Role || '',
                image: m.image || m.Image || '',
                bio: m.bio || m.Bio || '',
                twitter: m.twitter || m.Twitter || '',
                linkedin: m.linkedin || m.Linkedin || '',
                instagram: m.instagram || m.Instagram || '',
                skills: m.skills || m.Skills || '',
                resumeEntries: m.resumeEntries || m.ResumeEntries || []
            }));
            setMembers(normalized);
        } catch (err) {
            console.error("Failed to fetch team:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk';

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'smooothpixel_upload');

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: uploadData
        })
        .then(res => res.json())
        .then(data => {
            if (data.secure_url) {
                setFormData(prev => ({ ...prev, image: data.secure_url }));
            } else {
                alert("Upload failed: " + (data.error?.message || JSON.stringify(data)));
            }
        })
        .catch(err => alert("Upload error: " + err.message))
        .finally(() => setIsUploading(false));
    };

    const handleEdit = (member: any) => {
        setCurrentMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            image: member.image,
            bio: member.bio,
            twitter: member.twitter,
            linkedin: member.linkedin,
            instagram: member.instagram,
            skills: member.skills,
            resumeEntries: [...(member.resumeEntries || [])]
        });
        setActiveTab('basic');
        setShowExpForm(false);
        setShowEduForm(false);
        setEditingExpIdx(null);
        setEditingEduIdx(null);
        setExpForm(emptyEntry('experience'));
        setEduForm(emptyEntry('education'));
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentMember(null);
        setFormData({
            name: '',
            role: '',
            image: '',
            bio: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            skills: '',
            resumeEntries: []
        });
        setActiveTab('basic');
        setShowExpForm(false);
        setShowEduForm(false);
        setEditingExpIdx(null);
        setEditingEduIdx(null);
        setExpForm(emptyEntry('experience'));
        setEduForm(emptyEntry('education'));
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                id: currentMember ? currentMember.id : 0
            };
            if (currentMember) {
                await apiService.updateTeamMember(currentMember.id, payload);
            } else {
                await apiService.addTeamMember(payload);
            }
            setShowModal(false);
            fetchTeam();
        } catch (err: any) {
            console.error("Team save error:", err);
            const serverMessage = err?.response?.data || err?.message || "Failed to save member details.";
            alert(typeof serverMessage === 'string' ? serverMessage : "Failed to save member details.");
        }
    };

    const handleDelete = async (id: string | number) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await apiService.deleteTeamMember(String(id));
                setMembers(prev => prev.filter(m => m.id !== id));
            } catch (err) {
                alert("Failed to delete member");
            }
        }
    };

    // ── Experience entry handlers ────────────────────────────────────
    const openAddExp = () => {
        setEditingExpIdx(null);
        setExpForm({
            ...emptyEntry('experience'),
            sortOrder: experienceEntries.length + 1
        });
        setShowExpForm(true);
    };

    const openEditExp = (idx: number) => {
        const item = formData.resumeEntries[idx];
        setEditingExpIdx(idx);
        setExpForm({
            id: item.id || item.Id || 0,
            type: 'experience',
            title: item.title || item.Title || '',
            subtitle: item.subtitle || item.Subtitle || '',
            dateRange: item.dateRange || item.DateRange || '',
            description: item.description || item.Description || '',
            sortOrder: item.sortOrder ?? item.SortOrder ?? 0,
            isActive: item.isActive ?? item.IsActive ?? true
        });
        setShowExpForm(true);
    };

    const saveExpLocally = () => {
        if (!expForm.title.trim() || !expForm.subtitle.trim() || !expForm.dateRange.trim()) {
            alert('Please fill in Title, Company and Date Range.');
            return;
        }
        const payload = { ...expForm, type: 'experience' as const, title: expForm.title.trim(), subtitle: expForm.subtitle.trim(), dateRange: expForm.dateRange.trim(), description: expForm.description.trim() };
        const updatedEntries = [...formData.resumeEntries];
        if (editingExpIdx !== null) {
            updatedEntries[editingExpIdx] = payload;
        } else {
            updatedEntries.push(payload);
        }
        updatedEntries.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setFormData(prev => ({ ...prev, resumeEntries: updatedEntries }));
        setShowExpForm(false);
        setEditingExpIdx(null);
        setExpForm(emptyEntry('experience'));
    };

    const deleteExpLocally = (idx: number) => {
        if (!window.confirm('Remove this experience entry?')) return;
        const updatedEntries = formData.resumeEntries.filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, resumeEntries: updatedEntries }));
        if (editingExpIdx === idx) { setShowExpForm(false); setEditingExpIdx(null); }
    };

    // ── Education entry handlers ─────────────────────────────────────
    const openAddEdu = () => {
        setEditingEduIdx(null);
        setEduForm({
            ...emptyEntry('education'),
            sortOrder: educationEntries.length + 1
        });
        setShowEduForm(true);
    };

    const openEditEdu = (idx: number) => {
        const item = formData.resumeEntries[idx];
        setEditingEduIdx(idx);
        setEduForm({
            id: item.id || item.Id || 0,
            type: 'education',
            title: item.title || item.Title || '',
            subtitle: item.subtitle || item.Subtitle || '',
            dateRange: item.dateRange || item.DateRange || '',
            description: item.description || item.Description || '',
            sortOrder: item.sortOrder ?? item.SortOrder ?? 0,
            isActive: item.isActive ?? item.IsActive ?? true
        });
        setShowEduForm(true);
    };

    const saveEduLocally = () => {
        if (!eduForm.title.trim() || !eduForm.subtitle.trim() || !eduForm.dateRange.trim()) {
            alert('Please fill in Title, Institution and Date Range.');
            return;
        }
        const payload = { ...eduForm, type: 'education' as const, title: eduForm.title.trim(), subtitle: eduForm.subtitle.trim(), dateRange: eduForm.dateRange.trim(), description: eduForm.description.trim() };
        const updatedEntries = [...formData.resumeEntries];
        if (editingEduIdx !== null) {
            updatedEntries[editingEduIdx] = payload;
        } else {
            updatedEntries.push(payload);
        }
        updatedEntries.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setFormData(prev => ({ ...prev, resumeEntries: updatedEntries }));
        setShowEduForm(false);
        setEditingEduIdx(null);
        setEduForm(emptyEntry('education'));
    };

    const deleteEduLocally = (idx: number) => {
        if (!window.confirm('Remove this education entry?')) return;
        const updatedEntries = formData.resumeEntries.filter((_, i) => i !== idx);
        setFormData(prev => ({ ...prev, resumeEntries: updatedEntries }));
        if (editingEduIdx === idx) { setShowEduForm(false); setEditingEduIdx(null); }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    // Filter timeline entries for UI lists
    const experienceEntries = formData.resumeEntries.map((e, idx) => ({ ...e, originalIndex: idx }))
        .filter(e => (e.type || e.Type || 'experience').toLowerCase() === 'experience');

    const educationEntries = formData.resumeEntries.map((e, idx) => ({ ...e, originalIndex: idx }))
        .filter(e => (e.type || e.Type || 'experience').toLowerCase() === 'education');

    return (
        <div className="animate-fade-in">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-title">Team Roster</h2>
                    <p className="admin-subtitle">Manage your creative talent, their public profiles, and unique resumes.</p>
                </div>
                <button className="btn-admin-primary" onClick={handleAdd}>
                    <i className="fas fa-user-plus me-2"></i> Add Member
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="text-center p-5">Loading Team...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Role</th>
                                    <th>Bio</th>
                                    <th>Timeline Items</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img 
                                                    src={member.image || 'https://via.placeholder.com/150'} 
                                                    className="rounded-circle" 
                                                    style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', objectFit: 'cover' }}
                                                    alt="" 
                                                />
                                                <span className="fw-700">{member.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge bg-soft-primary">{member.role}</span></td>
                                        <td><p className="m-0 text-truncate" style={{maxWidth: '200px'}}>{member.bio}</p></td>
                                        <td>
                                            <span className="badge rounded-pill text-bg-dark border border-secondary px-2">
                                                {(member.resumeEntries || []).length} items
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn-action edit" onClick={() => handleEdit(member)} title="Edit profile & resume"><i className="fas fa-edit"></i></button>
                                                <button className="btn-action delete" onClick={() => handleDelete(member.id)} title="Delete member"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content glass-panel p-4 animate-scale-up" style={{ maxWidth: '900px', width: '95%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                            <h4 className="text-white m-0">
                                {currentMember ? `Edit ${formData.name}'s Profile` : 'Register Creative Talent'}
                            </h4>
                            <button className="btn-close-v2" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="premium-tabs d-flex gap-2 mb-4 border-bottom border-dark pb-2">
                            <button 
                                type="button" 
                                className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                                onClick={() => setActiveTab('basic')}
                            >
                                <i className="fas fa-user-circle me-1"></i> Basic Info
                            </button>
                            <button 
                                type="button" 
                                className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                                onClick={() => setActiveTab('experience')}
                            >
                                <i className="fas fa-briefcase me-1"></i> Expertise ({experienceEntries.length})
                            </button>
                            <button 
                                type="button" 
                                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                                onClick={() => setActiveTab('education')}
                            >
                                <i className="fas fa-graduation-cap me-1"></i> Education ({educationEntries.length})
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave}>
                            {activeTab === 'basic' && (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label-premium">Full Name</label>
                                        <input 
                                            type="text" required className="form-input-premium" 
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label-premium">Expertise Role</label>
                                        <input 
                                            type="text" required className="form-input-premium" 
                                            value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label-premium">Skills (comma-separated)</label>
                                        <input 
                                            type="text" className="form-input-premium" 
                                            placeholder="After Effects, Cinema 4D, Lottie"
                                            value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label-premium">Avatar / Video URL</label>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="text" className="form-input-premium" 
                                                placeholder="URL or Uploaded Link"
                                                value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} 
                                            />
                                            <button 
                                                type="button" 
                                                className="btn-admin-secondary px-3"
                                                disabled={isUploading}
                                                onClick={() => document.getElementById('team-file-upload-dialog')?.click()}
                                            >
                                                {isUploading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-upload"></i>}
                                            </button>
                                            <input 
                                                type="file" 
                                                id="team-file-upload-dialog" 
                                                hidden 
                                                accept="image/*,video/*" 
                                                onChange={handleFileUpload} 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label-premium">Professional Bio</label>
                                        <textarea 
                                            className="form-input-premium" rows={3}
                                            value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label-premium"><i className="fab fa-twitter me-1"></i> Twitter</label>
                                        <input 
                                            type="text" className="form-input-premium" 
                                            value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label-premium"><i className="fab fa-linkedin me-1"></i> LinkedIn</label>
                                        <input 
                                            type="text" className="form-input-premium" 
                                            value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label-premium"><i className="fab fa-instagram me-1"></i> Instagram</label>
                                        <input 
                                            type="text" className="form-input-premium" 
                                            value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── EXPERIENCE TAB ───────────────────────────── */}
                            {activeTab === 'experience' && (
                                <div className="timeline-editor-wrapper">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="text-white-50 m-0">
                                            <i className="fas fa-briefcase me-2 text-warning opacity-75"></i>
                                            Manage Work Experience
                                        </h5>
                                        {!showExpForm && (
                                            <button
                                                type="button"
                                                className="btn-admin-primary btn-sm px-3"
                                                onClick={openAddExp}
                                            >
                                                <i className="fas fa-plus me-1"></i> Add Entry
                                            </button>
                                        )}
                                    </div>

                                    {showExpForm && (
                                        <div className="entry-sub-form p-3 mb-4 rounded border border-warning bg-black-20">
                                            <h6 className="text-warning mb-3">
                                                <i className="fas fa-briefcase me-2"></i>
                                                {editingExpIdx !== null ? 'Edit Experience Entry' : 'New Experience Entry'}
                                            </h6>
                                            <div className="row g-2">
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Job Title *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. Senior Motion Designer"
                                                        value={expForm.title} onChange={(e) => setExpForm({...expForm, title: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Company / Studio *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. Creative Studio Inc."
                                                        value={expForm.subtitle} onChange={(e) => setExpForm({...expForm, subtitle: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Date Range *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. 2018 – Present"
                                                        value={expForm.dateRange} onChange={(e) => setExpForm({...expForm, dateRange: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label-premium text-white-50 small">Sort Order</label>
                                                    <input
                                                        type="number" className="form-input-premium py-1 fs-6"
                                                        value={expForm.sortOrder} onChange={(e) => setExpForm({...expForm, sortOrder: Number(e.target.value)})}
                                                    />
                                                </div>
                                                <div className="col-md-3 d-flex align-items-center mt-4">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox" className="form-check-input" id="exp-active"
                                                            checked={expForm.isActive} onChange={(e) => setExpForm({...expForm, isActive: e.target.checked})}
                                                        />
                                                        <label className="form-check-label text-white-50 small" htmlFor="exp-active">Visible</label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label-premium text-white-50 small">Description</label>
                                                    <textarea
                                                        className="form-input-premium py-1 fs-6" rows={3}
                                                        placeholder="Describe your role, achievements and responsibilities..."
                                                        value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-12 d-flex gap-2 mt-3 justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setShowExpForm(false); setEditingExpIdx(null); }}>Cancel</button>
                                                    <button type="button" className="btn btn-sm btn-warning px-4 text-dark fw-bold" onClick={saveExpLocally}>
                                                        <i className="fas fa-check me-1"></i>{editingExpIdx !== null ? 'Update Entry' : 'Add Entry'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="timeline-list-container d-flex flex-column gap-3 max-height-300 overflow-y-auto">
                                        {experienceEntries.length === 0 ? (
                                            <div className="text-center p-4 text-muted border border-secondary rounded" style={{borderStyle:'dashed'}}>
                                                <i className="fas fa-briefcase fa-2x mb-2 d-block opacity-25"></i>
                                                No work experience added yet. Click '+ Add Entry' to start.
                                            </div>
                                        ) : (
                                            experienceEntries.map((entry) => (
                                                <div className="timeline-item-card p-3 rounded bg-black-30 border border-secondary d-flex justify-content-between align-items-start" key={entry.originalIndex}>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <h6 className="text-white fw-bold m-0">{entry.title}</h6>
                                                            <span className="badge bg-warning text-dark py-0 px-2 fs-7">{entry.dateRange}</span>
                                                            {!entry.isActive && <span className="badge bg-danger py-0 px-1 fs-7">Hidden</span>}
                                                        </div>
                                                        <div className="text-warning opacity-75 fs-7 fw-600 mb-1">{entry.subtitle}</div>
                                                        <p className="small text-white-50 m-0" style={{ whiteSpace: 'pre-line' }}>{entry.description}</p>
                                                    </div>
                                                    <div className="d-flex gap-1 ms-3">
                                                        <button type="button" className="btn btn-sm btn-outline-light py-0 px-2" onClick={() => openEditExp(entry.originalIndex)} title="Edit"><i className="fas fa-pencil-alt fs-7"></i></button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => deleteExpLocally(entry.originalIndex)} title="Delete"><i className="fas fa-trash-alt fs-7"></i></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── EDUCATION TAB ────────────────────────────── */}
                            {activeTab === 'education' && (
                                <div className="timeline-editor-wrapper">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="text-white-50 m-0">
                                            <i className="fas fa-graduation-cap me-2 text-info opacity-75"></i>
                                            Manage Education Background
                                        </h5>
                                        {!showEduForm && (
                                            <button
                                                type="button"
                                                className="btn-admin-primary btn-sm px-3"
                                                onClick={openAddEdu}
                                            >
                                                <i className="fas fa-plus me-1"></i> Add Entry
                                            </button>
                                        )}
                                    </div>

                                    {showEduForm && (
                                        <div className="entry-sub-form p-3 mb-4 rounded border border-info bg-black-20">
                                            <h6 className="text-info mb-3">
                                                <i className="fas fa-graduation-cap me-2"></i>
                                                {editingEduIdx !== null ? 'Edit Education Entry' : 'New Education Entry'}
                                            </h6>
                                            <div className="row g-2">
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Degree / Certificate *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. B.A. Graphic Design"
                                                        value={eduForm.title} onChange={(e) => setEduForm({...eduForm, title: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Institution / School *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. National College of Arts"
                                                        value={eduForm.subtitle} onChange={(e) => setEduForm({...eduForm, subtitle: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label-premium text-white-50 small">Date Range *</label>
                                                    <input
                                                        type="text" className="form-input-premium py-1 fs-6"
                                                        placeholder="e.g. 2004 – 2008"
                                                        value={eduForm.dateRange} onChange={(e) => setEduForm({...eduForm, dateRange: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label-premium text-white-50 small">Sort Order</label>
                                                    <input
                                                        type="number" className="form-input-premium py-1 fs-6"
                                                        value={eduForm.sortOrder} onChange={(e) => setEduForm({...eduForm, sortOrder: Number(e.target.value)})}
                                                    />
                                                </div>
                                                <div className="col-md-3 d-flex align-items-center mt-4">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox" className="form-check-input" id="edu-active"
                                                            checked={eduForm.isActive} onChange={(e) => setEduForm({...eduForm, isActive: e.target.checked})}
                                                        />
                                                        <label className="form-check-label text-white-50 small" htmlFor="edu-active">Visible</label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label-premium text-white-50 small">Description</label>
                                                    <textarea
                                                        className="form-input-premium py-1 fs-6" rows={3}
                                                        placeholder="Describe what you studied, key achievements, awards..."
                                                        value={eduForm.description} onChange={(e) => setEduForm({...eduForm, description: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-12 d-flex gap-2 mt-3 justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setShowEduForm(false); setEditingEduIdx(null); }}>Cancel</button>
                                                    <button type="button" className="btn btn-sm btn-info px-4 fw-bold" onClick={saveEduLocally}>
                                                        <i className="fas fa-check me-1"></i>{editingEduIdx !== null ? 'Update Entry' : 'Add Entry'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="timeline-list-container d-flex flex-column gap-3 max-height-300 overflow-y-auto">
                                        {educationEntries.length === 0 ? (
                                            <div className="text-center p-4 text-muted border border-secondary rounded" style={{borderStyle:'dashed'}}>
                                                <i className="fas fa-graduation-cap fa-2x mb-2 d-block opacity-25"></i>
                                                No education entries added yet. Click '+ Add Entry' to start.
                                            </div>
                                        ) : (
                                            educationEntries.map((entry) => (
                                                <div className="timeline-item-card p-3 rounded bg-black-30 border border-secondary d-flex justify-content-between align-items-start" key={entry.originalIndex}>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <h6 className="text-white fw-bold m-0">{entry.title}</h6>
                                                            <span className="badge bg-info text-dark py-0 px-2 fs-7">{entry.dateRange}</span>
                                                            {!entry.isActive && <span className="badge bg-danger py-0 px-1 fs-7">Hidden</span>}
                                                        </div>
                                                        <div className="text-info opacity-75 fs-7 fw-600 mb-1">{entry.subtitle}</div>
                                                        <p className="small text-white-50 m-0" style={{ whiteSpace: 'pre-line' }}>{entry.description}</p>
                                                    </div>
                                                    <div className="d-flex gap-1 ms-3">
                                                        <button type="button" className="btn btn-sm btn-outline-light py-0 px-2" onClick={() => openEditEdu(entry.originalIndex)} title="Edit"><i className="fas fa-pencil-alt fs-7"></i></button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => deleteEduLocally(entry.originalIndex)} title="Delete"><i className="fas fa-trash-alt fs-7"></i></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="d-flex gap-2 mt-5 border-top border-secondary pt-3">
                                <button type="button" className="btn-neon-outline flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-neon flex-grow-2 justify-content-center" disabled={isUploading}>
                                    <i className="fas fa-save me-2"></i> {currentMember ? 'Apply Changes' : 'Register Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(2, 6, 23, 0.85);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .admin-modal-content {
                    border: 1px solid rgba(255,255,255,0.1);
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .btn-close-v2 {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 20px;
                    transition: 0.3s;
                }
                .btn-close-v2:hover { color: #fff; }
                .animate-scale-up { animation: scaleUp 0.3s ease-out; }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                .premium-tabs {
                    display: flex;
                    border-bottom: 2px solid rgba(255,255,255,0.05);
                }
                .tab-btn {
                    background: transparent;
                    border: none;
                    border-bottom: 2.5px solid transparent;
                    color: #94a3b8;
                    padding: 8px 16px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .tab-btn:hover {
                    color: #fff;
                }
                .tab-btn.active {
                    color: var(--color-primary, #ff5e14);
                    border-bottom-color: var(--color-primary, #ff5e14);
                }

                .bg-black-20 {
                    background: rgba(0,0,0,0.2);
                }
                .bg-black-30 {
                    background: rgba(0,0,0,0.35);
                }
                .max-height-300 {
                    max-height: 300px;
                }
                .overflow-y-auto {
                    overflow-y: auto;
                }
                .fs-7 {
                    font-size: 0.8rem;
                }
                .fs-8 {
                    font-size: 0.72rem;
                }
            `}</style>
        </div>
    );
};

export default TeamManager;
