import React, { useState, useEffect, useRef } from 'react';
import ServicesDataJSON from "../../assets/jsonData/services/ServicesData.json";
import { Link } from "react-router-dom";
import arrow from "/assets/img/icon/arrow.png";
import ReactWOW from "react-wow";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { apiService } from '../../services/api';
import { useLanguage } from '../../context/useLanguage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface DataType {
    sectionClass?: string;
    hasTitle?: React.ReactNode
}

const ServicesV1 = ({ sectionClass, hasTitle }: DataType) => {
    const [services, setServices] = useState<any[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const loadServices = async () => {
            try {
                const { data } = await apiService.getServices();
                if (data && data.length > 0) {
                    // Filter active and sort by display order
                    const active = data.filter((s: any) => s.isActive !== false && s.IsActive !== false);
                    active.sort((a: any, b: any) => (a.displayOrder || a.DisplayOrder || 0) - (b.displayOrder || b.DisplayOrder || 0));
                    setServices(active);
                } else {
                    setServices(ServicesDataJSON);
                }
            } catch (err) {
                console.warn("Failed to fetch dynamic services, falling back to JSON");
                setServices(ServicesDataJSON);
            }
        };
        loadServices();
    }, []);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = e.currentTarget.querySelector('video');
        if (video) {
            video.play().catch(e => console.log("Autoplay prevented"));
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = e.currentTarget.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <>
            <div id="services" className={`services-style-one-area bottom-less ${sectionClass ? sectionClass : ""}`}>

                {hasTitle &&
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="site-heading text-center">
                                    <h4 className="sub-title">{t('services_sub')}</h4>
                                    <h2 className="title">{t('services_title')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className="container pb-50">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="services-carousel-wrapper">
                                {services.length > 0 && (
                                    <Swiper
                                        modules={[Autoplay, Pagination, Navigation]}
                                        spaceBetween={30}
                                        slidesPerView={1}
                                        loop={services.length >= 3}
                                        autoplay={{
                                            delay: 3500,
                                            disableOnInteraction: false,
                                        }}
                                        pagination={{
                                            clickable: true,
                                            el: '.services-pagination',
                                        }}
                                        navigation={{
                                            nextEl: '.services-button-next',
                                            prevEl: '.services-button-prev',
                                        }}
                                        breakpoints={{
                                            768: {
                                                slidesPerView: 2,
                                            },
                                            1200: {
                                                slidesPerView: 3,
                                            },
                                        }}
                                    >
                                        {services.map((service: any, index: number) => {
                                            const vUrl = service.videoUrl || service.VideoUrl;
                                            return (
                                                <SwiperSlide key={service.id || index}>
                                                    <div 
                                                        className="service-style-one-item modern-card sp-card text-center mb-30 mt-30"
                                                        onMouseEnter={handleMouseEnter}
                                                        onMouseLeave={handleMouseLeave}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {/* Video Background on Hover */}
                                                        {vUrl && (
                                                            <div className="card-video-bg">
                                                                <video src={vUrl} muted loop playsInline />
                                                                <div className="video-overlay"></div>
                                                            </div>
                                                        )}

                                                        <div className="card-content-front">
                                                            <div className="icon-wrapper justify-content-center">
                                                                <i className={service.icon || service.Icon}></i>
                                                            </div>
                                                            <h4><Link to={`/services-details/${service.id || index}`}>{t('service_' + (service.id || index) + '_title', service.title || service.Title)}</Link></h4>
                                                            <p>{t('service_' + (service.id || index) + '_text', service.text || service.Text)}</p>

                                                            <Link to={`/services-details/${service.id || index}`} className="btn-style-four mt-30">
                                                                <div className="icon"><img src={arrow} alt="Arrow" /></div> {t('explore')}
                                                            </Link>
                                                        </div>
                                                        
                                                        {/* Invisible overlay link for whole card clickability */}
                                                        <Link to={`/services-details/${service.id || index}`} className="stretched-link" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 10 }}></Link>
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })}
                                    </Swiper>
                                )}

                                {/* Navigation Arrows & Pagination */}
                                <div className="services-navigation-wrapper mt-30">
                                    <div className="services-button-prev slider-nav-btn"><i className="fas fa-angle-left"></i></div>
                                    <div className="services-pagination"></div>
                                    <div className="services-button-next slider-nav-btn"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .services-carousel-wrapper {
                    position: relative;
                }

                /* Video Background Styling */
                .card-video-bg {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    z-index: 1;
                }
                .modern-card:hover .card-video-bg {
                    opacity: 1;
                }
                .card-video-bg video {
                    width: 100%; height: 100%;
                    object-fit: cover;
                }
                .video-overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                }

                /* Modernized Beautiful Card Styling (Fixes constant card height) */
                .modern-card.service-style-one-item {
                    height: 430px !important; /* Strict constant height */
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: space-between !important;
                    background: #ffffff !important;
                    border: 1px solid rgba(0, 0, 0, 0.04) !important;
                    border-radius: 28px !important;
                    padding: 40px 30px !important;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.03) !important;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative !important;
                    overflow: hidden !important;
                }
                
                .modern-card.service-style-one-item:hover {
                    transform: translateY(-8px) !important;
                    box-shadow: 0 25px 60px rgba(139, 92, 246, 0.1) !important; /* Glowing violet shadow */
                    border-color: rgba(139, 92, 246, 0.15) !important;
                }

                .card-content-front {
                    display: flex !important;
                    flex-direction: column !important;
                    height: 100% !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    z-index: 2;
                    transition: all 0.3s ease;
                }

                .icon-wrapper {
                    height: 70px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin-bottom: 15px !important;
                    transition: transform 0.4s ease !important;
                }
                
                .modern-card.service-style-one-item:hover .icon-wrapper {
                    transform: scale(1.1) rotate(5deg) !important;
                }

                .icon-wrapper i {
                    font-size: 42px !important;
                    background: linear-gradient(135deg, #ff5e14 0%, #ff8b54 100%) !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                    transition: all 0.4s ease !important;
                }
                
                .modern-card.service-style-one-item:hover .icon-wrapper i {
                    background: #ffffff !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                }

                .card-content-front h4 {
                    font-size: 21px !important;
                    font-weight: 700 !important;
                    color: #0f172a !important;
                    margin-top: 10px !important;
                    margin-bottom: 10px !important;
                    line-height: 1.4 !important;
                }
                
                .card-content-front h4 a {
                    color: #0f172a !important;
                    text-decoration: none !important;
                    transition: color 0.3s ease !important;
                }

                .card-content-front p {
                    color: #64748b !important;
                    font-size: 14px !important;
                    line-height: 1.6 !important;
                    margin: 0 !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 3 !important; /* Cap description to 3 lines maximum */
                    -webkit-box-orient: vertical !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    flex-grow: 1 !important;
                }

                /* Explore Group Button Styling */
                .btn-style-four {
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                    font-size: 14px !important;
                    font-weight: 700 !important;
                    color: #0f172a !important;
                    text-decoration: none !important;
                    margin-top: 20px !important;
                    transition: all 0.3s ease !important;
                }
                
                .btn-style-four .icon {
                    width: 36px !important;
                    height: 36px !important;
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                .btn-style-four .icon img {
                    width: 14px !important;
                    height: auto !important;
                    transition: transform 0.3s ease !important;
                }

                .modern-card:hover .btn-style-four {
                    color: #ffffff !important;
                }

                .modern-card:hover .btn-style-four .icon {
                    border-color: #ffffff !important;
                    background: #ffffff !important;
                }
                
                .modern-card:hover .btn-style-four .icon img {
                    filter: invert(1) !important;
                    transform: translateX(2px) !important;
                }

                .modern-card:hover .card-content-front h4,
                .modern-card:hover .card-content-front h4 a,
                .modern-card:hover .card-content-front p {
                    color: #ffffff !important;
                }

                .watch-btn {
                    pointer-events: none;
                }

                .services-navigation-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 10px;
                }
                .services-pagination {
                    position: relative;
                    width: auto !important;
                    bottom: 0 !important;
                }

                /* Fullscreen Modal */
                .fullscreen-video-modal {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(10px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                .video-container {
                    width: 90%;
                    max-width: 1200px;
                    aspect-ratio: 16/9;
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }
                .modal-video-player {
                    width: 100%; height: 100%;
                    outline: none;
                }
                .close-video-btn {
                    position: absolute;
                    top: 30px; right: 30px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 50px; height: 50px;
                    border-radius: 50%;
                    font-size: 20px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    z-index: 10000;
                }
                .close-video-btn:hover {
                    background: #ef4444;
                    transform: scale(1.1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default ServicesV1;