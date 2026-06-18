import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import '../../assets/css/HeroParticles.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/useLanguage';

const BannerV1 = () => {
    const { settings } = useSettings();
    const { t, currentLanguage } = useLanguage();
    const [particles, setParticles] = useState<any[]>([]);
    const [showreelOpen, setShowreelOpen] = useState(false);

    useEffect(() => {
        const particleCount = 12;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100 + 100}%`,
            size: `${Math.random() * 8 + 4}px`,
            duration: `${Math.random() * 15 + 10}s`,
            delay: `${Math.random() * 10}s`,
        }));
        setParticles(newParticles);
    }, []);

    // Close modal on Escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowreelOpen(false);
    }, []);

    useEffect(() => {
        if (showreelOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [showreelOpen, handleKeyDown]);

    // Translate typing words per language
    const textLines = useMemo(() => {
        const lang = currentLanguage;
        if (lang === 'ps') {
            return [
                '<b className="">تشریحي ویډیوګانې</b>',
                '<b className="">وایټ بورډ انیمیشن</b>',
                '<b className="">د محصول انیمیشن</b>',
                '<b className="">د اپلیکیشن تشریح</b>',
                '<b className="">د اپلیکیشن پرومو</b>',
                '<b className="">د لوگو انیمیشن</b>',
                '<b className="">د ټولنیزو رسنیو ویډیوګانې</b>'
            ];
        }
        if (lang === 'ar') {
            return [
                '<b className="">فيديوهات توضيحية</b>',
                '<b className="">أنيميشن السبورة</b>',
                '<b className="">أنيميشن المنتج</b>',
                '<b className="">شرح التطبيق</b>',
                '<b className="">إعلان التطبيق</b>',
                '<b className="">أنيميشن الشعار</b>',
                '<b className="">فيديوهات التواصل الاجتماعي</b>'
            ];
        }
        if (lang === 'fa') {
            return [
                '<b className="">ویدیوهای توضیحی</b>',
                '<b className="">انیمیشن تخته سفید</b>',
                '<b className="">انیمیشن محصول</b>',
                '<b className="">توضیح اپلیکیشن</b>',
                '<b className="">تبلیغ اپلیکیشن</b>',
                '<b className="">انیمیشن لوگو</b>',
                '<b className="">ویدیوهای شبکه‌های اجتماعی</b>'
            ];
        }
        if (lang === 'de') {
            return [
                '<b className="">Erklärvideos</b>',
                '<b className="">Whiteboard-Animation</b>',
                '<b className="">Produktanimation</b>',
                '<b className="">App-Erklärung</b>',
                '<b className="">App-Promo</b>',
                '<b className="">Logo-Animation</b>',
                '<b className="">Social-Media-Videos</b>'
            ];
        }
        if (lang === 'fr') {
            return [
                '<b className="">Vidéos explicatives</b>',
                '<b className="">Animation tableau blanc</b>',
                '<b className="">Animation produit</b>',
                '<b className="">Explicatif d\'app</b>',
                '<b className="">Promo d\'app</b>',
                '<b className="">Animation de logo</b>',
                '<b className="">Vidéos réseaux sociaux</b>'
            ];
        }
        return [
            '<b className="">Explainer Videos</b>',
            '<b className="">Whiteboard Animation</b>',
            '<b className="">Product Animation</b>',
            '<b className="">App Explainer</b>',
            '<b className="">App Promo</b>',
            '<b className="">Logo Animation</b>',
            '<b className="">Social Media Videos</b>'
        ];
    }, [currentLanguage]);

    const showreelUrl = settings?.heroVideoUrl || settings?.HeroVideoUrl;

    // Build embeddable showreel src for modal
    const getModalVideoSrc = () => {
        if (!showreelUrl) return '';
        // YouTube
        const ytMatch = showreelUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&controls=1&rel=0`;
        }
        // Vimeo
        const vimeoMatch = showreelUrl.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }
        // Direct video (mp4, cloudinary, etc) — handled as <video> tag
        return showreelUrl;
    };

    const modalSrc = getModalVideoSrc();
    const isDirectVideo = modalSrc === showreelUrl && !!showreelUrl;

    return (
        <>
            <div id="home" className="banner-style-one-area overflow-hidden relative" style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center',
                background: 'transparent'
            }}>
                {/* Dynamic Background Video/Iframe */}
                {showreelUrl && (
                    <div className="hero-video-wrapper" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        overflow: 'hidden'
                    }}>
                        {(showreelUrl.includes('youtube.com') || showreelUrl.includes('youtu.be')) ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${showreelUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${showreelUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]}&background=1`}
                                style={{
                                    width: '100vw',
                                    height: '56.25vw', 
                                    minHeight: '100vh',
                                    minWidth: '177.77vh', 
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                    opacity: settings?.heroVideoOpacity ?? settings?.HeroVideoOpacity ?? 0.3
                                }}
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                            ></iframe>
                        ) : (
                            <video
                                src={showreelUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                key={showreelUrl} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: settings?.heroVideoOpacity ?? settings?.HeroVideoOpacity ?? 0.3,
                                    transition: 'opacity 0.5s ease'
                                }}
                            />
                        )}
                        {/* Subtle overlay for better text contrast */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            background:
                                'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,250,240,0.35) 60%, rgba(255,235,210,0.5) 100%)',
                            zIndex: 1
                        }} />
                        {/* Soft brand glow on the right (orange→red radial) */}
                        <div style={{
                            position: 'absolute',
                            top: 0, right: 0, width: '60%', height: '100%',
                            background:
                                'radial-gradient(ellipse 70% 60% at 100% 50%, rgba(255,174,0,0.18) 0%, rgba(245,66,0,0.1) 35%, transparent 70%)',
                            zIndex: 1,
                            pointerEvents: 'none'
                        }} />
                    </div>
                )}

                <div className="particles-container" style={{ zIndex: 2 }}>
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                animationDuration: p.duration,
                                animationDelay: p.delay
                            }}
                        />
                    ))}
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-10 text-center">
                            <div className="banner-style-one-items">
                                <div className="info">
                                    <h1 className="fw-900">{settings?.heroTitle || t('banner_title')}</h1>
                                    <h2>
                                        <span className="header-caption" id="page-top">
                                            <span className="cd-headline clip is-full-width">
                                                <span className="cd-words-wrapper">
                                                    <ReactTyped
                                                        key={currentLanguage}
                                                        strings={settings?.heroTypedText 
                                                            ? settings.heroTypedText.split(',').map(t => `<span style="background: ${settings.heroTypedColor}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">${t.trim()}</span>`)
                                                            : textLines
                                                        } 
                                                        typeSpeed={40} 
                                                        backSpeed={40} 
                                                        backDelay={2500} 
                                                        loop 
                                                    />
                                                </span>
                                            </span>
                                        </span>
                                    </h2>
                                    <p className="lead fw-500">
                                        {settings?.heroSubtitle || t('banner_subtitle')}
                                    </p>
                                    <div className="flex-social mt-40 justify-content-center gap-3 d-flex flex-wrap align-items-center">
                                        <div className="button">
                                            <Link className="btn-style-regular shadow-lg" to={settings?.ctaLink || "/contact"}>
                                                <span>{settings?.ctaText || t('hire_me')}</span>
                                                <i className="fas fa-arrow-right" />
                                            </Link>
                                        </div>

                        {/* ▶ Showreel Button */}
                        {showreelUrl && (
                                            <button
                                                id="showreel-play-btn"
                                                onClick={() => setShowreelOpen(true)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    background: 'rgba(255,255,255,0.14)',
                                                    backdropFilter: 'blur(14px) saturate(160%)',
                                                    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                                                    border: '1.5px solid rgba(255, 174, 0, 0.4)',
                                                    borderRadius: '60px',
                                                    padding: '14px 28px',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '15px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    textShadow: '0 1px 4px rgba(0,0,0,0.35)',
                                                    boxShadow:
                                                        '0 10px 32px rgba(245, 66, 0, 0.25), 0 0 0 1px rgba(255, 174, 0, 0.12) inset',
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 174, 0, 0.28)';
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 174, 0, 0.7)';
                                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 38px rgba(245, 66, 0, 0.35), 0 0 28px rgba(255, 174, 0, 0.25)';
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)';
                                                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 174, 0, 0.4)';
                                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(245, 66, 0, 0.25), 0 0 0 1px rgba(255, 174, 0, 0.12) inset';
                                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                                }}
                                            >
                                                {/* Pulsing play icon */}
                                                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        width: '42px', height: '42px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(255, 174, 0, 0.45)',
                                                        animation: 'showreel-pulse 1.8s ease-out infinite',
                                                    }} />
                                                    <span style={{
                                                        width: '38px', height: '38px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #ffae00 0%, #f54200 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 15px rgba(245, 66, 0, 0.5), 0 0 18px rgba(255, 174, 0, 0.3)',
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        flexShrink: 0,
                                                    }}>
                                                        <i className="fas fa-play" style={{ fontSize: '13px', marginLeft: '2px', color: '#fff' }}></i>
                                                    </span>
                                                </span>
                                                {t('watch_showreel')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Fullscreen Showreel Modal ─── */}
            {showreelOpen && (
                <div
                    id="showreel-modal-overlay"
                    onClick={(e) => { if ((e.target as HTMLElement).id === 'showreel-modal-overlay') setShowreelOpen(false); }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        background: 'rgba(0,0,0,0.92)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'showreel-fade-in 0.25s ease',
                        padding: '20px',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setShowreelOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '28px',
                            width: '44px', height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            zIndex: 100000,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        title="Close (Esc)"
                    >
                        <i className="fas fa-times"></i>
                    </button>

                    {/* Video container */}
                    <div style={{
                        width: '100%',
                        maxWidth: '1100px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                        background: '#000',
                        animation: 'showreel-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                            {isDirectVideo ? (
                                <video
                                    src={showreelUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    style={{
                                        position: 'absolute', inset: 0,
                                        width: '100%', height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={modalSrc}
                                    style={{
                                        position: 'absolute', inset: 0,
                                        width: '100%', height: '100%',
                                        border: 'none',
                                    }}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes showreel-pulse {
                    0%   { transform: scale(1);   opacity: 0.7; }
                    70%  { transform: scale(1.8); opacity: 0; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes showreel-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes showreel-scale-in {
                    from { opacity: 0; transform: scale(0.88); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
};

export default BannerV1;
