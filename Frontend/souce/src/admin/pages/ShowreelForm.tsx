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

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'smooothpixel_upload');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(prev => ({ ...prev, [field]: percent }));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const res = JSON.parse(xhr.responseText);
                setFormData(prev => ({ ...prev, [field]: res.secure_url }));
                if (field === 'videoUrl' && !formData.thumb) {
                    setFormData(prev => ({ ...prev, thumb: res.secure_url.replace(/\.(mp4|webm|mov|ts)$/i, '.jpg') }));
                }
            } else {
                const errorText = xhr.responseText || '{}';
                let errorMsg = 'Upload failed';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error?.message || errorMsg;
                } catch (_e) { /* ignore JSON parse error */ }
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'MISSING';
                alert('Upload Error: ' + errorMsg + ' (Status: ' + xhr.status + ') | Cloud: ' + cloudName);
            }
            setUploadProgress(prev => ({ ...prev, [field]: 0 }));
        };

        xhr.send(uploadData);
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
