import ServicesData from "../../assets/jsonData/services/ServicesData.json"
import { Link } from "react-router-dom";
import arrow from "/assets/img/icon/arrow.png";
import ReactWOW from "react-wow";

interface DataType {
    sectionClass?: string;
    hasTitle?: React.ReactNode
}

const ServicesV1 = ({ sectionClass, hasTitle }: DataType) => {

    return (
        <>
            <div id="services" className={`services-style-one-area bottom-less ${sectionClass ? sectionClass : ""}`}>

                {hasTitle &&
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2">
                                <div className="site-heading text-center">
                                    <h4 className="sub-title">Services</h4>
                                    <h2 className="title">Premium Creative Solutions</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className="container">
                    <div className="row justify-content-center">
                        {ServicesData.map((service: any, index: number) => (
                            <div className="col-lg-4 col-md-6 mb-30" key={service.id}>
                                <ReactWOW animation="fadeInUp" delay={`${index * 100}ms`}>
                                    <div className="service-style-one-item modern-card text-center">
                                        <div className="icon-wrapper justify-content-center">
                                            <i className={service.icon}></i>
                                        </div>
                                        <h4><Link to={`/services-details/${service.id}`}>{service.title}</Link></h4>
                                        <p>{service.text}</p>

                                        <Link to={`/services-details/${service.id}`} className="btn-style-four mt-30">
                                            <div className="icon"><img src={arrow} alt="Arrow" /></div> Explore Group
                                        </Link>
                                    </div>
                                </ReactWOW>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .modern-card {
                    height: 100%;
                    padding: 50px 35px;
                    border-radius: 20px;
                    background: var(--bg-card, #fff);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    border: 1px solid rgba(0,0,0,0.02);
                }
                .bg-dark .modern-card {
                    background: #1a1a1a;
                    border-color: rgba(255,255,255,0.05);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .modern-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 35px 70px rgba(var(--color-primary-rgb), 0.15);
                    border-color: var(--color-primary);
                }
                .icon-wrapper {
                    display: flex;
                    margin-bottom: 30px;
                }
                .icon-wrapper i {
                    font-size: 55px;
                    background: var(--color-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .modern-card h4, .modern-card h4 a {
                    font-size: 24px;
                    margin-bottom: 20px;
                    font-weight: 700;
                    color: var(--color-heading);
                    transition: color 0.3s;
                }
                .bg-dark .modern-card h4, .bg-dark .modern-card h4 a {
                    color: var(--white);
                }
                .modern-card p {
                    font-size: 16px;
                    line-height: 1.7;
                    color: #666;
                }
                .bg-dark .modern-card p {
                    color: #aaa;
                }
            `}</style>
        </>
    );
};

export default ServicesV1;