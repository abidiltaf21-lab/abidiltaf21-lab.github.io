import ReactWOW from "react-wow";
import shape15 from "/assets/img/shape/15.png"
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';

interface DataType {
    sectionClass?: string;
    hasTitle?: React.ReactNode
}

const PriceV1 = ({ sectionClass, hasTitle }: DataType) => {

    const pricingData = [
        {
            id: 1,
            title: "Animation & Motion",
            price: "149",
            icon: "fas fa-film",
            tagline: "Fluid Storytelling and Cinematic Visuals",
            features: [
                "Custom 2D Animation",
                "Corporate Motion Graphics",
                "UI & Social Media Motion",
                "3D & Particle Logo Reveal",
                "Animated Typo & Kinetic Text",
                "Character Rigging & Setup"
            ],
            btnClass: ""
        },
        {
            id: 2,
            title: "Explainer Videos",
            price: "299",
            icon: "fas fa-lightbulb",
            tagline: "Communicate Your Message with Clarity",
            features: [
                "SaaS & Startup Explainers",
                "Icon-Based & Flat Design",
                "Character-Based Storytelling",
                "Infographic & Data Videos",
                "Whiteboard & Hand-Drawn",
                "Product & App Demos"
            ],
            btnClass: ""
        },
        {
            id: 3,
            title: "Video Production",
            price: "199",
            icon: "fas fa-video",
            tagline: "Professional Editing & Cinematic Ads",
            features: [
                "Advanced Post-Production",
                "Social Media Ads & Promo",
                "Corporate Video Production",
                "E-Commerce & Shopify Ads",
                "Professional Color Grading",
                "Subtitles & High-End Edits"
            ],
            btnClass: ""
        },
        {
            id: 4,
            title: "3D Product Animation",
            price: "499",
            icon: "fas fa-cube",
            tagline: "Photorealistic 3D Renders & Promos",
            features: [
                "Full 3D Product Animation",
                "E-Commerce 3D Product Ad",
                "Amazon / Shopify Showcase",
                "Realistic Texture & Lighting",
                "Exploded View Animations",
                "High-Fidelity 4K Renders"
            ],
            btnClass: ""
        },
        {
            id: 5,
            title: "Business Media",
            price: "399",
            icon: "fas fa-briefcase",
            tagline: "Authority & Branding for Corporations",
            features: [
                "Company Profile Films",
                "Internal Training Media",
                "Investor Pitch Videos",
                "Event Promo & Highlights",
                "Corporate Branding Content",
                "Professional Interview Edits"
            ],
            btnClass: ""
        },
        {
            id: 6,
            title: "Design & Branding",
            price: "249",
            icon: "fas fa-palette",
            tagline: "Strategic Identity & Creative Design",
            features: [
                "Custom Logo Design",
                "Complete Brand Identity",
                "Social Media Branding Kit",
                "Animated Brand Assets",
                "Strategic Design Thinking",
                "Print-Ready Brand Guides"
            ],
            btnClass: ""
        },
        {
            id: 7,
            title: "Web & App Motion",
            price: "349",
            icon: "fas fa-mobile-alt",
            tagline: "Interactive UI & Lottie Animation",
            features: [
                "Web Micro-Animations",
                "Lottie For Web & Mobile",
                "App Interface Animation",
                "SaaS Dashboard Motion",
                "High-Performance SVG Renders",
                "Interactive UI Flow Design"
            ],
            btnClass: ""
        }
    ];

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
                                    <h4 className="sub-title">Expertise Pricing</h4>
                                    <h2 className="title">Premium Cinematic & Motion Solutions</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <Swiper
                                modules={[Keyboard, Autoplay, Pagination]}
                                freeMode={false}
                                grabCursor={true}
                                autoplay={{ delay: 4000, disableOnInteraction: false }}
                                loop={true}
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
                                {pricingData.map((plan) => (
                                    <SwiperSlide key={plan.id}>
                                        <ReactWOW animation="fadeInUp">
                                            <div className="pricing-style-one">
                                                <div className="pricing-top">
                                                    <div className="right">
                                                        <i className={plan.icon} />
                                                    </div>
                                                    <div className="left">
                                                        <h4>{plan.title}</h4>
                                                        <p>{plan.tagline}</p>
                                                    </div>
                                                </div>
                                                <div className="content">
                                                    <div className="price">
                                                        <h2><sup>$</sup>{plan.price}</h2>
                                                    </div>
                                                    <ul>
                                                        {plan.features.map((feature, i) => (
                                                            <li key={i}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                    <div className="button mt-30">
                                                        <Link className={`btn-style-regular ${plan.btnClass}`} to="/contact">
                                                            <span>Order Now</span> <i className="fas fa-arrow-right" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </ReactWOW>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className="services-pagination-wrapper text-center mt-50 mb-30">
                                <div className="pricing-swiper-pagination swiper-pagination-style-two" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .pricing-carousel {
                    padding: 20px 10px 40px;
                }
                .pricing-carousel .swiper-slide {
                    height: auto;
                    display: flex;
                }
                .pricing-carousel .swiper-slide > div {
                    display: flex;
                    width: 100%;
                }
                .pricing-style-one {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    flex: 1;
                    background: #fff;
                    padding: 40px 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
                    transition: all 0.4s ease;
                    border: 1px solid rgba(0,0,0,0.02);
                }
                .bg-dark .pricing-style-one {
                    background: #1a1a1a;
                    border-color: rgba(255,255,255,0.05);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .pricing-style-one:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 60px rgba(var(--color-primary-rgb), 0.15);
                    border-color: var(--color-primary);
                }
                .pricing-top {
                    margin-bottom: 25px;
                }
                .pricing-top .left h4 {
                    font-size: 26px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    color: var(--color-heading);
                }
                .bg-dark .pricing-top .left h4 {
                    color: var(--white);
                }
                .pricing-top .left p {
                    font-size: 14px;
                    color: var(--color-primary);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .pricing-style-one .content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .pricing-style-one .price h2 {
                    font-size: 54px;
                    font-weight: 800;
                    margin-bottom: 25px;
                    color: var(--color-heading);
                }
                .bg-dark .pricing-style-one .price h2 {
                    color: var(--white);
                }
                .pricing-style-one ul {
                    flex-grow: 1;
                    list-style: none;
                    margin-bottom: 30px;
                    border-top: 1px solid rgba(0,0,0,0.05);
                    padding-top: 25px;
                }
                .bg-dark .pricing-style-one ul {
                    border-color: rgba(255,255,255,0.1);
                }
                .pricing-style-one ul li {
                    font-weight: 600;
                    color: var(--color-heading);
                    font-size: 16px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .bg-dark .pricing-style-one ul li {
                    color: #ddd;
                }
                .pricing-style-one ul li::before {
                    content: "✓";
                    color: var(--color-primary);
                    font-weight: 900;
                }
                .pricing-style-one .button .btn-style-regular {
                    background: #FFAE00;
                    color: #fff;
                    width: 100%;
                    text-align: center;
                    padding: 15px 25px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    border: none;
                }
                .pricing-style-one .button .btn-style-regular:hover {
                    background: var(--color-heading);
                    color: white;
                }
                .pricing-style-one .pricing-top .right i {
                    background: var(--color-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 45px;
                    margin-bottom: 15px;
                    display: block;
                }
            `}</style>
        </>
    );
};

export default PriceV1;