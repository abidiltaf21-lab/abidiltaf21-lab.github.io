

import partner3Light from "/assets/img/partner/3-light.png"
import partner4Light from "/assets/img/partner/4-light.png"
import partner5Light from "/assets/img/partner/5-light.png"
import partner6Light from "/assets/img/partner/6-light.png"
import partner7Light from "/assets/img/partner/7-light.png"
import olex from "/assets/img/partner/Olex.png"
import solarTisch from "/assets/img/partner/Logo _ Schrift GelbSchwarz.png"
import perchMobile from "/assets/img/partner/perch-mobile.png"
import mcfx from "/assets/img/partner/mcfx-logo.png"
import kiso from "/assets/img/partner/KISO-App.png"

const PartnerV2 = () => {
    return (
        <>
            <div className="partner-style-one-area text-center default-padding bottom-less overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Client Feedback</h4>
                                <h2 className="title">Testimonials</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-full">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="infinite-partner-scroll-wrapper">
                                <div className="infinite-partner-scroll-content">
                                    {/* Original Set */}
                                    <div className="partner-style-one-item">
                                        <a href="https://olexlube.com/" target="_blank" rel="noopener noreferrer">
                                            <img src={olex} alt="Olex Lubricants" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://www.solar-tisch.de" target="_blank" rel="noopener noreferrer">
                                            <img src={solarTisch} alt="Solar-Tisch" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://perchmobile.app" target="_blank" rel="noopener noreferrer">
                                            <img src={perchMobile} alt="Perch Mobile" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://mcfx.netlify.app/" target="_blank" rel="noopener noreferrer">
                                            <img src={mcfx} alt="MCFX" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://www.kiso-app.eu/" target="_blank" rel="noopener noreferrer">
                                            <img src={kiso} alt="KISO App" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item"><img src={partner3Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner4Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner5Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner6Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner7Light} alt="Partner" /></div>

                                    {/* Duplicate Set for Seamless Infinite Scroll */}
                                    <div className="partner-style-one-item">
                                        <a href="https://olexlube.com/" target="_blank" rel="noopener noreferrer">
                                            <img src={olex} alt="Olex Lubricants" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://www.solar-tisch.de" target="_blank" rel="noopener noreferrer">
                                            <img src={solarTisch} alt="Solar-Tisch" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://perchmobile.app" target="_blank" rel="noopener noreferrer">
                                            <img src={perchMobile} alt="Perch Mobile" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://mcfx.netlify.app/" target="_blank" rel="noopener noreferrer">
                                            <img src={mcfx} alt="MCFX" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item">
                                        <a href="https://www.kiso-app.eu/" target="_blank" rel="noopener noreferrer">
                                            <img src={kiso} alt="KISO App" />
                                        </a>
                                    </div>
                                    <div className="partner-style-one-item"><img src={partner3Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner4Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner5Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner6Light} alt="Partner" /></div>
                                    <div className="partner-style-one-item"><img src={partner7Light} alt="Partner" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerV2;