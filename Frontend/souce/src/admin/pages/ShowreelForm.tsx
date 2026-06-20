import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';

const ShowreelForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumb: '',
        tags: '',
        clientName: '',
        duration: '',
        isFeatured: false,
        visibility: 'Public',
        projectDate: ''
    });

    useEffect(() => {
        if (id) {
            const fetchVideo = async () => {
                try {
                    const { data } = await apiService.getVideo(id);
                    setFormData({
                        ...data,
                        tags: data.tags || '',
                        projectDate: data.projectDate?.split('T')[0] || ''
                    });
                } catch (err) {
                    console.error("Failed to fetch video:", err);
                }
            };
            fetchVideo();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const final = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: final }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadProgress(prev => ({ ...prev, [field]: 10 })); // Start progress

        // Prefer server-side upload through the backend. This:
        //   - keeps the Cloudinary API_SECRET on the server only
        //   - bypasses any browser CORS quirks
        //   - returns the same Cloudinary response shape (secure_url, public_id, …)
        // Falls back to direct unsigned upload to Cloudinary if the backend endpoint
        // is unreachable (e.g. user is running frontend only).
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        const apiBaseUrl = (
            import.meta.env.VITE_PRODUCTION_API_URL ||
            import.meta.env.VITE_API_BASE_URL ||
            ''
        ).replace(/\/$/, '');

        xhr.open('POST', `${apiBaseUrl}/cloudinary/upload`);

        // Attach admin JWT if present — the endpoint requires [Authorize]
        const token = localStorage.getItem('adminToken');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(prev => ({ ...prev, [field]: percentComplete }));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setFormData(prev => ({ ...prev, [field]: data.secure_url }));
                    // If we uploaded a video and have no thumbnail, auto-fill from Cloudinary's .jpg variant
                    if (field === 'videoUrl' && !formData.thumb && data.secure_url.match(/\.(mp4|webm|mov|ts)$/i)) {
                        setFormData(prev => ({ ...prev, thumb: data.secure_url.replace(/\.(mp4|webm|mov|ts)$/i, '.jpg') }));
                    }
                } else {
                    alert('Upload failed: unexpected response from server.');
                }
            } else if (xhr.status === 401) {
                alert('Upload failed: not authorized. Please log in again.');
            } else if (xhr.status === 503) {
                alert('Upload failed: Cloudinary is not configured on the server. Set Cloudinary__* env vars in Backend/appsettings.');
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

                alert(msg);
            }
            setUploadProgress(prev => ({ ...prev, [field]: 0 }));
        };

        xhr.onerror = () => {
            // Backend unreachable → try direct Cloudinary upload as last resort.
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
                            setFormData(prev => ({ ...prev, [field]: data.secure_url }));
                            setUploadProgress(prev => ({ ...prev, [field]: 0 }));
                            return;
                        }
                    } catch { /* fall through */ }
                }
                alert('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setUploadProgress(prev => ({ ...prev, [field]: 0 }));
            };
            fxhr.onerror = () => {
                alert('Upload failed: could not reach backend or Cloudinary.');
                setUploadProgress(prev => ({ ...prev, [field]: 0 }));
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const captureFrame = () => {
        if (!formData.videoUrl) return;
        
        if (formData.videoUrl.includes('res.cloudinary.com')) {
            const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
            
            // Construct Cloudinary URL with time offset
            let baseUrl = formData.videoUrl.replace(/\.(mp4|webm|mov|ts)(\?.*)?$/i, '.jpg');
            
            if (baseUrl.includes('/video/upload/')) {
                baseUrl = baseUrl.replace('/video/upload/', `/video/upload/so_${currentTime}/`);
            } else if (baseUrl.includes('/auto/upload/')) {
                baseUrl = baseUrl.replace('/auto/upload/', `/video/upload/so_${currentTime}/`);
            }
            
            setFormData(prev => ({ ...prev, thumb: baseUrl }));
            alert(`Frame captured at ${currentTime}s. Thumbnail updated!`);
        } else {
            alert('Manual frame capture is optimized for Cloudinary videos. For other links, please upload a custom image.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                Id: id ? parseInt(id) : 0,
                Title: formData.title,
                VideoUrl: formData.videoUrl,
                Description: formData.description,
                Thumb: formData.thumb,
                Tags: formData.tags,
                IsFeatured: formData.isFeatured,
                Visibility: formData.visibility,
                Duration: formData.duration,
                ClientName: formData.clientName,
                ProjectDate: formData.projectDate || null,
                Views: 0
            };

            if (id) {
                await apiService.updateVideo(id, payload);
            } else {
                await apiService.createVideo(payload);
            }
            navigate('/admin/showreel');
        } catch (err: any) {
            const errorMsg = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(', ')
                : (err.response?.data?.message || err.message);
            alert('Sync Error (400): ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in premium-admin-bg p-4">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="admin-title text-white">{id ? 'Edit Showreel Asset' : 'New Showreel Asset'}</h2>
                <button className="btn-admin-secondary" onClick={() => navigate('/admin/showreel')}>Back to Library</button>
            </div>

            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-lg-7">
                    <div className="glass-panel p-4">
                        <div className="mb-4">
                            <label className="form-label-premium">Title</label>
                            <input type="text" name="title" className="form-input-premium" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label-premium">Video URL (Cloudinary, YouTube, or direct link)</label>
                            <div className="d-flex gap-2">
                                <input type="text" name="videoUrl" className="form-input-premium" value={formData.videoUrl} onChange={handleChange} required />
                                <button 
                                    type="button" 
                                    className="btn-admin-primary px-3" 
                                    onClick={() => {
                                        const ml = (window as any).cloudinary.createMediaLibrary({
                                            cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddxrpqctk',
                                            api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || '963385473771588',
                                            username: 'Admin',
                                            button_class: 'my-custom-button',
                                            button_caption: 'Select Video'
                                        }, {
                                            insertHandler: (data: any) => {
                                                const asset = data.assets[0];
                                                setFormData({ ...formData, videoUrl: asset.secure_url });
                                                if (!formData.thumb) {
                                                    setFormData(prev => ({ ...prev, thumb: asset.secure_url.replace(/\.(mp4|webm|mov|ts)$/i, '.jpg') }));
                                                }
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
                                    className="btn-admin-primary px-3" 
                                    onClick={() => document.getElementById('showreel-video-upload')?.click()}
                                    title="Upload from computer"
                                >
                                    <i className="fas fa-upload"></i>
                                </button>
                                <input 
                                    type="file" 
                                    id="showreel-video-upload" 
                                    hidden 
                                    accept="video/*" 
                                    onChange={(e) => handleFileUpload(e, 'videoUrl')} 
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label-premium">Description</label>
                            <textarea name="description" className="form-input-premium" rows={4} value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="form-label-premium">Duration (e.g. 00:45)</label>
                                <input type="text" name="duration" className="form-input-premium" value={formData.duration} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label-premium">Client Name</label>
                                <input type="text" name="clientName" className="form-input-premium" value={formData.clientName} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="glass-panel p-4">
                        <h5 className="text-white mb-4">Asset Preview & Meta</h5>
                        
                        {formData.videoUrl && (
                            <div className="preview-container mb-4" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                                <video ref={videoRef} src={formData.videoUrl} controls className="w-100 h-100 object-fit-cover" />
                                <button type="button" onClick={captureFrame} className="btn-admin-primary" style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '12px' }}>
                                    <i className="fas fa-camera me-1"></i> Capture Thumb
                                </button>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="form-label-premium">Thumbnail URL</label>
                            <div className="d-flex gap-2">
                                <input type="text" name="thumb" className="form-input-premium" value={formData.thumb} onChange={handleChange} />
                                <label className="btn-admin-primary m-0" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    <i className="fas fa-image"></i>
                                    <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'thumb')} />
                                </label>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center p-3 glass-panel-accent mb-4">
                            <span className="text-white fw-700">Feature in Showreel?</span>
                            <div className={`toggle-v2 ${formData.isFeatured ? 'active' : ''}`} onClick={() => setFormData(p => ({ ...p, isFeatured: !p.isFeatured }))}>
                                <div className="toggle-handle"></div>
                            </div>
                        </div>

                        <button type="submit" className="btn-neon w-100 py-3" disabled={loading}>
                            {loading ? <i className="fas fa-sync fa-spin me-2"></i> : <i className="fas fa-save me-2"></i>}
                            {id ? 'Update Asset' : 'Publish to Showreel'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ShowreelForm;
