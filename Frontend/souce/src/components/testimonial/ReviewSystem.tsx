import React, { useEffect, useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { apiService } from '../../services/api';
import { useSocialAccounts } from '../../hooks/useSocialAccounts';
import { useLanguage } from '../../context/useLanguage';

// Helper function to resolve dynamic social icon class based on link URL
const getSocialIconClass = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes('linkedin.com')) return 'fab fa-linkedin';
    if (lower.includes('instagram.com')) return 'fab fa-instagram';
    if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'fab fa-facebook';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'fab fa-x-twitter';
    if (lower.includes('youtube.com')) return 'fab fa-youtube';
    if (lower.includes('github.com')) return 'fab fa-github';
    if (lower.includes('behance.net')) return 'fab fa-behance';
    if (lower.includes('dribbble.com')) return 'fab fa-dribbble';
    if (lower.includes('telegram.org') || lower.includes('t.me')) return 'fab fa-telegram-plane';
    return 'fas fa-link'; // Fallback link icon
};

const StarIcon: React.FC<{ filled: boolean; size?: number }> = ({ filled, size = 16 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? '#ffae00' : 'none'}
        stroke={filled ? '#ffae00' : '#dadce0'}
        strokeWidth="1.5"
        aria-hidden
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const ReviewSystem: React.FC = () => {
    const { t } = useLanguage();
    const { accounts: socialAccounts } = useSocialAccounts();
    const activeAccounts = useMemo(() => socialAccounts.filter(a => a.isVisible), [socialAccounts]);
    const telegramAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'telegram'), [activeAccounts]);
    const locationAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'location'), [activeAccounts]);
    const emailAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'email'), [activeAccounts]);
    const phoneAccount = useMemo(() => activeAccounts.find(a => a.platform.toLowerCase() === 'phone'), [activeAccounts]);

    const [fetchedReviews, setFetchedReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState<'website' | 'google'>('website');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Filter by topic badge in Google widget
    const [selectedTopic, setSelectedTopic] = useState('All');
    // Track which review cards are expanded (show full text) - stored as string[]
    const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
    // Track which reviews received a "Helpful" thumbs up - stored as string[]
    const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
    // Hover star state for modal
    const [hoverStar, setHoverStar] = useState(0);

    // Form fields
    const [author, setAuthor] = useState('');
    const [project, setProject] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [website, setWebsite] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Dynamic colorful Google avatar style generator based on reviewer's name
    const getAvatarStyle = (name: string) => {
        const colors = [
            '#1a73e8', // Google Blue
            '#0f9d58', // Google Green
            '#f4b400', // Google Gold
            '#db4437', // Google Red
            '#ab47bc', // Purple
            '#00acc1', // Teal
            '#ff7043', // Orange
            '#ec407a'  // Pink
        ];
        const firstLetter = name ? name.trim().charAt(0).toUpperCase() : 'A';
        const charCode = firstLetter.charCodeAt(0) || 0;
        const colorIndex = charCode % colors.length;
        return {
            backgroundColor: colors[colorIndex],
            color: '#ffffff',
            fontWeight: '700'
        };
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await apiService.getReviews();
                if (data && Array.isArray(data)) {
                    const approved = data.filter((r: any) =>
                        r.status?.toLowerCase() === 'approved' ||
                        r.Status?.toLowerCase() === 'approved' ||
                        r.isApproved === true ||
                        r.IsApproved === true
                    );
                    setFetchedReviews(approved);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const openWriteModal = (type: 'website' | 'google') => {
        setAuthor('');
        setProject('');
        setRating(5);
        setHoverStar(0);
        setText('');
        setImage('');
        setWebsite('');
        setSocialLink('');
        setSubmitSuccess(false);
        setModalTab(type);
        setShowModal(true);
    };

    const toggleExpand = (id: any) => {
        const idStr = String(id);
        setExpandedReviews(prev =>
            prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
        );
    };

    const toggleHelpful = (id: any) => {
        const idStr = String(id);
        setHelpfulReviews(prev =>
            prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
        );
    };

    const getReviewerBadge = (review: any): string => {
        const localGuideStr = t('local_guide');
        const reviewsStr = t('reviews').toLowerCase();
        if (review.rating === 2) return `${localGuideStr} • 5 ${reviewsStr}`;
        if (review.rating === 3) return `2 ${reviewsStr}`;
        const idStr = review.id ? String(review.id) : '';
        const code = idStr ? idStr.charCodeAt(idStr.length - 1) % 4 : 0;
        if (code === 0) return `${localGuideStr} • 18 ${reviewsStr}`;
        if (code === 1) return `4 ${reviewsStr}`;
        if (code === 2) return `${localGuideStr} • 42 ${reviewsStr}`;
        return `12 ${reviewsStr}`;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Use the backend signed-upload public endpoint which doesn't require admin authorization
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        const apiBaseUrl = (
            import.meta.env.VITE_PRODUCTION_API_URL ||
            import.meta.env.VITE_API_BASE_URL ||
            ''
        ).replace(/\/$/, '');

        xhr.open('POST', `${apiBaseUrl}/cloudinary/upload-public`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                // Could add progress tracking here if needed
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                let data: any;
                try { data = JSON.parse(xhr.responseText); } catch { data = null; }
                if (data?.secure_url) {
                    setImage(data.secure_url);
                } else {
                    alert('Upload failed: unexpected response from server.');
                }
            } else if (xhr.status === 503) {
                alert('Upload failed: Cloudinary is not configured on the server.');
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
            setIsUploading(false);
        };

        xhr.onerror = () => {
            // Fallback to direct Cloudinary upload if backend fails
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
                            setImage(data.secure_url);
                            setIsUploading(false);
                            return;
                        }
                    } catch { /* fall through */ }
                }
                alert('Upload failed: backend unreachable AND direct Cloudinary upload failed. Check your network and Cloudinary config.');
                setIsUploading(false);
            };
            fxhr.onerror = () => {
                alert('Upload failed: could not reach backend or Cloudinary.');
                setIsUploading(false);
            };
            fxhr.send(fallback);
        };

        xhr.send(formData);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !text) {
            alert('Please fill out all required fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            const rawRating = Number(rating);

            // Call API
            await apiService.createReview({
                author,
                project: project || null,
                rating: rawRating,
                text,
                image: image || null,
                website: website || null,
                socialLink: socialLink || null,
                status: 'pending',
                isApproved: false,
                company: modalTab === 'google' ? 'Google Review' : 'Website Review'
            });

            // Optimistic local state update so total review counts and average rating reflect changes instantly!
            const localReviewId = `local-${Date.now()}`;
            const newLocalReview = {
                _id: localReviewId,
                id: localReviewId,
                author: author || 'Anonymous Client',
                project: project || 'Verified Client',
                rating: rawRating,
                text: text,
                image: image || '',
                website: website || '',
                socialLink: socialLink || '',
                isGoogle: modalTab === 'google',
                status: 'approved',
                isApproved: true,
                company: modalTab === 'google' ? 'Google Review' : 'Website Review',
                time: 'Recently'
            };

            setFetchedReviews(prev => [newLocalReview, ...prev]);

            setSubmitSuccess(true);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } catch (err) {
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Separate reviews by source
    const websiteReviewsList = useMemo(() => {
        return fetchedReviews.filter(r => r.company?.toLowerCase() !== 'google review');
    }, [fetchedReviews]);

    const displayWebsiteReviews = websiteReviewsList; // No more fake fallback reviews.

    const allGoogleReviews = useMemo(() => {
        const dbGoogleReviews = fetchedReviews
            .filter(r => r.company?.toLowerCase() === 'google review')
            .map((r, idx) => ({
                id: r._id || r.id || `dbg-${idx}`,
                author: r.author || r.Author || 'Anonymous Client',
                project: r.project || r.Project || 'Verified Client',
                rating: Number(r.rating !== undefined ? r.rating : (r.Rating !== undefined ? r.Rating : 5)),
                text: r.text || r.Text || r.comment || '',
                image: r.image || r.Image || '',
                website: r.website || r.Website || '',
                socialLink: r.socialLink || r.SocialLink || '',
                isGoogle: true,
                time: "Recently"
            }));
        // Only show real reviews from the database; no hardcoded placeholders.
        return dbGoogleReviews;
    }, [fetchedReviews]);

    // Google widget Topic Badges
    const googleTopics = [
        { name: 'All', count: allGoogleReviews.length },
        { name: 'explainer video', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('explainer') || r.text.toLowerCase().includes('video')).length },
        { name: 'fast work', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('fast') || r.text.toLowerCase().includes('work')).length },
        { name: 'professional product', count: allGoogleReviews.filter(r => r.text.toLowerCase().includes('professional') || r.text.toLowerCase().includes('product')).length }
    ];

    const filteredGoogleReviews = useMemo(() => {
        if (selectedTopic === 'All') return allGoogleReviews;
        return allGoogleReviews.filter(r => r.text.toLowerCase().includes(selectedTopic.toLowerCase()));
    }, [allGoogleReviews, selectedTopic]);

    const ratingStats = useMemo(() => {
        const total = allGoogleReviews.length;
        if (total === 0) return {
            avg: 5.0,
            pct5: 100, pct4: 0, pct3: 0, pct2: 0, pct1: 0,
            count5: 0, count4: 0, count3: 0, count2: 0, count1: 0
        };

        let sum = 0;
        let c5 = 0, c4 = 0, c3 = 0, c2 = 0, c1 = 0;
        allGoogleReviews.forEach(r => {
            sum += r.rating;
            if (r.rating === 5) c5++;
            else if (r.rating === 4) c4++;
            else if (r.rating === 3) c3++;
            else if (r.rating === 2) c2++;
            else if (r.rating === 1) c1++;
        });

        return {
            avg: (sum / total).toFixed(1),
            pct5: Math.round((c5 / total) * 100),
            pct4: Math.round((c4 / total) * 100),
            pct3: Math.round((c3 / total) * 100),
            pct2: Math.round((c2 / total) * 100),
            pct1: Math.round((c1 / total) * 100),
            count5: c5,
            count4: c4,
            count3: c3,
            count2: c2,
            count1: c1
        };
    }, [allGoogleReviews]);

    return (
        <section id="reviews" className="rv-section position-relative">
            {/* Soft ambient background glow */}
            <div className="rv-ambient-glow" aria-hidden />

            <div className="container position-relative" style={{ zIndex: 2 }}>
                {/* 1. SECTION HEADER */}
                <div className="row align-items-end mb-5 g-4">
                    <div className="col-lg-7">
                        <div className="rv-eyebrow">
                            <span className="rv-eyebrow-dot" aria-hidden />
                            <span className="rv-eyebrow-text">{t('review_sub')}</span>
                        </div>
                        <h2 className="rv-title">{t('review_title')}</h2>
                    </div>
                    <div className="col-lg-5 d-flex justify-content-lg-end align-items-center gap-3 flex-wrap">
                        {allGoogleReviews.length > 0 && (
                        <div className="rv-stat-pill">
                            <span className="rv-stat-num">{ratingStats.avg}</span>
                            <span className="rv-stat-stars">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <StarIcon key={s} filled size={14} />
                                ))}
                            </span>
                            <span className="rv-stat-label">Google Rating</span>
                        </div>
                        )}
                        <button className="rv-cta-pill" onClick={() => openWriteModal('website')}>
                            <i className="fas fa-pen-nib" />
                            <span>{t('write_review')}</span>
                        </button>
                    </div>
                </div>

                {/* 2. WEBSITE TESTIMONIALS — Premium Glass Cards */}
                {displayWebsiteReviews.length === 0 ? (
                    <div className="rv-empty-state mb-4">
                        <i className="far fa-comment-dots" />
                        <p>No client testimonials yet — be the first to share your experience.</p>
                    </div>
                ) : (
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={28}
                    slidesPerView={1}
                    autoplay={{ delay: 5500, disableOnInteraction: false }}
                    pagination={{ clickable: true, el: '.rv-swiper-bullets' }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 }
                    }}
                    className="rv-swiper mb-3"
                >
                    {displayWebsiteReviews.map((review: any, idx) => {
                        const ratingVal = Number(review.rating !== undefined ? review.rating : (review.Rating !== undefined ? review.Rating : 5));
                        const authorVal = review.author || review.Author || '';
                        const textVal = review.text || review.Text || review.comment || '';
                        const projectVal = review.project || review.Project || review.company || review.Company || 'General';
                        const imageVal = review.image || review.Image || '';
                        const websiteVal = review.website || review.Website || '';
                        const socialLinkVal = review.socialLink || review.SocialLink || '';

                        return (
                            <SwiperSlide key={review._id || review.id || idx}>
                                <div className="rv-card">
                                    {/* Decorative gradient corner */}
                                    <div className="rv-card-glow" aria-hidden />

                                    {/* Quote icon */}
                                    <div className="rv-quote-mark" aria-hidden>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 17h3l2-4V7H2v6h3l-2 4zm10 0h3l2-4V7h-6v6h3l-2 4z" />
                                        </svg>
                                    </div>

                                    {/* Stars */}
                                    <div className="rv-stars">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <StarIcon key={s} filled={s <= ratingVal} size={15} />
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <p className="rv-comment">"{textVal}"</p>

                                    {/* Divider */}
                                    <div className="rv-divider" aria-hidden />

                                    {/* Client meta */}
                                    <div className="rv-client">
                                        <div className="rv-avatar">
                                            {imageVal ? (
                                                <img src={imageVal} alt={authorVal} />
                                            ) : (
                                                <span>{authorVal.trim().charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="rv-client-info">
                                            <h6 className="rv-client-name">{authorVal}</h6>
                                            <div className="rv-client-meta">
                                                <span className="rv-client-project">{projectVal}</span>
                                                {websiteVal && (
                                                    <a href={websiteVal} target="_blank" rel="noopener noreferrer" className="rv-client-link" title="Website">
                                                        <i className="fas fa-globe" />
                                                    </a>
                                                )}
                                                {socialLinkVal && (
                                                    <a href={socialLinkVal} target="_blank" rel="noopener noreferrer" className="rv-client-link" title="Social Profile">
                                                        <i className={getSocialIconClass(socialLinkVal)} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                )}

                {/* Custom Swiper Bullets */}
                {displayWebsiteReviews.length > 0 && (
                <div className="rv-swiper-bullets-wrap">
                    <div className="rv-swiper-bullets" />
                </div>
                )}

                {/* 3. GOOGLE LIVE WIDGET — Premium Glass Panel */}
                {allGoogleReviews.length === 0 && !loading ? (
                    <div className="rv-empty-state rv-empty-state-google mt-5">
                        <i className="fab fa-google" />
                        <p>No Google reviews yet — connect your Google Business profile or share your first review.</p>
                    </div>
                ) : (
                <div className="rv-widget mt-5">
                    <div className="rv-widget-head">
                        <div className="rv-widget-head-left">
                            <div className="rv-widget-eyebrow">
                                <span className="rv-eyebrow-dot" aria-hidden />
                                <span>{t('live_verification')}</span>
                            </div>
                            <h3 className="rv-widget-title">{t('google_reviews_title')}</h3>
                        </div>
                        <div className="rv-widget-head-right">
                            <div className="rv-google-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M12 2L4 6v6c0 5 3.5 9.7 8 10 4.5-.3 8-5 8-10V6l-8-4zm-1.5 13.5L7 12l1.4-1.4 2.1 2.1L15.6 8 17 9.4l-6.5 6.1z" />
                                </svg>
                                <span>Verified by Google</span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 rv-widget-body">
                        {/* LEFT COLUMN: Sleek Business Info + Mini Google Map */}
                        <div className="col-lg-5 col-xl-4 d-flex flex-column gap-3">
                            <div className="rv-biz-card">
                                <div className="rv-biz-head">
                                    <div className="rv-biz-icon" aria-hidden>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="rv-biz-name">SmooothPixel</h4>
                                        <p className="rv-biz-category">{t('studio_subtitle')}</p>
                                    </div>
                                </div>

                                <div className="rv-biz-rating">
                                    <span className="rv-biz-rating-num">{ratingStats.avg}</span>
                                    <div className="rv-biz-rating-stars">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <StarIcon key={s} filled size={14} />
                                        ))}
                                    </div>
                                    <span className="rv-biz-rating-count">({allGoogleReviews.length})</span>
                                </div>

                                <div className="rv-biz-actions">
                                    <a
                                        href={locationAccount && locationAccount.link ? locationAccount.link : "#"}
                                        target={locationAccount && locationAccount.link ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="rv-biz-action"
                                        onClick={locationAccount && locationAccount.link ? undefined : () => openWriteModal('google')}
                                    >
                                        <span className="rv-biz-action-icon">
                                            <i className="fas fa-directions" />
                                        </span>
                                        <span>{t('directions')}</span>
                                    </a>
                                    <button className="rv-biz-action" onClick={() => openWriteModal('google')}>
                                        <span className="rv-biz-action-icon">
                                            <i className="far fa-bookmark" />
                                        </span>
                                        <span>{t('save')}</span>
                                    </button>
                                    <a
                                        href={telegramAccount ? telegramAccount.link : "https://t.me/SmooothPixel"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rv-biz-action"
                                    >
                                        <span className="rv-biz-action-icon">
                                            <i className={telegramAccount ? telegramAccount.icon : "fab fa-telegram-plane"} />
                                        </span>
                                        <span>{t('telegram')}</span>
                                    </a>
                                </div>

                                <div className="rv-biz-details">
                                    <div className="rv-biz-detail">
                                        <i className={locationAccount ? locationAccount.icon : "fas fa-map-marker-alt"} />
                                        <span>{locationAccount ? locationAccount.value : "Berlin, Germany"}</span>
                                    </div>
                                    <div className="rv-biz-detail">
                                        <i className="far fa-clock" />
                                        <span className="rv-biz-open">{t('open_24_hours')}</span>
                                    </div>
                                    {phoneAccount && (
                                        <div className="rv-biz-detail">
                                            <i className={phoneAccount.icon || "fas fa-phone"} />
                                            <a href={`tel:${phoneAccount.value}`}>{phoneAccount.value}</a>
                                        </div>
                                    )}
                                    {emailAccount && (
                                        <div className="rv-biz-detail">
                                            <i className={emailAccount.icon || "fas fa-envelope"} />
                                            <a href={`mailto:${emailAccount.value}`}>{emailAccount.value}</a>
                                        </div>
                                    )}
                                    <div className="rv-biz-detail">
                                        <i className={telegramAccount ? telegramAccount.icon : "fab fa-telegram-plane"} />
                                        <a
                                            href={telegramAccount ? telegramAccount.link : "https://t.me/SmooothPixel"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {telegramAccount ? telegramAccount.value : "@SmooothPixel"}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Embedded Google Map */}
                            <div className="rv-mini-map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.7329598285507!2d13.404953977348981!3d52.520006597143924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f035901%3A0x421120dd37522d0!2sBerlin%2C%20Germany!5e0!3m2!1sen!2s!4v1700000000000"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Review Summary + Badges + Scrollable List */}
                        <div className="col-lg-7 col-xl-8">
                            <div className="rv-reviews-panel">
                                {/* Top: rating summary */}
                                <div className="rv-summary">
                                    <div className="row align-items-center g-4">
                                        {/* Left: rating bars */}
                                        <div className="col-sm-7">
                                            <div className="rv-bar-grid">
                                                {[
                                                    { label: '5', pct: ratingStats.pct5, count: ratingStats.count5 },
                                                    { label: '4', pct: ratingStats.pct4, count: ratingStats.count4 },
                                                    { label: '3', pct: ratingStats.pct3, count: ratingStats.count3 },
                                                    { label: '2', pct: ratingStats.pct2, count: ratingStats.count2 },
                                                    { label: '1', pct: ratingStats.pct1, count: ratingStats.count1 }
                                                ].map((bar, i) => (
                                                    <div className="rv-bar-row" key={i}>
                                                        <span className="rv-bar-label">{bar.label}</span>
                                                        <div className="rv-bar-track">
                                                            <div className="rv-bar-fill" style={{ width: `${bar.pct}%` }} />
                                                        </div>
                                                        <span className="rv-bar-count">{bar.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right: avg + cta */}
                                        <div className="col-sm-5">
                                            <div className="rv-avg-block">
                                                <div className="rv-avg-num">{ratingStats.avg}</div>
                                                <div className="rv-avg-stars">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <StarIcon key={s} filled size={18} />
                                                    ))}
                                                </div>
                                                <p className="rv-avg-meta">{allGoogleReviews.length} Google reviews</p>
                                                <button type="button" className="rv-write-btn" onClick={() => openWriteModal('google')}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                                                    </svg>
                                                    <span>{t('write_review_btn')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter pills (floating, like header tabs) */}
                                <div className="rv-pills-wrap">
                                    <div className="rv-pills">
                                        {googleTopics.map((topic, idx) => (
                                            <button
                                                key={idx}
                                                className={`rv-pill ${selectedTopic === topic.name ? 'rv-pill-active' : ''}`}
                                                onClick={() => setSelectedTopic(topic.name)}
                                            >
                                                <span>{topic.name}</span>
                                                <span className="rv-pill-count">{topic.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Scrollable review list */}
                                <div className="rv-list">
                                    {filteredGoogleReviews.map((review) => {
                                        const isExpanded = expandedReviews.includes(String(review.id));
                                        const isHelpful = helpfulReviews.includes(String(review.id));
                                        const isLong = review.text.length > 180;
                                        const displayText = isExpanded || !isLong ? review.text : review.text.slice(0, 180) + '...';
                                        const badge = getReviewerBadge(review);
                                        const isLocalGuide = badge.includes('Local Guide');
                                        return (
                                            <div className="rv-list-item" key={review.id}>
                                                <div className="rv-list-head">
                                                    <div className="rv-list-avatar" style={!review.image ? getAvatarStyle(review.author) : undefined}>
                                                        {review.image
                                                            ? <img src={review.image} alt="" />
                                                            : <span>{review.author.trim().charAt(0).toUpperCase()}</span>}
                                                    </div>
                                                    <div className="rv-list-meta">
                                                        <div className="rv-list-top">
                                                            <h6 className="rv-list-name">{review.author}</h6>
                                                            {isLocalGuide && (
                                                                <span className="rv-list-lg">
                                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                                    </svg>
                                                                    <span>Local Guide</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="rv-list-sub">
                                                            <div className="rv-list-stars">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <StarIcon key={s} filled={s <= review.rating} size={12} />
                                                                ))}
                                                            </div>
                                                            <span className="rv-list-time">{review.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="rv-list-text">
                                                    {displayText}
                                                    {isLong && (
                                                        <button
                                                            type="button"
                                                            className="rv-list-more"
                                                            onClick={() => toggleExpand(review.id)}
                                                        >
                                                            {isExpanded ? ' Less' : ' More'}
                                                        </button>
                                                    )}
                                                </p>
                                                <div className="rv-list-actions">
                                                    <button
                                                        type="button"
                                                        className={`rv-helpful ${isHelpful ? 'rv-helpful-on' : ''}`}
                                                        onClick={() => toggleHelpful(review.id)}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24"
                                                            fill={isHelpful ? 'currentColor' : 'none'}
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            aria-hidden>
                                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                                        </svg>
                                                        <span>{t('helpful')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                )}

            {/* UNIFIED DUAL-THEME MODAL FORM POPUP */}
            {showModal && (
                <div className="rv-modal-overlay">
                    <div className={`rv-modal-content ${modalTab === 'google' ? 'rv-modal-google' : 'rv-modal-website'} animate-scale-up`}>
                        {/* Tab Switcher inside Modal */}
                        <div className="rv-modal-head">
                            <div className="rv-modal-tabs">
                                <button
                                    type="button"
                                    className={`rv-modal-tab ${modalTab === 'website' ? 'rv-modal-tab-active' : ''}`}
                                    onClick={() => setModalTab('website')}
                                >
                                    <i className="fas fa-globe" /> <span>{t('website_review')}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`rv-modal-tab ${modalTab === 'google' ? 'rv-modal-tab-active' : ''}`}
                                    onClick={() => setModalTab('google')}
                                >
                                    <i className="fab fa-google" /> <span>{t('google_review')}</span>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="rv-modal-close"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="rv-modal-success">
                                <div className="rv-modal-success-icon">
                                    <i className="fas fa-check-circle" />
                                </div>
                                <h4 className="rv-modal-success-title">{t('review_submitted_title')}</h4>
                                <p className="rv-modal-success-desc">{t('review_submitted_desc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview} className="rv-modal-form">
                                {modalTab === 'google' ? (
                                    /* REAL GOOGLE REVIEW FORM STYLE */
                                    <div className="rv-form-google">
                                        {/* GOOGLE HEADER */}
                                        <div className="rv-form-user">
                                            <div className="rv-form-avatar" style={{
                                                ...(!image ? getAvatarStyle(author || 'G') : {})
                                            }}>
                                                {image ? (
                                                    <img src={image} alt="" />
                                                ) : (
                                                    <span>{author ? author.trim().charAt(0).toUpperCase() : 'G'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h6 className="rv-form-username">{author || 'Anonymous'}</h6>
                                                <span className="rv-form-userhint">
                                                    {t('posting_publicly')} <i className="far fa-question-circle" />
                                                </span>
                                            </div>
                                        </div>

                                        {/* RATING STARS */}
                                        <div className="rv-form-stars">
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const filled = star <= (hoverStar || rating);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        className="rv-form-star-btn"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverStar(star)}
                                                        onMouseLeave={() => setHoverStar(0)}
                                                        aria-label={`Rate ${star} star`}
                                                    >
                                                        <StarIcon filled={filled} size={36} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="rv-form-rating-label">
                                            {rating === 1 ? 'Terrible' : rating === 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent'}
                                        </p>

                                        {/* TEXTAREA */}
                                        <div className="rv-form-group">
                                            <textarea
                                                required
                                                rows={5}
                                                className="rv-form-textarea"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder="Share details of your own experience at this place"
                                                maxLength={500}
                                            />
                                            <div className="rv-form-counter">{text.length} / 500</div>
                                        </div>

                                        {/* ADD PHOTO */}
                                        <div className="rv-form-group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="review-image-upload"
                                                className="d-none"
                                                onChange={handleImageUpload}
                                            />
                                            <label htmlFor="review-image-upload" className="rv-form-upload">
                                                {isUploading ? (
                                                    <i className="fas fa-spinner fa-spin" />
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                        <circle cx="12" cy="13" r="4" />
                                                    </svg>
                                                )}
                                                <span>{image ? 'Change Photo' : 'Add photos and videos'}</span>
                                            </label>
                                        </div>

                                        {/* REVIEWER INFO */}
                                        <div className="rv-form-details">
                                            <h6 className="rv-form-details-title">{t('reviewer_details_title')}</h6>
                                            <div className="rv-form-group">
                                                <input
                                                    type="text"
                                                    required
                                                    className="rv-form-input"
                                                    value={author}
                                                    onChange={(e) => setAuthor(e.target.value)}
                                                    placeholder={t('your_name_placeholder')}
                                                />
                                            </div>
                                            <div className="row g-2">
                                                <div className="col-12 col-md-6">
                                                    <input
                                                        type="text"
                                                        className="rv-form-input"
                                                        value={project}
                                                        onChange={(e) => setProject(e.target.value)}
                                                        placeholder={t('company_project_placeholder')}
                                                    />
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <input
                                                        type="url"
                                                        className="rv-form-input"
                                                        value={website}
                                                        onChange={(e) => setWebsite(e.target.value)}
                                                        placeholder={t('website_url_placeholder')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="rv-form-actions">
                                            <button
                                                type="button"
                                                className="rv-btn-ghost"
                                                onClick={() => setShowModal(false)}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button
                                                type="submit"
                                                className="rv-btn-primary"
                                                disabled={isSubmitting || isUploading}
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* WEBSITE THEME LAYOUT */
                                    <div className="rv-form-website">
                                        <div className="rv-form-head">
                                            <h5 className="rv-form-title">
                                                <i className="fas fa-file-signature" /> {t('submit_website_testimonial')}
                                            </h5>
                                            <p className="rv-form-desc">{t('review_deck_desc')}</p>
                                        </div>

                                        <div className="rv-form-group">
                                            <label className="rv-form-label">{t('your_name')}</label>
                                            <input
                                                type="text"
                                                required
                                                className="rv-form-input-dark"
                                                value={author}
                                                onChange={(e) => setAuthor(e.target.value)}
                                                placeholder={t('enter_name_placeholder')}
                                            />
                                        </div>

                                        <div className="rv-form-group">
                                            <label className="rv-form-label">{t('company_project_placeholder')}</label>
                                            <input
                                                type="text"
                                                className="rv-form-input-dark"
                                                value={project}
                                                onChange={(e) => setProject(e.target.value)}
                                                placeholder={t('company_name_placeholder')}
                                            />
                                        </div>

                                        <div className="row g-3 rv-form-group">
                                            <div className="col-md-6">
                                                <label className="rv-form-label">{t('website_link_optional')}</label>
                                                <input
                                                    type="url"
                                                    className="rv-form-input-dark"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    placeholder={t('website_url_placeholder')}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="rv-form-label">{t('social_profile_optional')}</label>
                                                <input
                                                    type="url"
                                                    className="rv-form-input-dark"
                                                    value={socialLink}
                                                    onChange={(e) => setSocialLink(e.target.value)}
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                        </div>

                                        <div className="rv-form-group">
                                            <label className="rv-form-label rv-form-label-center">{t('click_stars_to_rate')}</label>
                                            <div className="rv-form-stars-rating">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        className={`rv-form-star-dark ${star <= rating ? 'rv-form-star-dark-on' : ''}`}
                                                        onClick={() => setRating(star)}
                                                        aria-label={`Rate ${star} star`}
                                                    >
                                                        <i className="fas fa-star" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rv-form-group">
                                            <label className="rv-form-label">{t('profile_photo_optional')}</label>
                                            <div className="rv-form-upload-row">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="review-image-upload-website"
                                                    className="d-none"
                                                    onChange={handleImageUpload}
                                                />
                                                <label htmlFor="review-image-upload-website" className="rv-btn-ghost-dark">
                                                    {isUploading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-camera" />}
                                                    <span>{image ? 'Change Profile Image' : 'Select Profile Image'}</span>
                                                </label>
                                                {image && (
                                                    <span className="rv-form-upload-ready">
                                                        <i className="fas fa-check-circle" /> Ready
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rv-form-group">
                                            <label className="rv-form-label">{t('share_experience_placeholder')}</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="rv-form-input-dark rv-form-textarea-dark"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder={t('describe_project_placeholder')}
                                            />
                                        </div>

                                        <div className="rv-form-actions">
                                            <button
                                                type="button"
                                                className="rv-btn-ghost-dark"
                                                onClick={() => setShowModal(false)}
                                            >
                                                {t('cancel')}
                                            </button>
                                            <button
                                                type="submit"
                                                className="rv-btn-primary"
                                                disabled={isSubmitting || isUploading}
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                /* =====================================================================
                   REVIEWS SECTION — Premium Glass Design
                   (matches HeaderV3 pill + glow + Banner glass language)
                ===================================================================== */
                .rv-empty-state {
                    background: linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(245,247,252,0.85) 100%);
                    border: 1px dashed rgba(13, 36, 64, 0.18);
                    border-radius: 18px;
                    padding: 48px 24px;
                    text-align: center;
                    color: #4a5874;
                }
                .rv-empty-state i {
                    font-size: 38px;
                    margin-bottom: 12px;
                    display: inline-block;
                    background: linear-gradient(135deg, #ff7a18, #ffb347);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                }
                .rv-empty-state p {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 500;
                }
                .rv-section {
                    position: relative;
                    padding-top: 100px;
                    padding-bottom: 100px;
                    background: linear-gradient(180deg, #fafbff 0%, #f5f7fc 100%);
                    overflow: hidden;
                }
                .rv-ambient-glow {
                    position: absolute;
                    top: -10%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(255, 174, 0, 0.12) 0%, rgba(245, 66, 0, 0.04) 40%, transparent 70%);
                    filter: blur(60px);
                    pointer-events: none;
                    z-index: 1;
                }

                /* Section Header */
                .rv-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(255,174,0,0.12), rgba(245,66,0,0.06));
                    border: 1px solid rgba(255, 174, 0, 0.2);
                    margin-bottom: 14px;
                }
                .rv-eyebrow-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    box-shadow: 0 0 12px rgba(255, 174, 0, 0.6);
                }
                .rv-eyebrow-text {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .rv-title {
                    font-size: clamp(2rem, 4vw, 2.75rem);
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.15;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .rv-stat-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(15, 23, 42, 0.06);
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
                }
                .rv-stat-num {
                    font-size: 16px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                }
                .rv-stat-stars {
                    display: inline-flex;
                    gap: 1px;
                    align-items: center;
                }
                .rv-stat-label {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748b;
                }

                .rv-cta-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 12px 22px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff !important;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(255, 174, 0, 0.35);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .rv-cta-pill:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(255, 174, 0, 0.45);
                }
                .rv-cta-pill i { font-size: 13px; }

                /* ── Testimonial Cards ── */
                .rv-swiper { padding-bottom: 8px; }
                .rv-swiper .swiper-slide {
                    height: auto !important;
                    display: flex !important;
                }
                .rv-swiper-bullets-wrap {
                    display: flex;
                    justify-content: center;
                    margin-top: 24px;
                }
                .rv-swiper-bullets {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px;
                    background: rgba(15, 23, 42, 0.04);
                    border-radius: 999px;
                }
                .rv-swiper-bullets .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(15, 23, 42, 0.2);
                    opacity: 1;
                    border-radius: 999px;
                    transition: all 0.25s ease;
                    margin: 0 !important;
                }
                .rv-swiper-bullets .swiper-pagination-bullet-active {
                    width: 22px;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    box-shadow: 0 2px 8px rgba(255, 174, 0, 0.4);
                }

                .rv-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 32px 28px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(15, 23, 42, 0.06);
                    border-radius: 24px;
                    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
                    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease;
                    overflow: hidden;
                }
                .rv-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(255, 174, 0, 0.3);
                    box-shadow: 0 20px 50px rgba(255, 140, 0, 0.12), 0 8px 24px rgba(15, 23, 42, 0.08);
                }
                .rv-card-glow {
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 180px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(255, 174, 0, 0.18) 0%, transparent 70%);
                    filter: blur(20px);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                .rv-card:hover .rv-card-glow { opacity: 1; }

                .rv-quote-mark {
                    color: rgba(255, 174, 0, 0.35);
                    margin-bottom: 8px;
                }
                .rv-stars {
                    display: flex;
                    gap: 2px;
                    margin-bottom: 16px;
                }
                .rv-comment {
                    color: #334155;
                    font-size: 15px;
                    line-height: 1.65;
                    font-weight: 500;
                    margin: 0 0 24px;
                    flex-grow: 1;
                    font-style: italic;
                }
                .rv-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.08), transparent);
                    margin: 0 0 20px;
                }
                .rv-client {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .rv-avatar {
                    width: 46px;
                    height: 46px;
                    min-width: 46px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff;
                    font-weight: 800;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    box-shadow: 0 4px 14px rgba(255, 174, 0, 0.25);
                }
                .rv-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .rv-client-info { min-width: 0; }
                .rv-client-name {
                    margin: 0;
                    color: #0f172a;
                    font-size: 14px;
                    font-weight: 700;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .rv-client-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 2px;
                }
                .rv-client-project {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 500;
                }
                .rv-client-link {
                    color: #94a3b8;
                    font-size: 12px;
                    transition: color 0.2s ease;
                }
                .rv-client-link:hover { color: #ff8c00; }

                /* ── Google Widget ── */
                .rv-widget {
                    position: relative;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border: 1px solid rgba(15, 23, 42, 0.06);
                    border-radius: 28px;
                    padding: 36px;
                    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.05), 0 24px 60px rgba(15, 23, 42, 0.06);
                    overflow: hidden;
                }
                .rv-widget::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 174, 0, 0.4), transparent);
                }

                .rv-widget-head {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 28px;
                }
                .rv-widget-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 5px 12px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(255,174,0,0.12), rgba(245,66,0,0.06));
                    border: 1px solid rgba(255, 174, 0, 0.2);
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: #ea580c;
                    margin-bottom: 10px;
                }
                .rv-widget-title {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.01em;
                }
                .rv-google-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.08));
                    border: 1px solid rgba(66, 133, 244, 0.2);
                    font-size: 11px;
                    font-weight: 700;
                    color: #1a73e8;
                }

                /* Biz Card (Left) */
                .rv-biz-card {
                    position: relative;
                    padding: 24px;
                    border-radius: 22px;
                    background: linear-gradient(160deg, rgba(255, 250, 240, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
                    border: 1px solid rgba(255, 174, 0, 0.12);
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
                }
                .rv-biz-head {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .rv-biz-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 18px rgba(255, 174, 0, 0.3);
                }
                .rv-biz-name {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                    line-height: 1.2;
                }
                .rv-biz-category {
                    font-size: 12px;
                    color: #64748b;
                    margin: 2px 0 0;
                    font-weight: 500;
                }
                .rv-biz-rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 18px;
                }
                .rv-biz-rating-num {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                }
                .rv-biz-rating-stars {
                    display: inline-flex;
                    gap: 1px;
                }
                .rv-biz-rating-count {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 600;
                }

                .rv-biz-actions {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 4px;
                    padding: 14px 0;
                    border-top: 1px solid rgba(15, 23, 42, 0.06);
                    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
                    margin-bottom: 16px;
                }
                .rv-biz-action {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 4px;
                    background: transparent;
                    border: none;
                    text-decoration: none !important;
                    cursor: pointer;
                    border-radius: 12px;
                    transition: background 0.2s ease;
                    color: #475569;
                }
                .rv-biz-action:hover {
                    background: rgba(255, 174, 0, 0.08);
                }
                .rv-biz-action-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255, 174, 0, 0.08);
                    border: 1px solid rgba(255, 174, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d97706;
                    font-size: 13px;
                    transition: all 0.2s ease;
                }
                .rv-biz-action:hover .rv-biz-action-icon {
                    background: rgba(255, 174, 0, 0.15);
                    border-color: rgba(255, 174, 0, 0.4);
                    color: #ea580c;
                }
                .rv-biz-action span:last-child {
                    font-size: 11px;
                    font-weight: 600;
                    color: #475569;
                }

                .rv-biz-details {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .rv-biz-detail {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12.5px;
                    color: #475569;
                }
                .rv-biz-detail i {
                    color: #94a3b8;
                    font-size: 13px;
                    width: 18px;
                    text-align: center;
                }
                .rv-biz-detail a {
                    color: #475569;
                    text-decoration: none;
                    font-weight: 600;
                }
                .rv-biz-detail a:hover { color: #ea580c; }
                .rv-biz-open {
                    color: #16a34a !important;
                    font-weight: 700;
                }

                .rv-mini-map {
                    border-radius: 22px;
                    overflow: hidden;
                    border: 1px solid rgba(15, 23, 42, 0.06);
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
                }

                /* Reviews Panel (Right) */
                .rv-reviews-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    height: 100%;
                }
                .rv-summary {
                    padding: 24px;
                    background: linear-gradient(160deg, rgba(255, 250, 240, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%);
                    border: 1px solid rgba(255, 174, 0, 0.1);
                    border-radius: 20px;
                }
                .rv-bar-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }
                .rv-bar-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .rv-bar-label {
                    width: 10px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                    text-align: center;
                }
                .rv-bar-track {
                    flex: 1;
                    height: 8px;
                    background: rgba(15, 23, 42, 0.06);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .rv-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #ffae00, #f54200);
                    border-radius: 999px;
                    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                    box-shadow: 0 0 8px rgba(255, 174, 0, 0.4);
                }
                .rv-bar-count {
                    width: 28px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-align: right;
                }

                .rv-avg-block {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .rv-avg-num {
                    font-size: 2.6rem;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .rv-avg-stars {
                    display: inline-flex;
                    gap: 2px;
                }
                .rv-avg-meta {
                    font-size: 11px;
                    font-weight: 600;
                    color: #64748b;
                    margin: 4px 0 12px;
                }

                .rv-write-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 9px 18px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff !important;
                    font-size: 12.5px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 6px 18px rgba(255, 174, 0, 0.3);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .rv-write-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(255, 174, 0, 0.4);
                }

                /* Filter pills (floating, like header tabs) */
                .rv-pills-wrap {
                    padding: 4px;
                    background: rgba(15, 23, 42, 0.04);
                    border-radius: 999px;
                    overflow-x: auto;
                    scrollbar-width: none;
                }
                .rv-pills-wrap::-webkit-scrollbar { display: none; }
                .rv-pills {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    min-width: 100%;
                }
                .rv-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    border-radius: 999px;
                    background: transparent;
                    border: 1px solid transparent;
                    color: #475569;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                }
                .rv-pill:hover {
                    background: rgba(255, 174, 0, 0.08);
                    color: #0f172a;
                }
                .rv-pill-active {
                    background: linear-gradient(135deg, rgba(255,174,0,0.18), rgba(245,66,0,0.08));
                    border-color: rgba(255, 174, 0, 0.3);
                    color: #b45309;
                    font-weight: 700;
                }
                .rv-pill-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 22px;
                    height: 18px;
                    padding: 0 6px;
                    border-radius: 999px;
                    background: rgba(15, 23, 42, 0.06);
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 700;
                }
                .rv-pill-active .rv-pill-count {
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff;
                }

                /* Review list */
                .rv-list {
                    max-height: 460px;
                    overflow-y: auto;
                    padding: 4px 4px 4px 0;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(15, 23, 42, 0.15) transparent;
                }
                html[dir='rtl'] .rv-list { padding: 4px 0 4px 4px; }
                .rv-list::-webkit-scrollbar { width: 6px; }
                .rv-list::-webkit-scrollbar-thumb {
                    background: rgba(15, 23, 42, 0.15);
                    border-radius: 999px;
                }
                .rv-list-item {
                    padding: 18px 0;
                    border-bottom: 1px solid rgba(15, 23, 42, 0.05);
                }
                .rv-list-item:last-child { border-bottom: none; }
                .rv-list-head {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                .rv-list-avatar {
                    width: 38px;
                    height: 38px;
                    min-width: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    overflow: hidden;
                    color: #fff;
                }
                .rv-list-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .rv-list-meta { flex: 1; min-width: 0; }
                .rv-list-top {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .rv-list-name {
                    color: #0f172a;
                    font-size: 13px;
                    font-weight: 700;
                    margin: 0;
                }
                .rv-list-lg {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    padding: 2px 7px;
                    border-radius: 999px;
                    background: rgba(26, 115, 232, 0.1);
                    color: #1a73e8;
                    font-size: 9.5px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }
                .rv-list-sub {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 3px;
                }
                .rv-list-stars {
                    display: inline-flex;
                    gap: 1px;
                }
                .rv-list-time {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .rv-list-text {
                    font-size: 13px;
                    color: #334155;
                    line-height: 1.55;
                    margin: 6px 0 8px;
                }
                .rv-list-more {
                    background: none;
                    border: none;
                    color: #ff8c00;
                    font-size: 12.5px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 2px;
                }
                .rv-list-more:hover { text-decoration: underline; }

                .rv-list-actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .rv-helpful {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 12px;
                    border-radius: 999px;
                    background: transparent;
                    border: 1px solid rgba(15, 23, 42, 0.08);
                    color: #64748b;
                    font-size: 11.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .rv-helpful:hover {
                    background: rgba(255, 174, 0, 0.08);
                    border-color: rgba(255, 174, 0, 0.25);
                    color: #ea580c;
                }
                .rv-helpful-on {
                    background: linear-gradient(135deg, rgba(255,174,0,0.18), rgba(245,66,0,0.08));
                    border-color: rgba(255, 174, 0, 0.4);
                    color: #b45309;
                }

                /* =====================================================================
                   MODAL
                ===================================================================== */
                .rv-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    z-index: 10050;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .rv-modal-content {
                    border-radius: 24px !important;
                    width: 100%;
                    max-width: 540px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
                .rv-modal-website {
                    background:
                        radial-gradient(circle at 0% 0%, rgba(255, 174, 0, 0.10) 0%, transparent 45%),
                        radial-gradient(circle at 100% 100%, rgba(245, 66, 0, 0.12) 0%, transparent 50%),
                        linear-gradient(160deg, #0a3a48 0%, #062028 100%) !important;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.12) !important;
                    box-shadow:
                        0 30px 80px rgba(0, 0, 0, 0.55),
                        0 0 0 1px rgba(255, 174, 0, 0.15) inset,
                        0 0 60px rgba(255, 174, 0, 0.08) !important;
                }
                .rv-modal-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 18px 22px;
                    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
                }
                .rv-modal-website .rv-modal-head {
                    border-bottom-color: rgba(255, 255, 255, 0.08) !important;
                }
                .rv-modal-tabs {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    padding: 4px;
                    border-radius: 999px;
                    background: rgba(15, 23, 42, 0.05);
                }
                .rv-modal-website .rv-modal-tabs {
                    background: rgba(0, 0, 0, 0.35);
                    border: 1px solid rgba(255, 255, 255, 0.10);
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
                }
                .rv-modal-tab {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    border-radius: 999px;
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 12.5px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .rv-modal-website .rv-modal-tab {
                    color: rgba(255, 255, 255, 0.6);
                }
                .rv-modal-tab:hover {
                    color: #0f172a;
                }
                .rv-modal-website .rv-modal-tab:hover {
                    color: #fff;
                }
                .rv-modal-tab-active {
                    background: linear-gradient(135deg, rgba(255,174,0,0.18), rgba(245,66,0,0.08));
                    color: #b45309 !important;
                    box-shadow: 0 2px 10px rgba(255, 174, 0, 0.2);
                }
                .rv-modal-website .rv-modal-tab-active {
                    background: linear-gradient(135deg, #ffae00, #f54200) !important;
                    color: #fff !important;
                    box-shadow:
                        0 4px 14px rgba(255, 100, 0, 0.45),
                        inset 0 1px 0 rgba(255, 255, 255, 0.25);
                }
                .rv-modal-close {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(15, 23, 42, 0.05);
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .rv-modal-website .rv-modal-close {
                    background: rgba(255, 255, 255, 0.12);
                    color: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                }
                .rv-modal-close:hover {
                    background: rgba(15, 23, 42, 0.1);
                    color: #0f172a;
                }
                .rv-modal-website .rv-modal-close:hover {
                    background: rgba(255, 80, 80, 0.85);
                    border-color: rgba(255, 80, 80, 1);
                    color: #fff;
                    transform: rotate(90deg);
                }

                .rv-modal-form {
                    padding: 22px;
                }
                .rv-form-google {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .rv-form-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 4px;
                }
                .rv-form-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                    color: #fff;
                }
                .rv-form-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .rv-form-username {
                    color: #0f172a;
                    font-size: 14px;
                    font-weight: 700;
                    margin: 0;
                }
                .rv-form-userhint {
                    font-size: 11.5px;
                    color: #64748b;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .rv-form-stars {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    padding: 4px 0;
                }
                .rv-form-star-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    transition: transform 0.15s ease;
                }
                .rv-form-star-btn:hover { transform: scale(1.15); }
                .rv-form-rating-label {
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                    margin: 0;
                    font-weight: 600;
                }

                .rv-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .rv-form-textarea {
                    width: 100%;
                    border: 1px solid rgba(15, 23, 42, 0.1);
                    border-radius: 14px;
                    padding: 14px;
                    font-size: 14px;
                    color: #0f172a;
                    background: #f8fafc;
                    resize: vertical;
                    min-height: 110px;
                    font-family: inherit;
                    transition: all 0.2s ease;
                }
                .rv-form-textarea:focus {
                    outline: none;
                    border-color: #ffae00;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(255, 174, 0, 0.15);
                }
                .rv-form-counter {
                    text-align: right;
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .rv-form-upload {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 11px 18px;
                    border-radius: 999px;
                    background: rgba(255, 174, 0, 0.08);
                    border: 1px dashed rgba(255, 174, 0, 0.3);
                    color: #b45309;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .rv-form-upload:hover {
                    background: rgba(255, 174, 0, 0.15);
                    border-color: rgba(255, 174, 0, 0.5);
                }

                .rv-form-details {
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 16px;
                    border: 1px solid rgba(15, 23, 42, 0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .rv-form-details-title {
                    font-size: 10px;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    margin: 0 0 4px;
                }
                .rv-form-input {
                    width: 100%;
                    border: 1px solid rgba(15, 23, 42, 0.1);
                    border-radius: 10px;
                    padding: 10px 12px;
                    font-size: 13px;
                    color: #0f172a;
                    background: #fff;
                    transition: all 0.2s ease;
                }
                .rv-form-input:focus {
                    outline: none;
                    border-color: #ffae00;
                    box-shadow: 0 0 0 3px rgba(255, 174, 0, 0.12);
                }

                .rv-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(15, 23, 42, 0.06);
                }
                .rv-modal-website .rv-form-actions {
                    border-top-color: rgba(255, 255, 255, 0.08) !important;
                }
                .rv-btn-ghost {
                    background: transparent;
                    border: 1px solid rgba(15, 23, 42, 0.1);
                    color: #475569;
                    font-size: 13px;
                    font-weight: 600;
                    padding: 8px 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .rv-btn-ghost:hover {
                    background: rgba(15, 23, 42, 0.04);
                }
                .rv-btn-ghost-dark {
                    background: rgba(255, 255, 255, 0.10);
                    border: 1.5px solid rgba(255, 255, 255, 0.32);
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 10px 20px;
                    border-radius: 11px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                .rv-btn-ghost-dark:hover {
                    background: rgba(255, 255, 255, 0.20);
                    border-color: rgba(255, 174, 0, 0.55);
                    color: #ffae00;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(255, 174, 0, 0.20);
                }
                .rv-btn-primary {
                    background: linear-gradient(135deg, #ffae00 0%, #f54200 100%) !important;
                    color: #fff !important;
                    font-size: 13.5px;
                    font-weight: 800;
                    padding: 11px 26px;
                    border-radius: 11px;
                    border: none;
                    cursor: pointer;
                    box-shadow:
                        0 8px 22px rgba(255, 100, 0, 0.45),
                        0 2px 6px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.25);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .rv-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 12px 30px rgba(255, 100, 0, 0.55),
                        0 4px 8px rgba(0, 0, 0, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }
                .rv-btn-primary:active {
                    transform: translateY(0);
                }
                .rv-btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Website theme form */
                .rv-form-website {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .rv-form-head {
                    padding: 16px 18px;
                    margin-bottom: 4px;
                    border-radius: 14px;
                    background:
                        linear-gradient(135deg, rgba(255, 174, 0, 0.10) 0%, rgba(245, 66, 0, 0.04) 100%);
                    border: 1px solid rgba(255, 174, 0, 0.18);
                    border-left: 3px solid #ffae00;
                }
                .rv-form-title {
                    color: #fff;
                    font-size: 1.2rem;
                    font-weight: 800;
                    margin: 0 0 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    letter-spacing: -0.01em;
                }
                .rv-form-title i {
                    color: #ffae00;
                    font-size: 1.3rem;
                    filter: drop-shadow(0 0 10px rgba(255, 174, 0, 0.7));
                }
                .rv-form-desc {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 12px;
                    margin: 0;
                    font-weight: 500;
                }
                .rv-form-label {
                    color: #ffffff;
                    font-size: 12px;
                    font-weight: 700;
                    display: block;
                    letter-spacing: 0.01em;
                    text-transform: capitalize;
                }
                .rv-form-label::before {
                    content: '';
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    margin-right: 8px;
                    vertical-align: middle;
                    box-shadow: 0 0 8px rgba(255, 174, 0, 0.6);
                }
                .rv-form-label-center {
                    text-align: center;
                    display: block;
                    font-size: 12.5px;
                    color: #ffffff !important;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 4px;
                }
                .rv-form-label-center::before { display: none; }
                .rv-form-input-dark {
                    width: 100%;
                    border: 1.5px solid rgba(255, 255, 255, 0.28) !important;
                    background: rgba(255, 255, 255, 0.10) !important;
                    color: #fff !important;
                    border-radius: 12px;
                    padding: 13px 16px;
                    font-size: 13.5px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .rv-form-input-dark::placeholder {
                    color: rgba(255, 255, 255, 0.65);
                    font-weight: 400;
                }
                .rv-form-input-dark:hover {
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    background: rgba(255, 255, 255, 0.13) !important;
                }
                .rv-form-input-dark:focus {
                    outline: none;
                    border-color: #ffae00 !important;
                    background: rgba(255, 255, 255, 0.16) !important;
                    box-shadow:
                        0 0 0 4px rgba(255, 174, 0, 0.22),
                        0 4px 16px rgba(255, 174, 0, 0.15);
                }
                .rv-form-textarea-dark {
                    resize: vertical;
                    min-height: 90px;
                }
                .rv-form-stars-rating {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    padding: 6px 0;
                }
                .rv-form-star-dark {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.28);
                    font-size: 30px;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s ease;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }
                .rv-form-star-dark:hover {
                    transform: scale(1.2);
                    color: rgba(255, 174, 0, 0.75);
                }
                .rv-form-star-dark-on {
                    color: #ffae00 !important;
                    text-shadow:
                        0 0 16px rgba(255, 174, 0, 0.85),
                        0 0 4px rgba(255, 220, 100, 0.6);
                    filter: drop-shadow(0 2px 8px rgba(255, 174, 0, 0.5));
                }
                .rv-form-upload-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .rv-form-upload-ready {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #4ade80;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 999px;
                    background: rgba(74, 222, 128, 0.12);
                    border: 1px solid rgba(74, 222, 128, 0.3);
                }

                .rv-modal-success {
                    padding: 50px 22px;
                    text-align: center;
                }
                .rv-modal-success-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(22, 163, 74, 0.15), rgba(22, 163, 74, 0.05));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #16a34a;
                    font-size: 38px;
                    box-shadow: 0 0 30px rgba(22, 163, 74, 0.2);
                }
                .rv-modal-success-title {
                    color: #0f172a;
                    font-size: 1.25rem;
                    font-weight: 800;
                    margin: 0 0 8px;
                }
                .rv-modal-website .rv-modal-success-title {
                    color: #fff;
                }
                .rv-modal-success-desc {
                    color: #64748b;
                    font-size: 13px;
                    margin: 0;
                }
                .rv-modal-website .rv-modal-success-desc {
                    color: rgba(255, 255, 255, 0.6);
                }

                .animate-scale-up {
                    animation: rvScaleUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes rvScaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                /* RTL adjustments */
                html[dir='rtl'] .rv-biz-head { flex-direction: row-reverse; }
                html[dir='rtl'] .rv-biz-rating { flex-direction: row-reverse; }
                html[dir='rtl'] .rv-biz-action { direction: rtl; }
                html[dir='rtl'] .rv-biz-detail { direction: rtl; }
                html[dir='rtl'] .rv-client { flex-direction: row-reverse; }
                html[dir='rtl'] .rv-list-head { flex-direction: row-reverse; }
                html[dir='rtl'] .rv-form-user { flex-direction: row-reverse; }

                @media (max-width: 991px) {
                    .rv-widget { padding: 24px; }
                    .rv-section { padding: 60px 0; }
                }
                @media (max-width: 575px) {
                    .rv-widget-head { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </section>
    );
};

export default ReviewSystem;
