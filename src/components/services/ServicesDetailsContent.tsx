import PromoV1 from '../promo/PromoV1';
import banner3 from "/assets/img/banner/3.jpg"
import { useParams, Link } from 'react-router-dom';
import ServicesDetailsData from "../../assets/jsonData/services/ServicesDetailsData.json";

const ServicesDetailsContent = () => {
    const { id } = useParams();
    const service = ServicesDetailsData.find(s => s.id === parseInt(id || "1")) || (ServicesDetailsData[0] as any);

    return (
        <>
            <div className="services-details-area default-padding-bottom">
                <div className="container">
                    <div className="services-details-items">
                        <div className="row">
                            <div className="col-xl-12">
                                {service.videoUrl ? (
                                    <div className="service-video-container">
                                        <iframe
                                            src={service.videoUrl}
                                            title={`${service.title} Video`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="service-single-thumb">
                                        <img src={banner3} alt="Service Presentation" className="rounded-20 shadow-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row mt-60">
                            <div className="col-lg-12">
                                <div className="detail-header mb-50">
                                    <h2 className="main-detail-title">{service.mainTitle}</h2>
                                    <p className="lead-text">{service.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hierarchical Sub-Services Groups */}
                        <div className="row">
                            {service.groups && service.groups.map((group: any, gIndex: number) => (
                                <div className="col-lg-12 mb-50" key={gIndex}>
                                    <div className="sub-service-group-card">
                                        <div className="group-header">
                                            <h3>{group.name}</h3>
                                            <div className="divider"></div>
                                        </div>
                                        <div className="sub-items-grid">
                                            {group.items.map((item: any, iIndex: number) => (
                                                <div className="sub-item-box" key={iIndex}>
                                                    <div className="check-icon">✓</div>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row mt-50">
                            <div className="col-lg-6">
                                <div className="process-box p-40 rounded-20 bg-gray">
                                    <h2 className="mb-30">Our specialized process</h2>
                                    <div className="process-style-one">
                                        {service.process.map((step: any, index: number) => (
                                            <div className="process-style-one-item" key={index}>
                                                <span>0{index + 1}</span>
                                                <h4>{step.title}</h4>
                                                <p>{step.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 pl-60 pl-md-15 pl-xs-15 mt-md-50 mt-xs-50">
                                <h2 className="mb-30">Expert Solutions</h2>
                                <p>{service.secondaryDescription}</p>
                                <div className="cta-box-simple mt-40">
                                    <h4>Ready to start your project?</h4>
                                    <p>Contact us today for a free consultation and customized quote for your {service.title} needs.</p>
                                    <Link to="/contact" className="btn-style-one mt-20">Get Started Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .rounded-20 { border-radius: 20px; }
                .main-detail-title {
                    font-size: 42px;
                    font-weight: 800;
                    margin-bottom: 25px;
                    background: linear-gradient(90deg, var(--color-heading), var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .bg-dark .main-detail-title {
                    background: linear-gradient(90deg, #fff, var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .lead-text {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #555;
                    max-width: 800px;
                }
                .bg-dark .lead-text {
                    color: #bbb;
                }
                .sub-service-group-card {
                    padding: 40px;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .bg-dark .sub-service-group-card {
                    background: #1a1a1a;
                    border-color: rgba(255,255,255,0.05);
                }
                .group-header {
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .group-header h3 {
                    margin-bottom: 0;
                    font-size: 26px;
                    font-weight: 700;
                    white-space: nowrap;
                    color: var(--color-heading);
                }
                .bg-dark .group-header h3 {
                    color: var(--white);
                }
                .group-header .divider {
                    height: 2px;
                    flex-grow: 1;
                    background: rgba(var(--color-primary-rgb), 0.2);
                }
                .sub-items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 15px;
                }
                .sub-item-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    background: rgba(var(--color-primary-rgb), 0.03);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
                .bg-dark .sub-item-box {
                    background: rgba(255, 255, 255, 0.03);
                }
                .sub-item-box:hover {
                    background: rgba(var(--color-primary-rgb), 0.08);
                    transform: translateX(5px);
                    border-color: var(--color-primary);
                }
                .check-icon {
                    color: var(--color-primary);
                    font-weight: 900;
                }
                .sub-item-box span {
                    font-weight: 600;
                    font-size: 15px;
                    color: var(--color-heading);
                }
                .bg-dark .sub-item-box span {
                    color: var(--white);
                }
                .cta-box-simple {
                    padding: 30px;
                    background: var(--color-primary);
                    border-radius: 15px;
                    color: #fff;
                }
                .cta-box-simple h4, .cta-box-simple p {
                    color: #fff;
                }
                .cta-box-simple .btn-style-one {
                    background: #fff;
                    color: var(--color-primary);
                }
                .bg-dark .process-box.bg-gray {
                    background-color: #1a1a1a !important;
                }
                .bg-dark .process-box h2 {
                    color: var(--white);
                }
            `}</style>

            <PromoV1 />
        </>
    );
};

export default ServicesDetailsContent;