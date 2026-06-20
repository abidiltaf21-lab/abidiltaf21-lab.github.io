import React, { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { toast } from 'react-toastify';
import { useSocialAccounts } from '../hooks/useSocialAccounts';
import { apiService } from '../services/api';

const SETTINGS_SECTIONS = [
    { id: 'branding' as const, icon: 'fa-fingerprint', label: 'Identity & Logo', hint: 'Site name & logo assets' },
    { id: 'hero' as const, icon: 'fa-rocket', label: 'Hero Experience', hint: 'Video, typewriter & CTA' },
    { id: 'gallery' as const, icon: 'fa-play-circle', label: 'Gallery', hint: 'Portfolio autoplay' },
    { id: 'social' as const, icon: 'fa-share-alt', label: 'Social Graph', hint: 'Channels & contact links' },
    { id: 'seo' as const, icon: 'fa-search', label: 'SEO Engine', hint: 'Search & metadata' },
];

type SettingsSection = (typeof SETTINGS_SECTIONS)[number]['id'];

const SiteSettings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [logoUploadProgress, setLogoUploadProgress] = useState(0);
    const [heroVideoUploadProgress, setHeroVideoUploadProgress] = useState(0);
    const { accounts: socialAccounts, refetch: refetchAccounts } = useSocialAccounts();

    const [editingAccount, setEditingAccount] = useState<any | null>(null);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [accountForm, setAccountForm] = useState({
        platform: '',
        value: '',
        link: '',
        icon: '',
        isVisible: true,
        sortOrder: 0
    });

    const [activeSection, setActiveSection] = useState<SettingsSection>('branding');
    const [settings, setSettings] = useState({
        heroTitle: '',
        heroSubtitle: '',
        heroVideoUrl: '',
        ctaText: '',
        ctaLink: '',
        siteName: '',
        logoUrl: '',
        seoDescription: '',
        socialInstagram: '',
        socialBehance: '',
        socialDribbble: '',
        socialLinkedIn: '',
        galleryAutoplay: true,
        heroVideoOpacity: 0.5,
        heroTypedText: '',
        heroTypedColor: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await apiClient.get('/SiteSettings');
            if (data) {
                // Map PascalCase from .NET to camelCase for local state
                setSettings({
                    heroTitle: data.heroTitle || data.HeroTitle || '',
                    heroSubtitle: data.heroSubtitle || data.HeroSubtitle || '',
                    heroVideoUrl: data.heroVideoUrl || data.HeroVideoUrl || '',
                    heroVideoOpacity: data.heroVideoOpacity ?? data.HeroVideoOpacity ?? 0.5,
                    ctaText: data.ctaText || data.CtaText || '',
                    ctaLink: data.ctaLink || data.CtaLink || '',
                    siteName: data.siteName || data.SiteName || '',
                    logoUrl: data.logoUrl || data.LogoUrl || '',
                    seoDescription: data.seoDescription || data.SeoDescription || '',
                    socialInstagram: data.socialInstagram || data.SocialInstagram || '',
                    socialBehance: data.socialBehance || data.SocialBehance || '',
                    socialDribbble: data.socialDribbble || data.SocialDribbble || '',
                    socialLinkedIn: data.socialLinkedIn || data.SocialLinkedIn || '',
                    galleryAutoplay: data.galleryAutoplay ?? data.GalleryAutoplay ?? true,
                    heroTypedText: data.heroTypedText || data.HeroTypedText || '',
                    heroTypedColor: data.heroTypedColor || data.HeroTypedColor || ''
                });
            }
        } catch (err) {
            toast.error("Failed to load system settings.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file (PNG, JPG, SVG, WebP).');
            e.target.value = '';
            return;
        }

        setLogoUploadProgress(10);

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
                setLogoUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setSettings((prev) => ({ ...prev, logoUrl: data.secure_url }));
                    toast.success('Logo uploaded. Click Save changes to publish.');
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
            setLogoUploadProgress(0);
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
                            setSettings((prev) => ({ ...prev, logoUrl: data.secure_url }));
                            setLogoUploadProgress(0);
                            toast.success('Logo uploaded. Click Save changes to publish.');
                            return;
                        }
                    } catch { /* fall through */ }
                }
                toast.error('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setLogoUploadProgress(0);
            };
            fxhr.onerror = () => {
                toast.error('Upload failed: could not reach backend or Cloudinary.');
                setLogoUploadProgress(0);
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const openCloudinaryLogoPicker = () => {
        const cloudinary = (window as any).cloudinary;
        if (!cloudinary?.createMediaLibrary) {
            toast.info('Cloudinary library not loaded. Paste a URL or upload from your computer.');
            return;
        }
        const ml = cloudinary.createMediaLibrary(
            {
                cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk',
                api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || '963385473771588',
                username: 'Admin',
            },
            {
                insertHandler: (data: { assets?: { secure_url?: string; resource_type?: string }[] }) => {
                    const asset = data.assets?.[0];
                    if (!asset?.secure_url) return;
                    if (asset.resource_type && asset.resource_type !== 'image') {
                        toast.error('Please select an image asset for the logo.');
                        return;
                    }
                    setSettings((prev) => ({ ...prev, logoUrl: asset.secure_url as string }));
                    toast.success('Logo selected from Cloudinary.');
                },
            }
        );
        ml.show();
    };

    const handleHeroVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setHeroVideoUploadProgress(10);

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
                setHeroVideoUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setSettings((prev) => ({ ...prev, heroVideoUrl: data.secure_url as string }));
                    toast.success('Video uploaded successfully.');
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
            setHeroVideoUploadProgress(0);
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
                            setSettings((prev) => ({ ...prev, heroVideoUrl: data.secure_url as string }));
                            setHeroVideoUploadProgress(0);
                            toast.success('Video uploaded successfully.');
                            return;
                        }
                    } catch { /* fall through */ }
                }
                toast.error('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setHeroVideoUploadProgress(0);
            };
            fxhr.onerror = () => {
                toast.error('Upload failed: could not reach backend or Cloudinary.');
                setHeroVideoUploadProgress(0);
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Strictly map to PascalCase for .NET
            const payload = {
                Id: (settings as any).id || (settings as any).Id || 0,
                HeroTitle: settings.heroTitle || (settings as any).HeroTitle,
                HeroSubtitle: settings.heroSubtitle || (settings as any).HeroSubtitle,
                HeroVideoUrl: settings.heroVideoUrl || (settings as any).HeroVideoUrl,
                HeroVideoOpacity: settings.heroVideoOpacity ?? (settings as any).HeroVideoOpacity ?? 0.5,
                CtaText: settings.ctaText || (settings as any).CtaText,
                CtaLink: settings.ctaLink || (settings as any).CtaLink,
                SiteName: settings.siteName || (settings as any).SiteName,
                LogoUrl: settings.logoUrl || (settings as any).LogoUrl,
                SeoDescription: settings.seoDescription || (settings as any).SeoDescription,
                SocialInstagram: settings.socialInstagram || (settings as any).SocialInstagram,
                SocialBehance: settings.socialBehance || (settings as any).SocialBehance,
                SocialDribbble: settings.socialDribbble || (settings as any).SocialDribbble,
                SocialLinkedIn: settings.socialLinkedIn || (settings as any).SocialLinkedIn,
                GalleryAutoplay: settings.galleryAutoplay ?? (settings as any).GalleryAutoplay ?? true,
                HeroTypedText: settings.heroTypedText || (settings as any).HeroTypedText,
                HeroTypedColor: settings.heroTypedColor || (settings as any).HeroTypedColor
            };
            await apiClient.put('/SiteSettings', payload);
            toast.success("System configurations updated successfully.");
            fetchSettings(); // Refresh to get correct mapping
        } catch (err) {
            toast.error("Cloud synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    const activeMeta = SETTINGS_SECTIONS.find((s) => s.id === activeSection)!;

    return (
        <div className="site-infra animate-fade-in">
            <header className="site-infra-hero">
                <div className="site-infra-hero-text">
                    <span className="site-infra-kicker">Global configuration</span>
                    <h1 className="site-infra-title">System Infrastructure</h1>
                    <p className="site-infra-desc">Branding, hero, gallery, social channels, and SEO — synced to the live site.</p>
                </div>
                <div className="site-infra-stats">
                    <div className="site-infra-stat">
                        <span className="site-infra-stat-val">{SETTINGS_SECTIONS.length}</span>
                        <span className="site-infra-stat-label">Modules</span>
                    </div>
                    <div className="site-infra-stat site-infra-stat-accent">
                        <span className="site-infra-stat-val"><i className="fas fa-bolt" /></span>
                        <span className="site-infra-stat-label">Live sync</span>
                    </div>
                </div>
            </header>

            <div className="site-infra-grid">
                <aside className="site-infra-nav glass-panel">
                    <p className="site-infra-nav-title">Configuration</p>
                    <nav className="site-infra-nav-list">
                        {SETTINGS_SECTIONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveSection(item.id)}
                                className={`site-infra-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                            >
                                <span className="site-infra-nav-icon"><i className={`fas ${item.icon}`} /></span>
                                <span className="site-infra-nav-copy">
                                    <span className="site-infra-nav-label">{item.label}</span>
                                    <span className="site-infra-nav-hint">{item.hint}</span>
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="site-infra-main">
                    <form onSubmit={handleSave} className="site-infra-form glass-panel">
                        <div className="site-infra-form-head">
                            <div>
                                <span className="site-infra-section-kicker">{activeMeta.label}</span>
                                <h2 className="site-infra-section-title">{activeMeta.hint}</h2>
                            </div>
                            <button type="submit" className="site-infra-save" disabled={loading}>
                                {loading ? <><i className="fas fa-sync fa-spin" /> Saving…</> : <><i className="fas fa-check" /> Save changes</>}
                            </button>
                        </div>
                        <div className="site-infra-form-body">

                {activeSection === 'branding' && (
                    <div className="site-infra-panel animate-fade-in">
                        <div className="row g-4">
                            <div className="col-lg-7">
                                <section className="site-infra-card">
                                    <h3 className="site-infra-card-title"><i className="fas fa-tag" /> Brand identity</h3>
                                    <div className="site-infra-field">
                                        <label className="site-infra-label">Global site label</label>
                                        <input type="text" name="siteName" className="site-infra-input" value={settings.siteName} onChange={handleChange} placeholder="e.g. SmooothPixel Studio" />
                                    </div>
                                    <div className="site-infra-field">
                                        <label className="site-infra-label">Site logo</label>
                                        <div className="site-infra-logo-row">
                                            <div className="site-infra-logo-thumb">
                                                {settings.logoUrl ? (
                                                    <img src={settings.logoUrl} alt="" onError={(ev) => { (ev.target as HTMLImageElement).style.opacity = '0.3'; }} />
                                                ) : (
                                                    <i className="fas fa-image" aria-hidden />
                                                )}
                                            </div>
                                            <div className="site-infra-logo-input-wrap">
                                                <input
                                                    type="text"
                                                    name="logoUrl"
                                                    className="site-infra-input"
                                                    value={settings.logoUrl}
                                                    onChange={handleChange}
                                                    placeholder="https://… or /assets/img/logo.png"
                                                />
                                                <label htmlFor="site-logo-upload" className="site-infra-upload-btn" title="Upload logo from computer">
                                                    {logoUploadProgress > 0 ? (
                                                        <span>{logoUploadProgress}%</span>
                                                    ) : (
                                                        <i className="fas fa-cloud-upload-alt" />
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        {logoUploadProgress > 0 && (
                                            <div className="site-infra-upload-bar" role="progressbar" aria-valuenow={logoUploadProgress} aria-valuemin={0} aria-valuemax={100}>
                                                <div className="site-infra-upload-bar-fill" style={{ width: `${logoUploadProgress}%` }} />
                                            </div>
                                        )}
                                        <div className="site-infra-logo-actions">
                                            <button type="button" className="site-infra-btn-ghost" onClick={() => document.getElementById('site-logo-upload')?.click()} disabled={logoUploadProgress > 0}>
                                                <i className="fas fa-upload" /> Upload image
                                            </button>
                                            <button type="button" className="site-infra-btn-ghost" onClick={openCloudinaryLogoPicker}>
                                                <i className="fas fa-cloud" /> Cloudinary
                                            </button>
                                            {settings.logoUrl && (
                                                <button
                                                    type="button"
                                                    className="site-infra-btn-ghost site-infra-btn-ghost-danger"
                                                    onClick={() => setSettings((prev) => ({ ...prev, logoUrl: '' }))}
                                                >
                                                    <i className="fas fa-times" /> Clear
                                                </button>
                                            )}
                                        </div>
                                        <input id="site-logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} hidden disabled={logoUploadProgress > 0} />
                                        <p className="site-infra-field-hint">PNG, JPG, SVG or WebP — used in header, footer, and favicon when saved.</p>
                                    </div>
                                </section>
                            </div>
                            <div className="col-lg-5">
                                <section className="site-infra-card site-infra-preview-card">
                                    <h3 className="site-infra-card-title"><i className="fas fa-eye" /> Live preview</h3>
                                    <div className="site-infra-brand-preview">
                                        <div className="site-infra-preview-bar">
                                            {settings.logoUrl ? (
                                                <img src={settings.logoUrl} alt="" className="site-infra-preview-logo" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            ) : (
                                                <span className="site-infra-preview-logo-fallback"><i className="fas fa-cube" /></span>
                                            )}
                                            <span className="site-infra-preview-name">{settings.siteName || 'SmooothPixel'}</span>
                                        </div>
                                        <p className="site-infra-preview-caption">Header appearance on the public site</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'hero' && (
                    <div className="site-infra-panel animate-fade-in">
                        <div className="mb-4">
                            <label className="form-label-premium">Hero Prime Title</label>
                            <input type="text" name="heroTitle" className="form-input-premium" value={settings.heroTitle} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label-premium">Strategic Subtitle</label>
                            <textarea name="heroSubtitle" className="form-input-premium" rows={3} value={settings.heroSubtitle} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="form-label-premium">Animated Typewriter Sequences (Comma separated)</label>
                            <input type="text" name="heroTypedText" className="form-input-premium" value={settings.heroTypedText} onChange={handleChange} placeholder="Video Editing,Motion Graphics,2D Animation" />
                            <p className="text-muted fs-11 mt-2">These phrases will rotate in the typewriter animation.</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label-premium">Typewriter Text Aesthetic (CSS Gradient or Color)</label>
                            <div className="d-flex gap-3 align-items-center">
                                <input type="text" name="heroTypedColor" className="form-input-premium" value={settings.heroTypedColor} onChange={handleChange} placeholder="linear-gradient(90deg, #8b5cf6, #3b82f6)" />
                                <div style={{ 
                                    width: '45px', 
                                    height: '45px', 
                                    borderRadius: '12px', 
                                    background: settings.heroTypedColor || 'var(--admin-accent)',
                                    border: '1px solid var(--admin-glass-border)',
                                    flexShrink: 0
                                }}></div>
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-8">
                                <label className="form-label-premium">Hero Stream Source (Direct MP4 / YouTube / Vimeo)</label>
                                <div className="d-flex gap-2">
                                    <input type="text" name="heroVideoUrl" className="form-input-premium" value={settings.heroVideoUrl} onChange={handleChange} placeholder="Paste YouTube link or Direct MP4 URL..." />
                                    <button
                                        type="button"
                                        className="btn-admin-secondary px-3"
                                        onClick={() => {
                                            toast.info("Opening Cloudinary Media Library...");
                                            const ml = (window as any).cloudinary.createMediaLibrary({
                                                cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk',
                                                api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || '963385473771588',
                                                username: 'Admin',
                                                button_class: 'my-custom-button',
                                                button_caption: 'Select Image'
                                            }, {
                                                insertHandler: (data: any) => {
                                                    const asset = data.assets[0];
                                                    setSettings({ ...settings, heroVideoUrl: asset.secure_url as string });
                                                    toast.success("Asset linked from Cloudinary!");
                                                }
                                            });
                                            ml.show();
                                        }}
                                        title="Browse Cloudinary Library"
                                    >
                                        <i className="fas fa-cloud"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-admin-secondary px-3"
                                        onClick={() => document.getElementById('hero-video-upload')?.click()}
                                        title="Upload from computer"
                                        disabled={heroVideoUploadProgress > 0}
                                    >
                                        {heroVideoUploadProgress > 0 ? `${heroVideoUploadProgress}%` : <><i className="fas fa-upload"></i></>}
                                    </button>
                                    <input
                                         type="file"
                                         id="hero-video-upload"
                                         hidden
                                         accept="video/*"
                                         onChange={handleHeroVideoUpload}
                                     />
                                </div>
                                <p className="text-muted fs-11 mt-2 mb-0">Supports YouTube/Vimeo links, Cloudinary assets, and direct uploads.</p>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label-premium">Visual Density ({Math.round(settings.heroVideoOpacity * 100)}%)</label>
                                <input 
                                    type="range" 
                                    name="heroVideoOpacity" 
                                    className="form-range custom-slider mt-2" 
                                    min="0" 
                                    max="1" 
                                    step="0.1" 
                                    value={settings.heroVideoOpacity} 
                                    onChange={(e) => setSettings({...settings, heroVideoOpacity: parseFloat(e.target.value)})} 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label-premium">Action Label (CTA)</label>
                                <input type="text" name="ctaText" className="form-input-premium" value={settings.ctaText} onChange={handleChange} placeholder="e.g. Hire Me Now" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label-premium">Navigation Link (CTA)</label>
                                <input type="text" name="ctaLink" className="form-input-premium" value={settings.ctaLink} onChange={handleChange} placeholder="/contact" />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'gallery' && (
                    <div className="site-infra-panel animate-fade-in">
                        <section className="site-infra-card">
                            <div className="site-infra-toggle-row">
                                <div>
                                    <h3 className="site-infra-card-title m-0"><i className="fas fa-play-circle" /> Portfolio autoplay</h3>
                                    <p className="site-infra-field-hint m-0 mt-1">Automatically play videos when visitors hover gallery items.</p>
                                </div>
                                <label className="site-infra-switch">
                                    <input type="checkbox" checked={settings.galleryAutoplay} onChange={(e) => setSettings({ ...settings, galleryAutoplay: e.target.checked })} />
                                    <span className="site-infra-switch-ui" />
                                </label>
                            </div>
                        </section>
                        <div className="site-infra-tip">
                            <i className="fas fa-info-circle" />
                            Autoplay improves engagement but may use more bandwidth on mobile networks.
                        </div>
                    </div>
                )}



                {activeSection === 'social' && (
                    <div className="site-infra-panel animate-fade-in">
                        {/* Static Configuration Graph */}
                        <div className="mb-5 border-bottom-glass pb-4">
                            <h6 className="text-white mb-3 fw-700 text-uppercase" style={{ letterSpacing: '1px', fontSize: '12px' }}>Legacy Accounts Routing (Static Fallbacks)</h6>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label-premium"><i className="fab fa-instagram me-2 text-pink-500"></i> Instagram Node</label>
                                    <input type="text" name="socialInstagram" className="form-input-premium" value={settings.socialInstagram} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label-premium"><i className="fab fa-behance me-2 text-blue-400"></i> Behance Portfolio</label>
                                    <input type="text" name="socialBehance" className="form-input-premium" value={settings.socialBehance} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label-premium"><i className="fab fa-dribbble me-2 text-pink-400"></i> Dribbble Shots</label>
                                    <input type="text" name="socialDribbble" className="form-input-premium" value={settings.socialDribbble} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label-premium"><i className="fab fa-linkedin me-2 text-blue-500"></i> LinkedIn Professional</label>
                                    <input type="text" name="socialLinkedIn" className="form-input-premium" value={settings.socialLinkedIn} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Social & Contact Hub CRUD Panel */}
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 className="text-white m-0 fw-700 text-uppercase" style={{ letterSpacing: '1px', fontSize: '12px' }}>Dynamic Social & Contact Accounts</h6>
                                    <p className="text-muted m-0 fs-12">Dynamic links & communication channels managed instantly on frontend.</p>
                                </div>
                                {!isCreatingAccount && !editingAccount && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsCreatingAccount(true);
                                            setEditingAccount(null);
                                            setAccountForm({ platform: '', value: '', link: '', icon: '', isVisible: true, sortOrder: socialAccounts.length });
                                        }} 
                                        className="btn-neon py-2 px-3"
                                        style={{ fontSize: '12px' }}
                                    >
                                        <i className="fas fa-plus me-2"></i> Register New Profile
                                    </button>
                                )}
                            </div>

                            {/* Add / Edit Inline Editor Form */}
                            {(isCreatingAccount || editingAccount) && (
                                <div className="glass-panel-inner p-4 mb-4 rounded-4 animate-fade-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom-glass">
                                        <h6 className="text-white m-0 fw-700">
                                            {editingAccount ? `Edit Profile: ${editingAccount.platform}` : 'Register New Social/Contact Profile'}
                                        </h6>
                                        <span className="text-muted fs-12">All details synchronize in database.</span>
                                    </div>
                                    
                                    {/* Preset selection pills */}
                                    <div className="mb-4">
                                        <label className="form-label-premium fs-12 mb-2 d-block">Quick Select Template</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {[
                                                { label: 'Telegram Support', platform: 'Telegram', icon: 'fab fa-telegram-plane', link: 'https://t.me/SmooothPixel', value: '@SmooothPixel' },
                                                { label: 'Official Email', platform: 'Email', icon: 'fas fa-envelope', link: 'mailto:info@smooothpixel.com', value: 'info@smooothpixel.com' },
                                                { label: 'Behance Portfolio', platform: 'Behance', icon: 'fab fa-behance', link: 'https://behance.net/smooothpixel', value: 'Behance Portfolio' },
                                                { label: 'Dribbble Shots', platform: 'Dribbble', icon: 'fab fa-dribbble', link: 'https://dribbble.com/smooothpixel', value: 'Dribbble' },
                                                { label: 'Instagram Account', platform: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com/smooothpixel', value: '@SmooothPixel' },
                                                { label: 'Berlin Location', platform: 'Location', icon: 'fas fa-map-marker-alt', link: '#', value: 'Berlin, Germany' }
                                            ].map((tpl) => (
                                                <button
                                                    key={tpl.label}
                                                    type="button"
                                                    className="btn-admin-secondary px-3 py-1 fs-11"
                                                    onClick={() => {
                                                        setAccountForm({
                                                            platform: tpl.platform,
                                                            value: tpl.value,
                                                            link: tpl.link,
                                                            icon: tpl.icon,
                                                            isVisible: true,
                                                            sortOrder: accountForm.sortOrder
                                                        });
                                                        toast.info(`Loaded ${tpl.platform} preset!`);
                                                    }}
                                                >
                                                    <i className={`${tpl.icon} me-1`}></i> {tpl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label-premium">Platform Name</label>
                                            <input 
                                                type="text" 
                                                className="form-input-premium" 
                                                value={accountForm.platform} 
                                                onChange={(e) => setAccountForm({ ...accountForm, platform: e.target.value })} 
                                                placeholder="e.g. Telegram, Email, Instagram..."
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label-premium">Display Value / Handle</label>
                                            <input 
                                                type="text" 
                                                className="form-input-premium" 
                                                value={accountForm.value} 
                                                onChange={(e) => setAccountForm({ ...accountForm, value: e.target.value })} 
                                                placeholder="e.g. @SmooothPixel or info@smooothpixel.com"
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label-premium">External Hyperlink URL</label>
                                            <input 
                                                type="text" 
                                                className="form-input-premium" 
                                                value={accountForm.link} 
                                                onChange={(e) => setAccountForm({ ...accountForm, link: e.target.value })} 
                                                placeholder="e.g. https://t.me/SmooothPixel or mailto:..."
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label-premium">FontAwesome Icon Class</label>
                                            <input 
                                                type="text" 
                                                className="form-input-premium" 
                                                value={accountForm.icon} 
                                                onChange={(e) => setAccountForm({ ...accountForm, icon: e.target.value })} 
                                                placeholder="e.g. fab fa-telegram-plane"
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center gap-3">
                                            <div className="form-check form-switch pt-4">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    id="channelVisible"
                                                    checked={accountForm.isVisible} 
                                                    onChange={(e) => setAccountForm({ ...accountForm, isVisible: e.target.checked })}
                                                    style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                                                />
                                                <label className="form-check-label text-white-50 ms-2 fs-12" htmlFor="channelVisible">Visible on Public Site</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label-premium">Sorting Index Order</label>
                                            <input 
                                                type="number" 
                                                className="form-input-premium" 
                                                value={accountForm.sortOrder} 
                                                onChange={(e) => setAccountForm({ ...accountForm, sortOrder: parseInt(e.target.value) || 0 })} 
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top-glass">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setIsCreatingAccount(false);
                                                setEditingAccount(null);
                                                setAccountForm({ platform: '', value: '', link: '', icon: '', isVisible: true, sortOrder: 0 });
                                            }} 
                                            className="btn-admin-secondary px-4 py-2"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                if (!accountForm.platform || !accountForm.value || !accountForm.link) {
                                                    toast.error("Platform, Value, and Link are required fields.");
                                                    return;
                                                }
                                                setLoading(true);
                                                try {
                                                    const payload = {
                                                        Id: editingAccount ? editingAccount.id : 0,
                                                        Platform: accountForm.platform,
                                                        Value: accountForm.value,
                                                        Icon: accountForm.icon || 'fas fa-link',
                                                        Link: accountForm.link || '#',
                                                        IsVisible: accountForm.isVisible,
                                                        SortOrder: Number(accountForm.sortOrder)
                                                    };

                                                    if (editingAccount) {
                                                        await apiService.updateSocialAccount(editingAccount.id, payload);
                                                        toast.success(`${accountForm.platform} channel updated!`);
                                                    } else {
                                                        await apiService.createSocialAccount(payload);
                                                        toast.success(`Registered ${accountForm.platform} successfully!`);
                                                    }
                                                    
                                                    setEditingAccount(null);
                                                    setIsCreatingAccount(false);
                                                    setAccountForm({ platform: '', value: '', link: '', icon: '', isVisible: true, sortOrder: 0 });
                                                    refetchAccounts();
                                                } catch (err) {
                                                    toast.error("Failed to commit channel configurations.");
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="btn-neon px-4 py-2"
                                        >
                                            Commit Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Accounts Grid */}
                            {socialAccounts.length === 0 ? (
                                <div className="text-center py-5 rounded-4 glass-panel-inner" style={{ background: 'rgba(255,255,255,0.01)' }}>
                                    <i className="fas fa-share-alt text-muted mb-3 fs-1 d-block"></i>
                                    <p className="text-white-50 m-0">No dynamic accounts recorded yet.</p>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsCreatingAccount(true);
                                            setEditingAccount(null);
                                            setAccountForm({ platform: '', value: '', link: '', icon: 'fab fa-telegram-plane', isVisible: true, sortOrder: 0 });
                                        }}
                                        className="btn-admin-secondary mt-3 px-3 py-1 fs-12"
                                    >
                                        Create First Account
                                    </button>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {socialAccounts.map((account: any) => (
                                        <div key={account.id} className="col-md-6">
                                            <div className="glass-panel-inner p-3 rounded-4 d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div 
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{ 
                                                            width: '42px', 
                                                            height: '42px', 
                                                            borderRadius: '50%', 
                                                            background: account.isVisible ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                                                            color: account.isVisible ? 'var(--admin-accent)' : '#64748b',
                                                            fontSize: '18px'
                                                        }}
                                                    >
                                                        <i className={account.icon}></i>
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="text-white fw-700 fs-13">{account.platform}</span>
                                                            <span className={`badge fs-10 ${account.isVisible ? 'bg-soft-success text-success' : 'bg-soft-secondary text-muted'}`}>
                                                                {account.isVisible ? 'Active' : 'Hidden'}
                                                            </span>
                                                        </div>
                                                        <a href={account.link} target="_blank" rel="noopener noreferrer" className="text-muted fs-11 text-decoration-none">
                                                            {account.value} <i className="fas fa-external-link-alt fs-9 ms-1"></i>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Quick visibility toggle */}
                                                    <button 
                                                        type="button" 
                                                        onClick={async () => {
                                                            try {
                                                                const payload = {
                                                                    Id: account.id,
                                                                    Platform: account.platform,
                                                                    Value: account.value,
                                                                    Icon: account.icon,
                                                                    Link: account.link,
                                                                    IsVisible: !account.isVisible,
                                                                    SortOrder: account.sortOrder
                                                                };
                                                                await apiService.updateSocialAccount(account.id, payload);
                                                                toast.success(`${account.platform} visibility updated!`);
                                                                refetchAccounts();
                                                            } catch (err) {
                                                                toast.error("Failed to update visibility.");
                                                            }
                                                        }}
                                                        className="btn-admin-secondary p-2" 
                                                        title="Quick Toggle Visibility"
                                                    >
                                                        <i className={`fas ${account.isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                    </button>

                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setEditingAccount(account);
                                                            setIsCreatingAccount(false);
                                                            setAccountForm({
                                                                platform: account.platform,
                                                                value: account.value,
                                                                link: account.link,
                                                                icon: account.icon,
                                                                isVisible: account.isVisible,
                                                                sortOrder: account.sortOrder
                                                            });
                                                        }}
                                                        className="btn-admin-secondary p-2"
                                                        title="Edit Channel"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    
                                                    <button 
                                                        type="button" 
                                                        onClick={async () => {
                                                            if (!window.confirm(`Are you sure you want to delete ${account.platform} channel?`)) return;
                                                            try {
                                                                await apiService.deleteSocialAccount(account.id);
                                                                toast.success("Dynamic account deleted.");
                                                                refetchAccounts();
                                                            } catch (err) {
                                                                    toast.error("Failed to delete account.");
                                                            }
                                                        }}
                                                        className="btn-admin-secondary p-2 text-danger" 
                                                        title="Delete Channel"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'seo' && (
                    <div className="site-infra-panel animate-fade-in">
                        <section className="site-infra-card">
                            <h3 className="site-infra-card-title"><i className="fas fa-search" /> SEO description</h3>
                            <div className="site-infra-field">
                                <label className="site-infra-label">Meta description</label>
                                <textarea name="seoDescription" className="site-infra-input" rows={6} value={settings.seoDescription} onChange={handleChange} placeholder="Brief summary for Google and social previews…" />
                                <p className="site-infra-field-hint">{settings.seoDescription.length} characters · aim for 120–160 for best results</p>
                            </div>
                        </section>
                    </div>
                )}
                        </div>
                    </form>
                </main>
            </div>

            <style>{`
                /* System Infrastructure — premium admin UI */
                .site-infra { color: var(--admin-text-main); }
                .site-infra-hero {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 20px;
                    margin-bottom: 28px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--admin-glass-border);
                }
                .site-infra-kicker {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--admin-accent);
                }
                .site-infra-title {
                    margin: 6px 0 0;
                    font-size: clamp(1.75rem, 3vw, 2.25rem);
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: var(--admin-text-main);
                }
                .site-infra-desc {
                    margin: 8px 0 0;
                    max-width: 520px;
                    color: var(--admin-text-muted);
                    font-size: 14px;
                    line-height: 1.6;
                }
                .site-infra-stats { display: flex; gap: 12px; }
                .site-infra-stat {
                    min-width: 88px;
                    padding: 14px 18px;
                    border-radius: 14px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-glass);
                    text-align: center;
                }
                .site-infra-stat-accent {
                    border-color: rgba(var(--sp-primary-rgb), 0.35);
                    background: rgba(var(--sp-primary-rgb), 0.08);
                }
                .site-infra-stat-val {
                    display: block;
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: var(--admin-text-main);
                    line-height: 1.2;
                }
                .site-infra-stat-accent .site-infra-stat-val { color: var(--admin-accent); }
                .site-infra-stat-label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--admin-text-muted);
                }
                .site-infra-grid {
                    display: grid;
                    grid-template-columns: minmax(240px, 280px) 1fr;
                    gap: 20px;
                    align-items: start;
                }
                @media (max-width: 991px) {
                    .site-infra-grid { grid-template-columns: 1fr; }
                }
                .site-infra-nav { padding: 16px !important; position: sticky; top: 16px; }
                .site-infra-nav-title {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--admin-text-muted);
                    margin: 0 0 12px 4px;
                }
                .site-infra-nav-list { display: flex; flex-direction: column; gap: 6px; }
                .site-infra-nav-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid transparent;
                    border-radius: 14px;
                    background: transparent;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .site-infra-nav-btn:hover {
                    background: rgba(var(--sp-primary-rgb), 0.06);
                    border-color: var(--admin-glass-border);
                }
                .site-infra-nav-btn.active {
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    border-color: rgba(var(--sp-primary-rgb), 0.3);
                }
                .site-infra-nav-icon {
                    width: 38px; height: 38px;
                    border-radius: 11px;
                    background: rgba(var(--sp-primary-rgb), 0.1);
                    color: var(--admin-accent);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .site-infra-nav-btn.active .site-infra-nav-icon {
                    background: var(--admin-accent);
                    color: #0f172a;
                }
                .site-infra-nav-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
                .site-infra-nav-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                }
                .site-infra-nav-hint {
                    font-size: 11px;
                    color: var(--admin-text-muted);
                }
                .site-infra-form {
                    padding: 0 !important;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 480px;
                }
                .site-infra-form-head {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    padding: 22px 24px;
                    border-bottom: 1px solid var(--admin-glass-border);
                    background: linear-gradient(180deg, rgba(var(--sp-primary-rgb), 0.05) 0%, transparent 100%);
                }
                .site-infra-section-kicker {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--admin-accent);
                }
                .site-infra-section-title {
                    margin: 4px 0 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--admin-text-main);
                }
                .site-infra-save {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 12px;
                    background: var(--sp-gradient);
                    color: #0f172a;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: box-shadow 0.2s, transform 0.2s;
                }
                .site-infra-save:hover:not(:disabled) {
                    box-shadow: 0 8px 24px rgba(var(--sp-primary-rgb), 0.35);
                    transform: translateY(-1px);
                }
                .site-infra-save:disabled { opacity: 0.7; cursor: wait; }
                .site-infra-form-body {
                    padding: 20px 24px 28px;
                    flex: 1;
                }
                .site-infra-panel { display: flex; flex-direction: column; gap: 16px; }
                .site-infra-card {
                    padding: 18px 20px;
                    border-radius: 16px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg);
                }
                .site-infra-card-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                    margin: 0 0 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .site-infra-card-title i { color: var(--admin-accent); font-size: 13px; }
                .site-infra-field { margin-bottom: 16px; }
                .site-infra-field:last-child { margin-bottom: 0; }
                .site-infra-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--admin-text-muted);
                    margin-bottom: 8px;
                }
                .site-infra-input {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg-alt);
                    color: var(--admin-text-main);
                    font-size: 14px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .site-infra-input:focus {
                    outline: none;
                    border-color: var(--admin-accent);
                    box-shadow: 0 0 0 3px rgba(var(--sp-primary-rgb), 0.15);
                }
                .site-infra-field-hint {
                    margin: 8px 0 0;
                    font-size: 12px;
                    color: var(--admin-text-muted);
                    line-height: 1.5;
                }
                .site-infra-brand-preview { padding: 8px 0; }
                .site-infra-preview-bar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-glass);
                }
                .site-infra-preview-logo { height: 32px; max-width: 120px; object-fit: contain; }
                .site-infra-preview-logo-fallback {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: var(--admin-accent);
                    color: #0f172a;
                    display: flex; align-items: center; justify-content: center;
                }
                .site-infra-preview-name {
                    font-size: 16px;
                    font-weight: 800;
                    color: var(--admin-text-main);
                }
                .site-infra-preview-caption {
                    margin: 10px 0 0;
                    font-size: 11px;
                    color: var(--admin-text-muted);
                }
                .site-infra-logo-row {
                    display: flex;
                    gap: 12px;
                    align-items: stretch;
                }
                .site-infra-logo-thumb {
                    width: 64px;
                    height: 64px;
                    border-radius: 14px;
                    border: 1px solid var(--admin-glass-border);
                    background: var(--admin-bg-alt);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .site-infra-logo-thumb img {
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                }
                .site-infra-logo-thumb i {
                    font-size: 22px;
                    color: var(--admin-text-muted);
                }
                .site-infra-logo-input-wrap {
                    flex: 1;
                    position: relative;
                }
                .site-infra-logo-input-wrap .site-infra-input {
                    padding-right: 48px;
                }
                .site-infra-upload-btn {
                    position: absolute;
                    right: 6px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1px solid var(--admin-glass-border);
                    background: rgba(var(--sp-primary-rgb), 0.08);
                    color: var(--admin-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin: 0;
                    font-size: 11px;
                    font-weight: 700;
                }
                .site-infra-upload-btn:hover {
                    background: rgba(var(--sp-primary-rgb), 0.15);
                }
                .site-infra-upload-bar {
                    height: 6px;
                    border-radius: 999px;
                    background: var(--admin-glass-border);
                    margin-top: 10px;
                    overflow: hidden;
                }
                .site-infra-upload-bar-fill {
                    height: 100%;
                    border-radius: 999px;
                    background: var(--admin-accent);
                    transition: width 0.2s ease;
                }
                .site-infra-logo-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }
                .site-infra-btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 10px;
                    border: 1px solid var(--admin-glass-border);
                    background: rgba(var(--sp-primary-rgb), 0.05);
                    color: var(--admin-text-main);
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .site-infra-btn-ghost:hover:not(:disabled) {
                    border-color: var(--admin-accent);
                    color: var(--admin-accent);
                }
                .site-infra-btn-ghost:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .site-infra-btn-ghost-danger:hover:not(:disabled) {
                    border-color: #f43f5e;
                    color: #f43f5e;
                }
                .site-infra-toggle-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }
                .site-infra-switch {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin: 0;
                }
                .site-infra-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
                .site-infra-switch-ui {
                    width: 48px; height: 26px;
                    border-radius: 999px;
                    background: var(--admin-glass-border);
                    position: relative;
                    transition: background 0.2s;
                }
                .site-infra-switch-ui::after {
                    content: '';
                    position: absolute;
                    top: 3px; left: 3px;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    background: #fff;
                    transition: transform 0.2s;
                }
                .site-infra-switch input:checked + .site-infra-switch-ui { background: var(--admin-accent); }
                .site-infra-switch input:checked + .site-infra-switch-ui::after { transform: translateX(22px); }
                .site-infra-tip {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(var(--sp-primary-rgb), 0.2);
                    background: rgba(var(--sp-primary-rgb), 0.06);
                    color: var(--admin-text-muted);
                    font-size: 13px;
                    line-height: 1.5;
                }
                .site-infra-tip i { color: var(--admin-accent); margin-top: 2px; }

                /* Legacy fields inside panels */
                .site-infra .form-label-premium {
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-transform: none;
                    color: var(--admin-text-muted);
                }
                .site-infra .form-input-premium {
                    background: var(--admin-bg-alt) !important;
                    border-color: var(--admin-glass-border) !important;
                    color: var(--admin-text-main) !important;
                    border-radius: 12px !important;
                    padding: 12px 14px !important;
                }
                .site-infra .form-input-premium:focus {
                    border-color: var(--admin-accent) !important;
                    box-shadow: 0 0 0 3px rgba(var(--sp-primary-rgb), 0.15) !important;
                }
                .site-infra .text-white,
                .site-infra h6.text-white { color: var(--admin-text-main) !important; }
                .site-infra .custom-slider { accent-color: var(--admin-accent); width: 100%; }
                .site-infra .glass-panel-inner {
                    border: 1px solid var(--admin-glass-border) !important;
                    background: var(--admin-bg) !important;
                    border-radius: 14px !important;
                }
            `}</style>
        </div>
    );
};

export default SiteSettings;
