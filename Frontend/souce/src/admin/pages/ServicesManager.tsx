import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { getPackages, type PackagesStructure } from '../../lib/packagesUtils';

const PREDEFINED_ICONS = [
    { class: 'fas fa-film', label: 'Film & Motion' },
    { class: 'fas fa-lightbulb', label: 'Explainer' },
    { class: 'fas fa-video', label: 'Video Production' },
    { class: 'fas fa-cube', label: '3D Product' },
    { class: 'fas fa-briefcase', label: 'Business Media' },
    { class: 'fas fa-palette', label: 'Design & Branding' },
    { class: 'fas fa-mobile-alt', label: 'Web & App UI' },
    { class: 'fas fa-magic', label: 'Logo Reveal' },
    { class: 'fas fa-box-open', label: '3D Modeling' },
    { class: 'fas fa-font', label: 'Typography' },
    { class: 'fas fa-pencil-alt', label: 'Whiteboard' },
    { class: 'fas fa-chart-line', label: 'Infographics' },
    { class: 'fas fa-star', label: 'Feature / General' },
    { class: 'fas fa-cogs', label: 'Services' },
    { class: 'fas fa-play-circle', label: 'Showreel' }
];

const MODAL_TABS = [
    { id: 'general' as const, label: 'General', icon: 'fa-sliders-h', hint: 'Title, icon & video' },
    { id: 'packages' as const, label: 'Pricing', icon: 'fa-tags', hint: 'Basic · Standard · Premium' },
    { id: 'details' as const, label: 'Page', icon: 'fa-file-alt', hint: 'Detail page copy' },
];

interface ServiceData {
    id: number;
    title: string;
    text: string;
    icon: string;
    videoUrl: string;
    displayOrder: number;
    isActive: boolean;
    price: number;
    featuresJson?: string;
    mainTitle?: string;
    description?: string;
    secondaryDescription?: string;
    groupsJson?: string;
    processJson?: string;
}

const ServicesManager: React.FC = () => {
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'packages' | 'details'>('general');
    const [activePkgTab, setActivePkgTab] = useState<'basic' | 'standard' | 'premium'>('basic');
    const [packages, setPackages] = useState<PackagesStructure>({
        basic: { title: 'Basic Pack', price: 0, description: '', features: [] },
        standard: { title: 'Standard Kit', price: 0, description: '', features: [] },
        premium: { title: 'Premium Suite', price: 0, description: '', features: [] }
    });
    const [formData, setFormData] = useState<Partial<ServiceData>>({
        title: '',
        text: '',
        icon: 'fas fa-star',
        videoUrl: '',
        displayOrder: 1,
        isActive: true,
        price: 0,
        featuresJson: '[]',
        mainTitle: '',
        description: '',
        secondaryDescription: '',
        groupsJson: '[]',
        processJson: '[]'
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getServices();
            // Sort by display order locally just in case
            const sorted = (data || []).sort((a: any, b: any) => (a.displayOrder || a.DisplayOrder || 0) - (b.displayOrder || b.DisplayOrder || 0));
            setServices(sorted.map((item: any) => ({
                id: item.id || item.Id,
                title: item.title || item.Title,
                text: item.text || item.Text,
                icon: item.icon || item.Icon,
                videoUrl: item.videoUrl || item.VideoUrl || '',
                displayOrder: item.displayOrder || item.DisplayOrder || 0,
                isActive: item.isActive !== undefined ? item.isActive : item.IsActive !== undefined ? item.IsActive : true,
                price: item.price || item.Price || 0,
                featuresJson: item.featuresJson || item.FeaturesJson || '[]',
                mainTitle: item.mainTitle || item.MainTitle || '',
                description: item.description || item.Description || '',
                secondaryDescription: item.secondaryDescription || item.SecondaryDescription || '',
                groupsJson: item.groupsJson || item.GroupsJson || '[]',
                processJson: item.processJson || item.ProcessJson || '[]'
            })));
        } catch (error) {
            toast.error('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const applySuggestedPackages = () => {
        const suggested = getPackages('[]', formData.price || 0, formData.title || '');
        setPackages(suggested);
        toast.info('Suggested pricing tiers and features applied. Review each tier and save.');
    };

    const handlePkgChange = (field: 'title' | 'price' | 'description' | 'features', value: string | number | string[]) => {
        setPackages(prev => ({
            ...prev,
            [activePkgTab]: {
                ...prev[activePkgTab],
                [field]: value
            }
        }));
    };

    const handleOpenModal = (service?: ServiceData) => {
        setActiveTab('general');
        setActivePkgTab('basic');
        if (service) {
            setEditingId(service.id);
            const parsedPkgs = getPackages(service.featuresJson, service.price, service.title);
            setPackages(parsedPkgs);
            setFormData({
                ...service,
                price: service.price || 0,
                featuresJson: service.featuresJson || '[]',
                mainTitle: service.mainTitle || '',
                description: service.description || '',
                secondaryDescription: service.secondaryDescription || '',
                groupsJson: service.groupsJson || '[]',
                processJson: service.processJson || '[]'
            });
        } else {
            setEditingId(null);
            setPackages({
                basic: { title: 'Basic Pack', price: 199, description: 'Essential starter package.', features: [] },
                standard: { title: 'Standard Kit', price: 399, description: 'Most popular full package.', features: [] },
                premium: { title: 'Premium Suite', price: 699, description: 'Ultimate complete suite.', features: [] }
            });
            setFormData({
                title: '',
                text: '',
                icon: 'fas fa-star',
                videoUrl: '',
                displayOrder: services.length + 1,
                isActive: true,
                price: 199,
                featuresJson: '[]',
                mainTitle: '',
                description: '',
                secondaryDescription: '',
                groupsJson: '[]',
                processJson: '[]'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' 
                ? (e.target as HTMLInputElement).checked 
                : name === 'price' || name === 'displayOrder'
                    ? Number(value)
                    : value
        }));
    };

    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadProgress(10); // Start progress

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        const apiBaseUrl = (
            import.meta.env.VITE_PRODUCTION_API_URL ||
            import.meta.env.VITE_API_BASE_URL ||
            ''
        ).replace(/\/$/, '');

        xhr.open('POST', `${apiBaseUrl}/cloudinary/upload`);

        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setFormData(prev => ({ ...prev, icon: data.secure_url }));
                    toast.success('Custom icon uploaded successfully!');
                } else {
                    toast.error('Upload failed: unexpected response from server.');
                }
            } else if (xhr.status === 401) {
                toast.error('Upload failed: not authorized. Please log in again.');
            } else if (xhr.status === 503) {
                toast.error('Upload failed: Cloudinary is not configured on the server. Set Cloudinary__* env vars in Backend/appsettings.');
            } else {
                let msg = `Upload failed (HTTP ${xhr.status})`;
                try {
                    const err = JSON.parse(xhr.responseText);
                    if (err?.cloudinaryBody) {
                        try {
                            const cloudinaryError = JSON.parse(err.cloudinaryBody);
                            msg = `Upload failed: ${cloudinaryError?.error?.message || err.error || msg}`;
                        } catch {
                            msg = `Upload failed: ${err.cloudinaryBody}`;
                        }
                    } else if (err?.error) {
                        msg = `Upload failed: ${err.error}`;
                    }
                } catch {
                    // keep generic
                }
                toast.error(msg);
            }
            setUploadProgress(0);
        };

        xhr.onerror = () => {
            const fallback = new FormData();
            fallback.append('file', file);
            fallback.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'smooothpixel_upload');

            const fxhr = new XMLHttpRequest();
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk';
            fxhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
            fxhr.onload = () => {
                if (fxhr.status === 200) {
                    try {
                        const data = JSON.parse(fxhr.responseText);
                        if (data?.secure_url) {
                            setFormData(prev => ({ ...prev, icon: data.secure_url }));
                            setUploadProgress(0);
                            toast.success('Custom icon uploaded successfully!');
                            return;
                        }
                    } catch { /* fall through */ }
                }
                toast.error('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setUploadProgress(0);
            };
            fxhr.onerror = () => {
                toast.error('Upload failed: could not reach backend or Cloudinary.');
                setUploadProgress(0);
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(10);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        const apiBaseUrl = (
            import.meta.env.VITE_PRODUCTION_API_URL ||
            import.meta.env.VITE_API_BASE_URL ||
            ''
        ).replace(/\/$/, '');

        xhr.open('POST', `${apiBaseUrl}/cloudinary/upload`);

        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setFormData(prev => ({ ...prev, videoUrl: data.secure_url }));
                    toast.success("Video uploaded successfully.");
                } else {
                    toast.error('Upload failed: unexpected response from server.');
                }
            } else if (xhr.status === 401) {
                toast.error('Upload failed: not authorized. Please log in again.');
            } else if (xhr.status === 503) {
                toast.error('Upload failed: Cloudinary is not configured on the server. Set Cloudinary__* env vars in Backend/appsettings.');
            } else {
                let msg = `Upload failed (HTTP ${xhr.status})`;
                try {
                    const err = JSON.parse(xhr.responseText);
                    if (err?.cloudinaryBody) {
                        try {
                            const cloudinaryError = JSON.parse(err.cloudinaryBody);
                            msg = `Upload failed: ${cloudinaryError?.error?.message || err.error || msg}`;
                        } catch {
                            msg = `Upload failed: ${err.cloudinaryBody}`;
                        }
                    } else if (err?.error) {
                        msg = `Upload failed: ${err.error}`;
                    }
                } catch {
                    // keep generic
                }
                toast.error(msg);
            }
            setUploadProgress(0);
            setUploading(false);
            e.target.value = '';
        };

        xhr.onerror = () => {
            const fallback = new FormData();
            fallback.append('file', file);
            fallback.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'smooothpixel_upload');

            const fxhr = new XMLHttpRequest();
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk';
            fxhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
            fxhr.onload = () => {
                if (fxhr.status === 200) {
                    try {
                        const data = JSON.parse(fxhr.responseText);
                        if (data?.secure_url) {
                            setFormData(prev => ({ ...prev, videoUrl: data.secure_url }));
                            setUploadProgress(0);
                            setUploading(false);
                            toast.success("Video uploaded successfully.");
                            return;
                        }
                    } catch { /* fall through */ }
                }
                toast.error('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setUploadProgress(0);
                setUploading(false);
            };
            fxhr.onerror = () => {
                toast.error('Upload failed: could not reach backend or Cloudinary.');
                setUploadProgress(0);
                setUploading(false);
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const serializedFeatures = JSON.stringify(packages);
            const basicPrice = packages.basic.price;

            const payload = {
                Title: formData.title,
                Text: formData.text,
                Icon: formData.icon,
                VideoUrl: formData.videoUrl,
                DisplayOrder: formData.displayOrder,
                IsActive: formData.isActive,
                Price: basicPrice || 0,
                FeaturesJson: serializedFeatures,
                MainTitle: formData.mainTitle || '',
                Description: formData.description || '',
                SecondaryDescription: formData.secondaryDescription || '',
                GroupsJson: formData.groupsJson || '[]',
                ProcessJson: formData.processJson || '[]'
            };

            if (editingId) {
                await apiService.updateService(editingId.toString(), { id: editingId, Id: editingId, ...payload });
                toast.success('Service updated successfully.');
            } else {
                await apiService.createService(payload);
                toast.success('Service created successfully.');
            }
            handleCloseModal();
            fetchServices();
        } catch (error: any) {
            toast.error(error.response?.data?.title || error.response?.data || error.message || 'Operation failed.');
            console.error('Submit Error:', error.response || error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!id) return toast.error('Invalid ID to delete.');
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await apiService.deleteService(id.toString());
                toast.success('Service deleted.');
                fetchServices();
            } catch (error: any) {
                toast.error(error.response?.data?.title || error.response?.data || error.message || 'Failed to delete service.');
                console.error('Delete Error:', error.response || error);
            }
        }
    };

    const handleSeedData = async () => {
        if (window.confirm('This will seed default services. Are you sure?')) {
            try {
                const { apiClient } = await import('../../lib/apiClient');
                await apiClient.post('/services/seed');
                toast.success('Services seeded successfully.');
                fetchServices();
            } catch (err: any) {
                toast.error(err.response?.data || 'Failed to seed services.');
            }
        }
    };

    return (
        <div className="animate-fade-in p-2 services-admin-wrapper">
            <div className="d-flex justify-content-between align-items-end mb-5 border-bottom-glass pb-4">
                <div>
                    <h2 className="admin-title fw-900 fs-2 text-adaptive" style={{ letterSpacing: '-1px' }}>Services Hub</h2>
                    <p className="admin-subtitle text-muted m-0">Manage services, descriptions, and video previews.</p>
                </div>
                <div className="d-flex gap-3">
                    {services.length === 0 && (
                        <button onClick={handleSeedData} className="btn-modern-purple">
                            <i className="fas fa-database me-2"></i> Seed Default
                        </button>
                    )}
                    <button onClick={() => handleOpenModal()} className="btn-modern-primary">
                        <i className="fas fa-plus me-2"></i> Add Service
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {services.map((service) => {
                        const sId = service.id || (service as any).Id;
                        return (
                        <div key={sId} className="col-lg-4 col-md-6">
                            <div className="service-glass-card h-100 p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="icon-badge-blue d-flex align-items-center justify-content-center" style={{ overflow: 'hidden', padding: '10px' }}>
                                        {service.icon && (service.icon.startsWith('http') || service.icon.startsWith('/')) ? (
                                            <img src={service.icon} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <i className={service.icon}></i>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => handleOpenModal(service)} className="btn-action edit" title="Edit">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(sId)} className="btn-action delete" title="Delete">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h4 className="text-adaptive fw-bold fs-5 mb-0">{service.title}</h4>
                                    <span className="fs-5 fw-900 spm-price-tag">${service.price || 0}</span>
                                </div>
                                <p className="text-muted fs-14 mb-3 flex-grow-1">{service.text}</p>
                                
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(service.featuresJson || '[]');
                                        if (parsed && parsed.basic && parsed.standard && parsed.premium) {
                                            return (
                                                <div className="mb-3 small text-muted p-2 rounded" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)'}}>
                                                    <div className="fw-bold mb-1" style={{color: '#c084fc'}}><i className="fas fa-tags me-2"></i> 3 Pricing Tiers:</div>
                                                    <div className="ms-1 font-monospace" style={{fontSize: '11px', lineHeight: '1.6'}}>
                                                        • Basic: <strong style={{color: '#fff'}}>${parsed.basic.price}</strong> ({parsed.basic.features?.length || 0} feats)<br />
                                                        • Standard: <strong style={{color: '#fff'}}>${parsed.standard.price}</strong> ({parsed.standard.features?.length || 0} feats)<br />
                                                        • Premium: <strong style={{color: '#fff'}}>${parsed.premium.price}</strong> ({parsed.premium.features?.length || 0} feats)
                                                    </div>
                                                </div>
                                            );
                                        }
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                            return (
                                                <div className="mb-3 small text-muted p-2 rounded" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)'}}>
                                                    <div className="fw-bold mb-1" style={{color: '#ffb606'}}><i className="fas fa-list-ul me-2"></i> Legacy Format:</div>
                                                    <span className="font-monospace" style={{fontSize: '11px'}}>• Single Price: <strong>${service.price}</strong> ({parsed.length} feats)</span>
                                                </div>
                                            );
                                        }
                                    } catch(_e) { /* ignore JSON parse error */ }
                                    return (
                                        <div className="mb-3 small text-muted p-2 rounded" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)'}}>
                                            <span className="font-monospace" style={{fontSize: '11px'}}>• Single Price: <strong>${service.price}</strong></span>
                                        </div>
                                    );
                                })()}
                                
                                <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top-glass">
                                    <span className="badge bg-secondary text-light border border-secondary">Order: {service.displayOrder}</span>
                                    {service.videoUrl ? (
                                        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                                            <i className="fas fa-video me-1"></i> Video Attached
                                        </span>
                                    ) : (
                                        <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
                                            <i className="fas fa-exclamation-circle me-1"></i> No Video
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}

            {/* Service editor modal */}
            {isModalOpen && (
                <div className="spm-overlay" role="dialog" aria-modal="true" onClick={handleCloseModal}>
                    <div className="spm-dialog animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <header className="spm-header">
                            <div className="spm-header-text">
                                <span className="spm-kicker">{editingId ? 'Editing service' : 'New service'}</span>
                                <h2 className="spm-title">{editingId ? 'Edit Service' : 'Add Service'}</h2>
                                <p className="spm-subtitle">Card content, pricing tiers, and public detail page.</p>
                            </div>
                            <button className="spm-close" type="button" onClick={handleCloseModal} aria-label="Close">
                                <i className="fas fa-times" />
                            </button>
                        </header>

                        <nav className="spm-tabs" aria-label="Service editor sections">
                            {MODAL_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`spm-tab ${activeTab === tab.id ? 'spm-tab-active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <i className={`fas ${tab.icon}`} />
                                    <span className="spm-tab-label">{tab.label}</span>
                                    <span className="spm-tab-hint">{tab.hint}</span>
                                </button>
                            ))}
                        </nav>

                        <form className="spm-form" onSubmit={handleSubmit}>
                            <div className="spm-body">
                            {activeTab === 'general' ? (
                                <div className="spm-panel animate-fade-in">
                                    <section className="spm-card">
                                        <h3 className="spm-card-title"><i className="fas fa-heading" /> Basics</h3>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="spm-label">Service title</label>
                                                <input type="text" className="spm-input" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Animation & Motion Graphics" required />
                                            </div>
                                            <div className="col-12">
                                                <label className="spm-label">Card description</label>
                                                <textarea className="spm-input" name="text" value={formData.text} onChange={handleChange} rows={3} placeholder="Short summary shown on the services grid…" required />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="spm-card">
                                        <h3 className="spm-card-title"><i className="fas fa-icons" /> Icon</h3>
                                        <p className="spm-help">Upload an image or pick a Font Awesome icon from the gallery.</p>
                                        <div className="spm-icon-row">
                                            <div className="spm-icon-preview">
                                                {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('/')) ? (
                                                    <img src={formData.icon} alt="" />
                                                ) : (
                                                    <i className={formData.icon || 'fas fa-star'} />
                                                )}
                                            </div>
                                            <div className="spm-icon-input-wrap">
                                                <input type="text" className="spm-input" name="icon" value={formData.icon} onChange={handleChange} placeholder="https://… or fas fa-film" required />
                                                <label className="spm-upload-btn" title="Upload icon image">
                                                    {uploadProgress > 0 ? <span>{uploadProgress}%</span> : <i className="fas fa-cloud-upload-alt" />}
                                                    <input type="file" accept="image/*" onChange={handleIconUpload} hidden />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="spm-icon-grid">
                                            {PREDEFINED_ICONS.map((ico) => (
                                                <button
                                                    key={ico.class}
                                                    type="button"
                                                    className={`spm-icon-chip ${formData.icon === ico.class ? 'spm-icon-chip-active' : ''}`}
                                                    onClick={() => setFormData((prev) => ({ ...prev, icon: ico.class }))}
                                                    title={ico.label}
                                                >
                                                    <i className={ico.class} />
                                                    <span>{ico.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="spm-card">
                                        <h3 className="spm-card-title"><i className="fas fa-video" /> Video preview</h3>
                                        <p className="spm-help">Plays on hover on the public services card.</p>
                                        <div className="spm-video-row">
                                            <input type="text" className="spm-input" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Paste URL or upload…" />
                                            <button type="button" className="spm-btn-ghost" onClick={() => document.getElementById('service-video-upload')?.click()} disabled={uploading}>
                                                {uploading ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-upload me-2" />Upload</>}
                                            </button>
                                            <input type="file" id="service-video-upload" hidden accept="video/*" onChange={handleVideoUpload} />
                                        </div>
                                        {formData.videoUrl && (
                                            <div className="spm-video-preview">
                                                <video src={formData.videoUrl} controls />
                                            </div>
                                        )}
                                    </section>

                                    <section className="spm-card spm-card-inline">
                                        <div>
                                            <label className="spm-label">Display order</label>
                                            <input type="number" className="spm-input spm-input-sm" name="displayOrder" value={formData.displayOrder} onChange={handleChange} min={0} />
                                        </div>
                                        <label className="spm-switch">
                                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                            <span className="spm-switch-ui" />
                                            <span className="spm-switch-text">Visible on website</span>
                                        </label>
                                    </section>
                                </div>
                            ) : activeTab === 'packages' ? (
                                <div className="spm-panel animate-fade-in">
                                    <section className="spm-card">
                                        <div className="spm-card-head-row">
                                            <div>
                                                <h3 className="spm-card-title m-0"><i className="fas fa-tags" /> Pricing tiers</h3>
                                                <p className="spm-help m-0 mt-1">For <strong>{formData.title || 'this service'}</strong> — shown on the public pricing card.</p>
                                            </div>
                                            <button type="button" className="spm-btn-suggest" onClick={applySuggestedPackages}>
                                                <i className="fas fa-magic" /> Suggested packs
                                            </button>
                                        </div>
                                        <div className="spm-tier-pills">
                                            {(['basic', 'standard', 'premium'] as const).map((tier) => (
                                                <button
                                                    key={tier}
                                                    type="button"
                                                    className={`spm-tier-pill ${activePkgTab === tier ? 'spm-tier-pill-active' : ''}`}
                                                    onClick={() => setActivePkgTab(tier)}
                                                >
                                                    {tier}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="spm-card">
                                        <h3 className="spm-card-title"><i className="fas fa-box" /> {activePkgTab} package</h3>
                                        <div className="row g-3">
                                            <div className="col-md-8">
                                                <label className="spm-label">Package name</label>
                                                <input type="text" className="spm-input" value={packages[activePkgTab].title} onChange={(e) => handlePkgChange('title', e.target.value)} required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="spm-label">Price (USD)</label>
                                                <input type="number" className="spm-input" value={packages[activePkgTab].price} onChange={(e) => handlePkgChange('price', Number(e.target.value))} min={0} required />
                                            </div>
                                            <div className="col-12">
                                                <label className="spm-label">Tagline</label>
                                                <textarea className="spm-input" value={packages[activePkgTab].description} onChange={(e) => handlePkgChange('description', e.target.value)} rows={2} placeholder="What is included in this tier…" required />
                                            </div>
                                        </div>
                                        <div className="spm-features-block">
                                            <div className="spm-features-head">
                                                <label className="spm-label m-0">Features</label>
                                                <button
                                                    type="button"
                                                    className="spm-btn-add"
                                                    onClick={() => {
                                                        const currentFeats = packages[activePkgTab].features || [];
                                                        handlePkgChange('features', [...currentFeats, 'New feature']);
                                                    }}
                                                >
                                                    <i className="fas fa-plus" /> Add
                                                </button>
                                            </div>
                                            <div className="spm-features-list">
                                                {(packages[activePkgTab].features || []).length === 0 && (
                                                    <p className="spm-empty-hint">No features yet for this tier.</p>
                                                )}
                                                {(packages[activePkgTab].features || []).map((feat, fIndex) => (
                                                    <div key={fIndex} className="spm-feature-row">
                                                        <span className="spm-feature-check"><i className="fas fa-check" /></span>
                                                        <input
                                                            type="text"
                                                            className="spm-input"
                                                            value={feat}
                                                            onChange={(e) => {
                                                                const newFeats = [...(packages[activePkgTab].features || [])];
                                                                newFeats[fIndex] = e.target.value;
                                                                handlePkgChange('features', newFeats);
                                                            }}
                                                            placeholder="e.g. Unlimited revisions"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="spm-feature-remove"
                                                            onClick={() => {
                                                                const newFeats = [...(packages[activePkgTab].features || [])];
                                                                newFeats.splice(fIndex, 1);
                                                                handlePkgChange('features', newFeats);
                                                            }}
                                                            aria-label="Remove feature"
                                                        >
                                                            <i className="fas fa-times" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <section className="spm-card spm-preview-card">
                                        <h3 className="spm-card-title"><i className="fas fa-eye" /> Live preview</h3>
                                        <div className="spm-pricing-preview">
                                            <div className="spm-pricing-preview-top">
                                                <div>
                                                    <span className="spm-preview-kicker">{formData.title}</span>
                                                    <h4>{packages[activePkgTab].title}</h4>
                                                    <p>{packages[activePkgTab].description}</p>
                                                </div>
                                                <span className="spm-preview-price">${packages[activePkgTab].price}</span>
                                            </div>
                                            <ul>
                                                {(packages[activePkgTab].features || []).length === 0 ? (
                                                    <li className="spm-empty-hint">Add features above</li>
                                                ) : (
                                                    (packages[activePkgTab].features || []).map((f, i) => (
                                                        <li key={i}><i className="fas fa-check-circle" /> {f}</li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <div className="spm-panel animate-fade-in">
                                    <section className="spm-card">
                                        <h3 className="spm-card-title"><i className="fas fa-file-alt" /> Page copy</h3>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="spm-label">Main title</label>
                                                <input type="text" className="spm-input" name="mainTitle" value={formData.mainTitle} onChange={handleChange} placeholder="e.g. Premium Animation Solutions" />
                                            </div>
                                            <div className="col-12">
                                                <label className="spm-label">Lead description</label>
                                                <textarea className="spm-input" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Opening paragraph on the service detail page…" />
                                            </div>
                                            <div className="col-12">
                                                <label className="spm-label">Secondary description</label>
                                                <textarea className="spm-input" name="secondaryDescription" value={formData.secondaryDescription} onChange={handleChange} rows={3} placeholder="Additional expert solutions paragraph…" />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="spm-card">
                                        <div className="spm-card-head-row">
                                            <h3 className="spm-card-title m-0"><i className="fas fa-folder-open" /> Categories</h3>
                                            <button type="button" className="spm-btn-add" onClick={() => {
                                                try {
                                                    const current = JSON.parse(formData.groupsJson || '[]');
                                                    setFormData(prev => ({ ...prev, groupsJson: JSON.stringify([...current, { name: 'New Category', items: [] }]) }));
                                                } catch(_e) { /* ignore JSON parse error */ }
                                            }}>
                                                <i className="fas fa-plus" /> Add
                                            </button>
                                        </div>
                                        {(() => {
                                            let groups = [];
                                            try { groups = JSON.parse(formData.groupsJson || '[]'); } catch(_e) { /* ignore */ }
                                            if (!Array.isArray(groups)) groups = [];
                                            return (
                                                <>
                                                    {groups.length === 0 && <p className="spm-empty-hint">No categories yet.</p>}
                                                    {groups.map((group: any, gIndex: number) => (
                                                        <div key={gIndex} className="spm-nested-card">
                                                            <div className="d-flex gap-2 mb-3">
                                                                <input 
                                                                    type="text" 
                                                                    className="spm-input flex-grow-1" 
                                                                    value={group.name || ''} 
                                                                    onChange={(e) => {
                                                                        const newGroups = [...groups];
                                                                        newGroups[gIndex].name = e.target.value;
                                                                        setFormData(prev => ({ ...prev, groupsJson: JSON.stringify(newGroups) }));
                                                                    }} 
                                                                    placeholder="Category Name (e.g. 2D Animation)" 
                                                                />
                                                                <button type="button" className="spm-feature-remove" onClick={() => {
                                                                    const newGroups = [...groups];
                                                                    newGroups.splice(gIndex, 1);
                                                                    setFormData(prev => ({ ...prev, groupsJson: JSON.stringify(newGroups) }));
                                                                }}><i className="fas fa-trash"></i></button>
                                                            </div>
                                                            <div className="spm-nested-items">
                                                                <p className="spm-nested-label">Features in this category</p>
                                                                {(group.items || []).map((item: string, iIndex: number) => (
                                                                    <div key={iIndex} className="spm-feature-row">
                                                                        <span className="spm-feature-check"><i className="fas fa-check" /></span>
                                                                        <input 
                                                                            type="text" 
                                                                            className="spm-input"
                                                                            value={item} 
                                                                            onChange={(e) => {
                                                                                const newGroups = [...groups];
                                                                                newGroups[gIndex].items[iIndex] = e.target.value;
                                                                                setFormData(prev => ({ ...prev, groupsJson: JSON.stringify(newGroups) }));
                                                                            }} 
                                                                            placeholder="Feature item..." 
                                                                        />
                                                                        <button type="button" className="spm-feature-remove" onClick={() => {
                                                                            const newGroups = [...groups];
                                                                            newGroups[gIndex].items.splice(iIndex, 1);
                                                                            setFormData(prev => ({ ...prev, groupsJson: JSON.stringify(newGroups) }));
                                                                        }}><i className="fas fa-times"></i></button>
                                                                    </div>
                                                                ))}
                                                                <button type="button" className="spm-btn-add mt-2" onClick={() => {
                                                                    const newGroups = [...groups];
                                                                    if(!newGroups[gIndex].items) newGroups[gIndex].items = [];
                                                                    newGroups[gIndex].items.push('New Feature');
                                                                    setFormData(prev => ({ ...prev, groupsJson: JSON.stringify(newGroups) }));
                                                                }}><i className="fas fa-plus" /> Feature</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </section>

                                    <section className="spm-card">
                                        <div className="spm-card-head-row">
                                            <h3 className="spm-card-title m-0"><i className="fas fa-list-ol" /> Process steps</h3>
                                            <button type="button" className="spm-btn-add" onClick={() => {
                                                try {
                                                    const current = JSON.parse(formData.processJson || '[]');
                                                    setFormData(prev => ({ ...prev, processJson: JSON.stringify([...current, { title: 'New Step', text: 'Description...' }]) }));
                                                } catch(_e) { /* ignore JSON parse error */ }
                                            }}>
                                                <i className="fas fa-plus" /> Add
                                            </button>
                                        </div>
                                        {(() => {
                                            let process = [];
                                            try { process = JSON.parse(formData.processJson || '[]'); } catch(_e) { /* ignore */ }
                                            if (!Array.isArray(process)) process = [];
                                            return (
                                                <>
                                                    {process.length === 0 && <p className="spm-empty-hint">No process steps yet.</p>}
                                                    {process.map((step: any, pIndex: number) => (
                                                        <div key={pIndex} className="spm-nested-card">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <span className="spm-step-badge">Step {pIndex + 1}</span>
                                                                <button type="button" className="spm-feature-remove" onClick={() => {
                                                                    const newProcess = [...process];
                                                                    newProcess.splice(pIndex, 1);
                                                                    setFormData(prev => ({ ...prev, processJson: JSON.stringify(newProcess) }));
                                                                }}><i className="fas fa-trash"></i></button>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                className="spm-input" 
                                                                value={step.title || ''} 
                                                                onChange={(e) => {
                                                                    const newProcess = [...process];
                                                                    newProcess[pIndex].title = e.target.value;
                                                                    setFormData(prev => ({ ...prev, processJson: JSON.stringify(newProcess) }));
                                                                }} 
                                                                placeholder="Step title (e.g. Planning)" 
                                                            />
                                                            <textarea 
                                                                className="spm-input mt-2" 
                                                                value={step.text || ''} 
                                                                onChange={(e) => {
                                                                    const newProcess = [...process];
                                                                    newProcess[pIndex].text = e.target.value;
                                                                    setFormData(prev => ({ ...prev, processJson: JSON.stringify(newProcess) }));
                                                                }} 
                                                                placeholder="Step description" 
                                                                rows={2}
                                                            />
                                                        </div>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </section>
                                </div>
                            )}
                            </div>

                            <footer className="spm-footer">
                                <button type="button" className="spm-btn-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="spm-btn-save">
                                    <i className="fas fa-check" /> Save service
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .services-admin-wrapper {
                    --text-adaptive: var(--admin-text-main);
                    --text-muted: var(--admin-text-muted);
                    --bg-glass-light: var(--admin-glass);
                    --bg-glass-heavy: var(--admin-bg-alt);
                    --border-glass: var(--admin-glass-border);
                }
                .services-admin-wrapper .text-adaptive { color: var(--text-adaptive) !important; }
                .services-admin-wrapper .text-muted { color: var(--text-muted) !important; }
                .services-admin-wrapper .border-top-glass { border-top: 1px solid var(--border-glass) !important; }
                .services-admin-wrapper .border-bottom-glass { border-bottom: 1px solid var(--border-glass) !important; }
                .spm-price-tag { color: var(--admin-accent) !important; }

                .services-admin-wrapper .btn-modern-primary {
                    background: var(--sp-gradient);
                    color: #0f172a;
                    border: none;
                    padding: 14px 22px;
                    border-radius: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .services-admin-wrapper .btn-modern-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(var(--sp-primary-rgb), 0.35);
                }
                .services-admin-wrapper .btn-modern-purple {
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    color: var(--admin-accent);
                    border: 1px solid rgba(var(--sp-primary-rgb), 0.35);
                    padding: 14px 22px;
                    border-radius: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .services-admin-wrapper .service-glass-card {
                    background: var(--admin-glass);
                    border: 1px solid var(--border-glass);
                    border-radius: 20px;
                    transition: all 0.25s ease;
                }
                .services-admin-wrapper .service-glass-card:hover {
                    border-color: rgba(var(--sp-primary-rgb), 0.35);
                    transform: translateY(-4px);
                }
                .services-admin-wrapper .btn-action {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    border: none;
                    display: flex; align-items: center; justify-content: center;
                }
                .services-admin-wrapper .btn-action.edit { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
                .services-admin-wrapper .btn-action.delete { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
                .icon-badge-blue {
                    width: 48px; height: 48px;
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    color: var(--admin-accent);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px;
                }

                /* —— Service modal (spm) —— */
                .spm-overlay {
                    position: fixed; inset: 0;
                    z-index: 1050;
                    background: rgba(3, 7, 18, 0.72);
                    backdrop-filter: blur(10px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 16px;
                }
                html[data-theme="light"] .spm-overlay {
                    background: rgba(15, 23, 42, 0.45);
                }
                .spm-dialog {
                    width: min(920px, 100%);
                    max-height: min(92vh, 900px);
                    display: flex;
                    flex-direction: column;
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 20px;
                    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
                    overflow: hidden;
                }
                .spm-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 22px 24px 16px;
                    border-bottom: 1px solid var(--admin-glass-border);
                    background: linear-gradient(180deg, rgba(var(--sp-primary-rgb), 0.06) 0%, transparent 100%);
                }
                .spm-kicker {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--admin-accent);
                }
                .spm-title {
                    margin: 4px 0 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--admin-text-main);
                    letter-spacing: -0.02em;
                }
                .spm-subtitle {
                    margin: 6px 0 0;
                    font-size: 13px;
                    color: var(--admin-text-muted);
                }
                .spm-close {
                    width: 40px; height: 40px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-glass);
                    color: var(--admin-text-muted);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: all 0.2s;
                }
                .spm-close:hover {
                    background: rgba(244, 63, 94, 0.12);
                    color: #f43f5e;
                    border-color: rgba(244, 63, 94, 0.3);
                }
                .spm-tabs {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg);
                }
                @media (max-width: 640px) {
                    .spm-tabs { grid-template-columns: 1fr; }
                }
                .spm-tab {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 2px;
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: var(--admin-text-muted);
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                }
                .spm-tab i { font-size: 14px; margin-bottom: 2px; }
                .spm-tab-label { font-size: 13px; font-weight: 700; color: inherit; }
                .spm-tab-hint { font-size: 10px; opacity: 0.85; }
                .spm-tab-active {
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    border-color: rgba(var(--sp-primary-rgb), 0.35);
                    color: var(--admin-text-main);
                }
                .spm-tab-active .spm-tab-label { color: var(--admin-accent); }
                .spm-form { display: flex; flex-direction: column; flex: 1; min-height: 0; }
                .spm-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px 20px 8px;
                }
                .spm-panel { display: flex; flex-direction: column; gap: 14px; }
                .spm-card {
                    background: var(--admin-glass);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 16px;
                    padding: 18px 18px 20px;
                }
                .spm-card-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                    margin: 0 0 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .spm-card-title i { color: var(--admin-accent); font-size: 13px; }
                .spm-card-head-row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 14px;
                }
                .spm-card-inline {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }
                .spm-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--admin-text-muted);
                    margin-bottom: 8px;
                }
                .spm-help {
                    font-size: 12px;
                    color: var(--admin-text-muted);
                    margin: -8px 0 12px;
                    line-height: 1.5;
                }
                .spm-input {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg-alt);
                    color: var(--admin-text-main);
                    font-size: 14px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .spm-input-sm { max-width: 120px; }
                .spm-input::placeholder { color: var(--admin-text-muted); opacity: 0.7; }
                .spm-input:focus {
                    outline: none;
                    border-color: var(--admin-accent);
                    box-shadow: 0 0 0 3px rgba(var(--sp-primary-rgb), 0.15);
                }
                .spm-icon-row {
                    display: flex;
                    gap: 12px;
                    align-items: stretch;
                    margin-bottom: 14px;
                }
                .spm-icon-preview {
                    width: 56px; height: 56px;
                    border-radius: 14px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg-alt);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .spm-icon-preview img { width: 80%; height: 80%; object-fit: contain; }
                .spm-icon-preview i { font-size: 22px; color: var(--admin-accent); }
                .spm-icon-input-wrap { flex: 1; position: relative; }
                .spm-icon-input-wrap .spm-input { padding-right: 48px; }
                .spm-upload-btn {
                    position: absolute;
                    right: 6px; top: 50%;
                    transform: translateY(-50%);
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    border: 1px solid var(--admin-glass-border);
                    background: rgba(var(--sp-primary-rgb), 0.08);
                    color: var(--admin-accent);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    margin: 0;
                }
                .spm-icon-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 8px;
                    max-height: 160px;
                    overflow-y: auto;
                    padding: 4px;
                }
                .spm-icon-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 10px;
                    border-radius: 10px;
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: var(--admin-text-main);
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .spm-icon-chip i { color: var(--admin-accent); width: 16px; text-align: center; }
                .spm-icon-chip-active {
                    background: rgba(var(--sp-primary-rgb), 0.14);
                    border-color: var(--admin-accent);
                }
                .spm-video-row { display: flex; gap: 10px; flex-wrap: wrap; }
                .spm-video-row .spm-input { flex: 1; min-width: 200px; }
                .spm-btn-ghost {
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: rgba(var(--sp-primary-rgb), 0.06);
                    color: var(--admin-text-main);
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .spm-video-preview {
                    margin-top: 12px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid var(--admin-glass-border);
                    background: #000;
                }
                .spm-video-preview video { width: 100%; max-height: 200px; display: block; }
                .spm-switch {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    margin: 0;
                }
                .spm-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
                .spm-switch-ui {
                    width: 48px; height: 26px;
                    border-radius: 999px;
                    background: var(--admin-glass-border);
                    position: relative;
                    transition: background 0.2s;
                }
                .spm-switch-ui::after {
                    content: '';
                    position: absolute;
                    top: 3px; left: 3px;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    background: #fff;
                    transition: transform 0.2s;
                }
                .spm-switch input:checked + .spm-switch-ui {
                    background: var(--admin-accent);
                }
                .spm-switch input:checked + .spm-switch-ui::after {
                    transform: translateX(22px);
                }
                .spm-switch-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--admin-text-main);
                }
                .spm-tier-pills { display: flex; gap: 8px; flex-wrap: wrap; }
                .spm-tier-pill {
                    flex: 1;
                    min-width: 90px;
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: var(--admin-text-muted);
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: capitalize;
                    cursor: pointer;
                }
                .spm-tier-pill-active {
                    background: rgba(var(--sp-primary-rgb), 0.14);
                    border-color: var(--admin-accent);
                    color: var(--admin-accent);
                }
                .spm-btn-suggest, .spm-btn-add {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 10px;
                    border: 1px solid rgba(var(--sp-primary-rgb), 0.35);
                    background: rgba(var(--sp-primary-rgb), 0.1);
                    color: var(--admin-accent);
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .spm-features-block { margin-top: 16px; }
                .spm-features-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .spm-features-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-height: 220px;
                    overflow-y: auto;
                    padding: 10px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg);
                }
                .spm-feature-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .spm-feature-check {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    color: var(--admin-accent);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    font-size: 12px;
                }
                .spm-feature-remove {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    border: 1px solid rgba(244, 63, 94, 0.25);
                    background: rgba(244, 63, 94, 0.08);
                    color: #f43f5e;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                .spm-empty-hint {
                    font-size: 12px;
                    color: var(--admin-text-muted);
                    text-align: center;
                    margin: 8px 0;
                }
                .spm-pricing-preview {
                    background: var(--admin-bg-elevated, #fff);
                    color: #0f172a;
                    border-radius: 14px;
                    padding: 18px;
                    border: 1px solid var(--admin-glass-border);
                }
                html[data-theme="dark"] .spm-pricing-preview {
                    background: #0f172a;
                    color: #f1f5f9;
                }
                .spm-pricing-preview-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .spm-preview-kicker {
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #64748b;
                }
                .spm-pricing-preview h4 {
                    margin: 4px 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                }
                .spm-pricing-preview-top > div > p {
                    margin: 0;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--admin-accent);
                    text-transform: uppercase;
                }
                .spm-preview-price {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--admin-accent);
                }
                .spm-pricing-preview ul {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    font-size: 13px;
                }
                .spm-pricing-preview li {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .spm-pricing-preview li i { color: var(--admin-accent); margin-top: 3px; }
                .spm-nested-card {
                    padding: 14px;
                    margin-bottom: 10px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg);
                }
                .spm-nested-items {
                    border-left: 2px solid rgba(var(--sp-primary-rgb), 0.35);
                    padding-left: 12px;
                    margin-top: 8px;
                }
                .spm-nested-label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--admin-text-muted);
                    margin-bottom: 8px;
                }
                .spm-step-badge {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 999px;
                    background: rgba(var(--sp-primary-rgb), 0.15);
                    color: var(--admin-accent);
                }
                .spm-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 14px 20px;
                    border-top: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg);
                }
                .spm-btn-cancel {
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: var(--admin-text-main);
                    font-weight: 600;
                    cursor: pointer;
                }
                .spm-btn-save {
                    padding: 12px 22px;
                    border-radius: 12px;
                    border: none;
                    background: var(--sp-gradient);
                    color: #0f172a;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .spm-btn-save:hover { box-shadow: 0 8px 24px rgba(var(--sp-primary-rgb), 0.35); }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.35s ease forwards; }
            `}</style>
        </div>
    );
};

export default ServicesManager;
