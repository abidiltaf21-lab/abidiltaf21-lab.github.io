import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCategories } from '../hooks/useCategories';

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { categories, loading: categoriesLoading } = useCategories();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumb: '',
        tags: '',
        clientName: '',
        projectDate: '',
        duration: '',
        isFeatured: false,
        visibility: 'public',
        projectType: '',
        industry: '',
        skills: '',
        challenge: '',
        solution: '',
        result: '',
        testimonial: ''
    });

    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    function getEmbedUrl(url: string) {
        if (!url) return '';
        let embedUrl = url;
        if (url.includes('youtube.com/shorts/')) embedUrl = url.replace('youtube.com/shorts/', 'youtube.com/embed/');
        else if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
        else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
        else if (url.includes('vimeo.com/')) {
            const vidId = url.split('/').pop();
            embedUrl = `https://player.vimeo.com/video/${vidId}`;
        }
        if (embedUrl.includes('youtube.com/embed/')) {
            const sep = embedUrl.includes('?') ? '&' : '?';
            embedUrl += `${sep}modestbranding=1&rel=0&showinfo=0`;
        }
        return embedUrl;
    }

    function getYoutubeThumbnail(url: string) {
        let vidId = '';
        if (url.includes('v=')) vidId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes('shorts/')) vidId = url.split('shorts/')[1]?.split('?')[0];
        else if (url.includes('youtu.be/')) vidId = url.split('youtu.be/')[1]?.split('?')[0];
        return vidId ? `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg` : '';
    }

    // Auto-extract thumbnail for YouTube videos
    useEffect(() => {
        if (formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be')) {
            const thumb = getYoutubeThumbnail(formData.videoUrl);
            if (thumb && !formData.thumb) setFormData(prev => ({ ...prev, thumb }));
        }
    }, [formData.videoUrl, formData.thumb]);

    // Professional Frame Capture Logic
    const captureFrame = () => {
        if (!formData.videoUrl) return;
        
        // If it's a Cloudinary video, we can use the 'so_' (start offset) parameter to pick an exact second!
        if (formData.videoUrl.includes('res.cloudinary.com')) {
            const videoElement = document.querySelector('video.w-100') as HTMLVideoElement;
            const currentTime = videoElement ? Math.floor(videoElement.currentTime) : 0;
            
            // Construct Cloudinary URL with time offset
            // Format: .../video/upload/so_5/v123/sample.jpg
            let baseUrl = formData.videoUrl.replace(/\.(mp4|webm|mov|ts)(\?.*)?$/i, '.jpg');
            
            if (baseUrl.includes('/video/upload/')) {
                baseUrl = baseUrl.replace('/video/upload/', `/video/upload/so_${currentTime}/`);
            } else if (baseUrl.includes('/auto/upload/')) {
                baseUrl = baseUrl.replace('/auto/upload/', `/video/upload/so_${currentTime}/`);
            }
            
            setFormData(prev => ({ ...prev, thumb: baseUrl }));
            alert(`Frame captured at ${currentTime}s. Thumbnail updated!`);
        } else if (formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be')) {
            const thumbUrl = getYoutubeThumbnail(formData.videoUrl);
            setFormData(prev => ({ ...prev, thumb: thumbUrl }));
        } else {
            alert('Manual frame capture is optimized for Cloudinary videos. For other links, please upload a custom image.');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'videoUrl' | 'thumb') => {
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

        const xhr = new XMLHttpRequest();const apiBaseUrl =
  import.meta.env.VITE_PRODUCTION_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '';

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
                    if (field === 'videoUrl' && !formData.thumb && data.secure_url.match(/\.(mp4|webm|mov)$/i)) {
                        setFormData(prev => ({ ...prev, thumb: data.secure_url.replace(/\.(mp4|webm|mov)$/i, '.jpg') }));
                    }
                } else {
                    alert('Upload failed: unexpected response from server.');
                }
            } else if (xhr.status === 401) {
                alert('Upload failed: not authorized. Please log in again.');
            } else if (xhr.status === 503) {
                alert('Upload failed: Cloudinary is not configured on the server. Set Cloudinary__* env vars in Backend/appsettings.');
            } else {
                // Try to extract Cloudinary's error message
                let msg = `Upload failed (HTTP ${xhr.status})`;
                try {
                    const err = JSON.parse(xhr.responseText);
                    if (err?.error) msg = `Upload failed: ${err.error}`;
                } catch { /* keep generic */ }
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

    const fetchProject = useCallback(async () => {
        try {
            const { data } = await apiService.getProject(id as string);
            if (data) {
                setFormData({
                    ...data,
                    tags: data.tags || '',
                    projectDate: data.projectDate?.split('T')[0] || '',
                    projectType: data.projectType || '',
                    industry: data.industry || '',
                    skills: data.skills || '',
                    challenge: data.challenge || '',
                    solution: data.solution || '',
                    result: data.result || '',
                    testimonial: data.testimonial || ''
                });
            }
        } catch (err: any) {
            console.error("Sync failed:", err);
            // Non-blocking error, just continue
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id, fetchProject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const final = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: final }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Transform data for .NET backend expectations
            const payload = {
                ...formData,
                id: id ? parseInt(id) : 0,
                // .NET DateTime? doesn't like empty strings, use null
                projectDate: formData.projectDate || null,
                // Ensure required fields are present with correct PascalCase mapping if needed
                // (Most .NET APIs handle camelCase, but explicit mapping is safer if 400 occurs)
                Title: formData.title,
                Description: formData.description,
                VideoUrl: formData.videoUrl,
                Thumb: formData.thumb,
                Tags: formData.tags,
                ClientName: formData.clientName,
                Duration: formData.duration,
                IsFeatured: formData.isFeatured,
                Visibility: formData.visibility,
                ProjectType: formData.projectType,
                Industry: formData.industry,
                Skills: formData.skills,
                Challenge: formData.challenge,
                Solution: formData.solution,
                Result: formData.result,
                Testimonial: formData.testimonial
            };

            if (id) {
                await apiService.updateProject(id, payload);
            } else {
                await apiService.createProject(payload);
            }
            navigate('/admin/projects');
        } catch (err: any) { 
            const errorMsg = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(', ')
                : (err.response?.data?.message || err.message);
            alert('Sync error: ' + errorMsg); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="animate-fade-in premium-admin-bg">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="status-indicator active"></div>
                        <span className="text-muted fw-700 text-uppercase" style={{ letterSpacing: '2px', fontSize: '11px' }}>System Active</span>
                    </div>
                    <h1 className="text-white mb-2 fw-900 fs-1" style={{ letterSpacing: '-1px' }}>
                        {id ? 'Refine Digital Asset' : 'Initialize New Asset'}
                    </h1>
                </div>
                <button type="button" onClick={() => navigate('/admin/projects')} className="btn-retro">
                    <i className="fas fa-arrow-left me-2"></i> Inventory
                </button>
            </div>

            <form onSubmit={handleSubmit} className="row g-5 mt-2">
                {/* Configuration Panel */}
                <div className="col-xl-7">
                    <div className="glass-panel-pro p-5">
                        <h4 className="text-white fw-800 mb-5 border-bottom-glass pb-3">Core Parameters</h4>
                        
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label-pro">Project Title</label>
                                <input type="text" name="title" className="form-input-pro" value={formData.title} onChange={handleChange} required placeholder="e.g. Cyberpunk Commercial" />
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">Video Stream URL</label>
                                <div className="upload-box-pro">
                                    <input type="text" name="videoUrl" className="form-input-pro flex-grow-1 border-0" value={formData.videoUrl} onChange={handleChange} placeholder="Direct URL or click upload..." />
                                    
                                    <div className="upload-actions">
                                        {uploadProgress['videoUrl'] > 0 && (
                                            <span className="text-accent fw-800 fs-12">{uploadProgress['videoUrl']}%</span>
                                        )}
                                        <label className="btn-upload-pro">
                                            {uploadProgress['videoUrl'] > 0 ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
                                            <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} hidden />
                                        </label>
                                    </div>
                                    
                                    {uploadProgress['videoUrl'] > 0 && (
                                        <div className="upload-progress-bar" style={{ width: `${uploadProgress['videoUrl']}%` }}></div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro d-flex justify-content-between align-items-center">
                                    Static Thumbnail URL
                                    <button type="button" onClick={captureFrame} className="btn-text-accent" title="Capture current frame from preview video">
                                        <i className="fas fa-camera"></i> Capture Current Frame
                                    </button>
                                </label>
                                <div className="upload-box-pro">
                                    <input type="text" name="thumb" className="form-input-pro flex-grow-1 border-0" value={formData.thumb} onChange={handleChange} placeholder="Thumbnail URL..." />
                                    
                                    <div className="upload-actions">
                                        {uploadProgress['thumb'] > 0 && (
                                            <span className="text-accent fw-800 fs-12">{uploadProgress['thumb']}%</span>
                                        )}
                                        <label className="btn-upload-pro">
                                            {uploadProgress['thumb'] > 0 ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-image"></i>}
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumb')} hidden />
                                        </label>
                                    </div>

                                    {uploadProgress['thumb'] > 0 && (
                                        <div className="upload-progress-bar" style={{ width: `${uploadProgress['thumb']}%` }}></div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">Creative Narrative</label>
                                <textarea name="description" className="form-input-pro" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the creative vision and impact..."></textarea>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label-pro">Client Organization</label>
                                <input type="text" name="clientName" className="form-input-pro" value={formData.clientName} onChange={handleChange} placeholder="e.g. Nike, Google..." />
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label-pro">Runtime / Duration</label>
                                <input type="text" name="duration" className="form-input-pro" value={formData.duration} onChange={handleChange} placeholder="e.g. 1:30" />
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">Taxonomy Tags</label>
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {categoriesLoading ? (
                                        <span className="text-muted fs-12"><i className="fas fa-spinner fa-spin"></i> Loading categories...</span>
                                    ) : categories.length === 0 ? (
                                        <span className="text-muted fs-12">No categories defined yet. Please add them in the Categories Manager.</span>
                                    ) : (
                                        categories.map((catObj) => {
                                            const cat = catObj.name || catObj.Name;
                                            return (
                                                <button 
                                                    key={cat} 
                                                    type="button"
                                                    onClick={() => {
                                                        const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                                                        if (currentTags.includes(cat)) {
                                                            setFormData({ ...formData, tags: currentTags.filter(t => t !== cat).join(', ') });
                                                        } else {
                                                            setFormData({ ...formData, tags: [...currentTags, cat].join(', ') });
                                                        }
                                                    }}
                                                    className={`tag-pill-pro ${formData.tags.includes(cat) ? 'active' : ''}`}
                                                >
                                                    {cat}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                                <input type="text" name="tags" className="form-input-pro" value={formData.tags} onChange={handleChange} placeholder="Custom tags separated by commas..." />
                            </div>

                            {/* --- Project Overview Details --- */}
                            <div className="col-12 mt-5">
                                <h5 className="text-white fw-700 mb-4 border-bottom-glass pb-2">Project Details</h5>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label-pro">Project Type</label>
                                <input type="text" name="projectType" className="form-input-pro" value={formData.projectType} onChange={handleChange} placeholder="e.g. Animation" />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label-pro">Industry</label>
                                <input type="text" name="industry" className="form-input-pro" value={formData.industry} onChange={handleChange} placeholder="e.g. Creative" />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label-pro">Skills / Tools</label>
                                <input type="text" name="skills" className="form-input-pro" value={formData.skills} onChange={handleChange} placeholder="e.g. After Effects" />
                            </div>

                            <div className="col-12 mt-4">
                                <label className="form-label-pro">The Challenge</label>
                                <textarea name="challenge" className="form-input-pro" value={formData.challenge} onChange={handleChange} rows={3} placeholder="What was the client's problem?"></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">The Solution</label>
                                <textarea name="solution" className="form-input-pro" value={formData.solution} onChange={handleChange} rows={3} placeholder="How did you solve it?"></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">The Result</label>
                                <textarea name="result" className="form-input-pro" value={formData.result} onChange={handleChange} rows={3} placeholder="What was the outcome?"></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label-pro">Client Testimonial (Optional)</label>
                                <textarea name="testimonial" className="form-input-pro" value={formData.testimonial} onChange={handleChange} rows={2} placeholder="Direct quote from the client..."></textarea>
                            </div>
                            {/* --- End Project Overview Details --- */}

                            <div className="col-md-6 mt-4">
                                <div className="toggle-box-pro">
                                    <div>
                                        <h6 className="text-white m-0 fw-700">Featured Asset</h6>
                                        <p className="text-muted fs-11 m-0">Showcase on Home Page</p>
                                    </div>
                                    <div className="form-check form-switch m-0 p-0">
                                        <input className="form-check-input switch-pro" type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6 mt-4">
                                <div className="toggle-box-pro">
                                    <div>
                                        <h6 className="text-white m-0 fw-700">Visibility Status</h6>
                                        <p className="text-muted fs-11 m-0">Current: <strong className="text-accent text-uppercase">{formData.visibility}</strong></p>
                                    </div>
                                    <select name="visibility" className="invisible-select" value={formData.visibility} onChange={handleChange}>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="col-xl-5">
                    <div className="glass-panel-pro p-4 sticky-top" style={{ top: '30px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="text-white m-0 fw-800"><i className="fas fa-desktop text-accent me-2"></i> Live Preview</h5>
                            <span className="badge-pro">Real-time</span>
                        </div>
                        
                        <div className="device-frame">
                            {(() => {
                                let previewUrl = formData.videoUrl;
                                if (previewUrl.includes('cloudinary.com') && previewUrl.toLowerCase().endsWith('.ts')) {
                                    previewUrl = previewUrl.replace(/\.ts$/i, '.mp4');
                                }
                                return previewUrl ? (
                                    previewUrl.match(/\.(mp4|webm|mov|ts)(\?.*)?$/i) ? (
                                        <div className="video-player-pro">
                                            <video src={previewUrl} className="w-100" controls poster={formData.thumb || undefined} key={previewUrl} />
                                        </div>
                                    ) : (
                                        <div className="ratio ratio-16x9 video-player-pro">
                                            <iframe src={getEmbedUrl(previewUrl)} title="Video Preview" allowFullScreen></iframe>
                                        </div>
                                    )
                                ) : formData.thumb ? (
                                    <img src={formData.thumb} alt="Preview Thumbnail" className="w-100 video-player-pro" />
                                ) : (
                                    <div className="void-state-pro">
                                        <div className="void-pulse"></div>
                                        <i className="fas fa-film fs-1 text-muted mb-3"></i>
                                        <p className="text-muted fw-700 fs-12 text-uppercase letter-spacing-1">Awaiting Media Feed</p>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="preview-meta mt-4 p-3 rounded-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <h5 className="text-white fw-800">{formData.title || 'Untitled Asset'}</h5>
                            <p className="text-muted fs-13 mb-2">{formData.description || 'No description provided.'}</p>
                            <div className="d-flex gap-2">
                                {formData.tags.split(',').map(t => t.trim()).filter(t => t).slice(0,3).map(t => (
                                    <span key={t} className="badge bg-dark border border-secondary text-secondary">{t}</span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-cyber w-100 py-3 mt-4" disabled={loading}>
                            {loading ? (
                                <><i className="fas fa-circle-notch fa-spin me-2"></i> Initializing Sequence...</>
                            ) : (
                                <><i className="fas fa-bolt me-2"></i> {id ? 'Deploy Updates' : 'Deploy Asset'}</>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <style>{`
                /* Advanced Admin Theme */
                .premium-admin-bg {
                    min-height: 100vh;
                }

                .status-indicator {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: #f53b57;
                    box-shadow: 0 0 10px #f53b57;
                }
                .status-indicator.active {
                    background: #0be881;
                    box-shadow: 0 0 10px #0be881;
                }

                .glass-panel-pro {
                    background: rgba(10, 15, 30, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                }

                .border-bottom-glass { border-bottom: 1px solid rgba(255,255,255,0.05); }

                /* Premium Forms */
                .form-label-pro {
                    color: #94a3b8;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 8px;
                    display: block;
                }

                .form-input-pro {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: #fff;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .form-input-pro:focus {
                    background: rgba(0, 0, 0, 0.4);
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 4px rgba(255, 174, 0, 0.1);
                    outline: none;
                }

                /* Upload Box */
                .upload-box-pro {
                    display: flex;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px dashed rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .upload-box-pro:focus-within { border-color: var(--color-primary); border-style: solid; }
                
                .upload-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding-right: 10px;
                    z-index: 2;
                }

                .btn-upload-pro {
                    width: 40px; height: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .btn-upload-pro:hover {
                    background: var(--color-primary);
                    color: #000;
                    transform: translateY(-2px);
                }

                .upload-progress-bar {
                    position: absolute;
                    bottom: 0; left: 0; height: 3px;
                    background: var(--color-primary);
                    box-shadow: 0 0 10px var(--color-primary);
                    transition: width 0.2s linear;
                    z-index: 1;
                }

                /* Magic Button */
                .btn-text-accent {
                    background: none; border: none;
                    color: var(--color-primary);
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    cursor: pointer;
                }
                .btn-text-accent:hover { text-decoration: underline; }

                /* Tags */
                .tag-pill-pro {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: #94a3b8;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .tag-pill-pro:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
                .tag-pill-pro.active {
                    background: var(--color-primary);
                    color: #000;
                    border-color: var(--color-primary);
                    box-shadow: 0 5px 15px rgba(255, 174, 0, 0.3);
                }

                /* Toggles */
                .toggle-box-pro {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(0,0,0,0.2);
                    padding: 16px 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    position: relative;
                }
                .invisible-select {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                }
                
                .switch-pro {
                    width: 45px !important;
                    height: 24px !important;
                    background-color: rgba(255,255,255,0.1) !important;
                    border: none !important;
                    cursor: pointer;
                }
                .switch-pro:checked {
                    background-color: var(--color-primary) !important;
                }

                /* Device Frame Preview */
                .device-frame {
                    background: #000;
                    border-radius: 20px;
                    padding: 10px;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .video-player-pro {
                    border-radius: 12px;
                    overflow: hidden;
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: #0a0a0a;
                    display: flex; align-items: center; justify-content: center;
                }
                .video-player-pro video { width: 100%; height: 100%; object-fit: cover; }

                .void-state-pro {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    height: 100%; position: relative;
                }
                .void-pulse {
                    position: absolute;
                    width: 60px; height: 60px;
                    background: rgba(255,255,255,0.02);
                    border-radius: 50%;
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .badge-pro {
                    background: rgba(255, 174, 0, 0.1);
                    color: var(--color-primary);
                    border: 1px solid rgba(255, 174, 0, 0.2);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                /* Buttons */
                .btn-retro {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    transition: all 0.3s ease;
                }
                .btn-retro:hover { background: rgba(255,255,255,0.1); }

                .btn-cyber {
                    background: var(--color-primary);
                    color: #000;
                    border: none;
                    border-radius: 14px;
                    font-weight: 900;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(255, 174, 0, 0.3);
                }
                .btn-cyber:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(255, 174, 0, 0.4);
                }
            `}</style>
        </div>
    );
};

export default ProjectForm;
