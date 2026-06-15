import { useState, useEffect, useRef, useCallback } from "react";
import ReactWOW from "react-wow";
import shape15 from "/assets/img/shape/15.png"
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { apiService } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { getPackages, formatPackagePrice } from "../../lib/packagesUtils";

interface DataType {
    sectionClass?: string;
    hasTitle?: React.ReactNode
}

const TIER_LABELS: Record<'basic' | 'standard' | 'premium', string> = {
    basic: 'Basic',
    standard: 'Standard',
    premium: 'Premium',
};

const PriceV1 = ({ sectionClass, hasTitle }: DataType) => {
    const { t } = useLanguage();
    const [pricingData, setPricingData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTiers, setActiveTiers] = useState<{ [key: number]: 'basic' | 'standard' | 'premium' }>({});
    const swiperRef = useRef<SwiperType | null>(null);

    const pauseCarousel = useCallback(() => {
        swiperRef.current?.autoplay?.stop();
    }, []);

    const resumeCarousel = useCallback(() => {
        swiperRef.current?.autoplay?.start();
    }, []);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                setLoading(true);
                const { data } = await apiService.getServices();
                const active = (data || [])
                    .filter((s: any) => (s.isActive !== false && s.IsActive !== false))
                    .sort((a: any, b: any) => (a.displayOrder || a.DisplayOrder || 0) - (b.displayOrder || b.DisplayOrder || 0));

                setPricingData(active.map((item: any) => {
                    return {
                        id: item.id || item.Id,
                        title: item.title || item.Title,
                        price: Number(item.price || item.Price || 0),
                        icon: item.icon || item.Icon || "fas fa-star",
                        tagline: item.text || item.Text || "",
                        featuresJson: item.featuresJson || item.FeaturesJson || "[]",
                        btnClass: ""
                    };
                }));
            } catch (error) {
                console.error("Failed to fetch dynamic packages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPricing();
    }, []);

    return (
        <>
            <div id="pricing" className={`pricing-style-one-area ${sectionClass ? sectionClass : ""}`}>
                <div className="shape-right-top">
                    <img src={shape15} alt="Image Not Found" />
                </div>

                {hasTitle &&
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3">
                                <div className="site-heading text-center">
                                    <h4 className="sub-title">{t('pricing_packages')}</h4>
                                    <h2 className="title">{t('pricing_title')}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" role="status" style={{color: '#8b5cf6', width: '3rem', height: '3rem'}}></div>
                                    <p className="text-muted mt-3 fw-bold">{t('loading_packages')}</p>
                                </div>
                            ) : pricingData.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted fw-bold">{t('no_packages_available')}</p>
                                </div>
                            ) : (
                                <Swiper
                                    modules={[Keyboard, Autoplay, Pagination]}
                                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                    freeMode={false}
                                    grabCursor={true}
                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }}
                                    loop={pricingData.length > 2}
                                    keyboard={{ enabled: true }}
                                    pagination={{
                                        el: '.pricing-swiper-pagination',
                                        clickable: true,
                                    }}
                                    breakpoints={{
                                        320: { slidesPerView: 1, spaceBetween: 30 },
                                        768: { slidesPerView: 2, spaceBetween: 30 },
                                        1200: { slidesPerView: 3, spaceBetween: 30 },
                                    }}
                                    className="pricing-carousel"
                                >
                                    {pricingData.map((plan) => {
                                        const parsedPkgs = getPackages(plan.featuresJson, plan.price, plan.title);
                                        const currentTier = activeTiers[plan.id] || 'basic';
                                        const activePkg = parsedPkgs[currentTier];
                                        const features = activePkg.features || [];

                                        return (
                                            <SwiperSlide key={plan.id}>
                                                <ReactWOW animation="fadeInUp">
                                                    <div
                                                        className="pricing-style-one sp-pricing-card"
                                                        onMouseEnter={pauseCarousel}
                                                        onMouseLeave={resumeCarousel}
                                                        onFocusCapture={pauseCarousel}
                                                        onBlurCapture={(e) => {
                                                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                                                resumeCarousel();
                                                            }
                                                        }}
                                                    >
                                                        <div className="pricing-tier-tabs">
                                                            {(['basic', 'standard', 'premium'] as const).map((tier) => {
                                                                const isActiveTier = currentTier === tier;
                                                                return (
                                                                    <button
                                                                        key={tier}
                                                                        type="button"
                                                                        onClick={() => setActiveTiers(prev => ({ ...prev, [plan.id]: tier }))}
                                                                        className={`pricing-tier-tab ${isActiveTier ? 'active' : ''}`}
                                                                    >
                                                                        {t('tier_' + tier)}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>

                                                        <div className="pricing-top">
                                                            <div className="pricing-top-text">
                                                                <h3 className="pricing-service-name">{plan.title}</h3>
                                                                <p className="pricing-pack-name">{activePkg.title}</p>
                                                                <p className="pricing-tagline">
                                                                    {activePkg.description}
                                                                </p>
                                                            </div>
                                                            <div className="pricing-top-icon">
                                                                {plan.icon && (plan.icon.startsWith('http') || plan.icon.startsWith('/')) ? (
                                                                    <img src={plan.icon} alt={plan.title} />
                                                                ) : (
                                                                    <i className={plan.icon} />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="content">
                                                            <div className="price">
                                                                <h2>
                                                                    <sup>$</sup>
                                                                    {formatPackagePrice(activePkg.price)}
                                                                </h2>
                                                            </div>

                                                            <ul className="pricing-features-list">
                                                                {features.length > 0 ? (
                                                                    features.map((feature, i) => (
                                                                        <li key={i}>
                                                                            <span className="sp-pricing-check" aria-hidden="true">
                                                                                <i className="fas fa-check" />
                                                                            </span>
                                                                            <span>{feature}</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li className="pricing-features-empty">
                                                                        <i className="fas fa-info-circle" aria-hidden="true" />
                                                                        <span>{t('details_coming_soon')}</span>
                                                                    </li>
                                                                )}
                                                            </ul>

                                                            <div className="sp-pricing-cta-wrap">
                                                                <Link
                                                                    className={`pricing-cta-btn ${plan.btnClass}`}
                                                                    to="/contact"
                                                                    state={{ service: plan.title, tier: activePkg.title, price: activePkg.price }}
                                                                >
                                                                    <span className="sp-pricing-cta-text">{t('order_now')}</span>
                                                                    <span className="sp-pricing-cta-arrow" aria-hidden="true">
                                                                        <i className="fas fa-external-link-alt" />
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ReactWOW>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            )}

                            <div className="services-pagination-wrapper text-center mt-50 mb-30">
                                <div className="pricing-swiper-pagination swiper-pagination-style-two" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default PriceV1;
