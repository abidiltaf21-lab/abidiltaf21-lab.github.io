import ServicesData from "../../assets/jsonData/services/ServicesData.json"
import { Link } from "react-router-dom";
import { useState } from "react";
import arrow from "/assets/img/icon/arrow.png";
import ReactWOW from "react-wow";

const ServicesV2 = () => {

    const [activeIndex, setActiveIndex] = useState(1);

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <>
            <div id="services" className={`services-style-one-area bottom-less default-padding-bottom`}>
                <div className="container">
                    <div className="row">
                        {ServicesData.map((service, index) => (
                            <div className={`col-xl-3 col-md-6 mb-30`} key={service.id}>
                                <ReactWOW animation="fadeInUp">
                                    <div className={`service-style-one-item ${activeIndex === index ? "active" : ""}`}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                    >
                                        <img src={`/assets/img/icon/${service.icon}`} alt="Image Not Found" />
                                        <h4><Link to="/services-details">{service.title}</Link></h4>
                                        <p>{service.text}</p>
                                        <Link to="/services-details" className="btn-style-four">
                                            <div className="icon"><img src={arrow} alt="Image Not Found" /></div> Read More
                                        </Link>
                                    </div>
                                </ReactWOW>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesV2;