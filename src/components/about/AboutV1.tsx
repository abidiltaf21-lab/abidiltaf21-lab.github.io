import { useEffect } from 'react';
import shape3 from "/assets/img/shape/3.png"
import shape8 from "/assets/img/shape/8.png"
import team14 from "/assets/img/team/14.jpg"
import team15 from "/assets/img/team/15.jpg"
import team16 from "/assets/img/team/16.jpg"
import team17 from "/assets/img/team/17.jpg"
import CountUp from 'react-countup';
import { Link } from "react-router-dom";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const AboutV1 = () => {

    // Scroll Animation 
    useEffect(() => {
        const upDown_Scroll = document.querySelector(".upDownScrol");

        if (upDown_Scroll) {
            gsap.set(upDown_Scroll, { yPercent: 105 });

            const scrollAnimation = gsap.to(upDown_Scroll, {
                yPercent: -105,
                ease: "none",
                scrollTrigger: {
                    trigger: upDown_Scroll,
                    end: "bottom center",
                    scrub: 1,
                },
            });

            // Cleanup function to kill the animation on unmount
            return () => {
                scrollAnimation.kill();
                const scrollTriggers = ScrollTrigger.getAll();
                scrollTriggers.forEach((trigger) => trigger.kill());
            };
        }
    }, []);

    return (
        <>
            <div id="about" className="about-style-one-area bg-gray default-padding">
                <div className="shape-style-one">
                    <img src={shape3} alt="Image Not Found" />
                    <img className="upDownScrol" src={shape8} alt="Image Not Found" />
                </div>
                <div className="container">
                    <div className="row align-center">
                        <div className="col-lg-7 pr-80 pr-md-15 pr-xs-15">
                            <div className="about-style-one-info">
                                <h4 className="sub-title">Creative Storytelling</h4>
                                <h2 className="title premium-gradient-title">Crafting Motion that <br /> Defines Your Brand</h2>
                                <p>
                                    At <strong>Smoooth Pixel</strong>, we don't just animate; we breathe life into ideas. As a senior motion graphics specialist, I blend 15 years of industry-leading expertise with cutting-edge visual technology to create cinematic experiences that resonate globally.
                                </p>
                                <p>
                                    Our philosophy is simple: <strong>Elegance in Motion</strong>. Whether it's high-end corporate identities, complex 3D technical visualizations, or fast-paced social media campaigns, we deliver pixel-perfect results that leave a lasting impact.
                                </p>
                                <Link className="btn-style-four mt-20" to="#" >
                                    View Showreel <i className="fas fa-arrow-right" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="about-stats-card p-40 bg-white border-radius-20 shadow-lg">
                                <div className="profile-thumb-wrapper text-center mb-40">
                                    <img src="/assets/img/about/profile.png" alt="Profile" className="profile-img" />
                                    <div className="status-online"></div>
                                </div>

                                <div className="stats-grid">
                                    <div className="fun-fact">
                                        <div className="counter">
                                            <div className="timer"> <CountUp end={15} enableScrollSpy={true} /></div>
                                            <div className="operator">+</div>
                                        </div>
                                        <span className="medium">Years Experience</span>
                                    </div>
                                    <div className="fun-fact">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={1568} enableScrollSpy={true} /></div>
                                            <div className="operator">+</div>
                                        </div>
                                        <span className="medium">Projects Done</span>
                                    </div>
                                </div>

                                <div className="clieents-list mt-40 pt-30 border-top">
                                    <div className="d-flex align-center justify-between">
                                        <div className="thumb">
                                            <img src={team14} alt="Client" />
                                            <img src={team15} alt="Client" />
                                            <img src={team16} alt="Client" />
                                            <img src={team17} alt="Client" />
                                        </div>
                                        <div className="info text-right">
                                            <h5 className="mb-0">783 Clients</h5>
                                            <span className="text-sm opacity-70">Satisfied Globally</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .premium-gradient-title {
                    background: linear-gradient(90deg, var(--color-heading), var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .bg-dark .premium-gradient-title {
                    background: linear-gradient(90deg, #fff, var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .about-stats-card {
                    background: var(--white);
                    padding: 40px;
                    border-radius: 30px;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.07);
                    position: relative;
                    z-index: 1;
                    border: 1px solid rgba(0,0,0,0.03);
                }
                .bg-dark .about-stats-card {
                    background: var(--dark-secondary) !important;
                    border-color: rgba(255,255,255,0.05);
                    box-shadow: 0 25px 70px rgba(0,0,0,0.3);
                }
                .profile-img {
                    width: 140px;
                    height: 140px;
                    border-radius: 40px;
                    object-fit: cover;
                    border: 8px solid var(--bg-gray-secondary);
                    transition: all 0.35s ease-in-out;
                }
                .bg-dark .profile-img {
                    border-color: var(--dark-optional);
                }
                .about-stats-card:hover .profile-img {
                    transform: scale(1.05) rotate(3deg);
                    border-color: var(--color-primary);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    text-align: center;
                }
                .about-stats-card .fun-fact .counter {
                    font-size: 100px;
                    font-weight: 900;
                    background: linear-gradient(180deg, var(--color-primary), #ffed4a);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 1;
                    margin-bottom: 15px;
                    letter-spacing: -2px;
                    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
                }
                .about-stats-card .fun-fact .timer {
                    font-size: 100px;
                    font-weight: 900;
                }
                .bg-dark .fun-fact .counter {
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
                }
                .fun-fact .counter .operator {
                    font-size: 36px;
                    font-weight: 800;
                    margin-left: 5px;
                    -webkit-text-fill-color: var(--color-primary);
                    background: none;
                }
埋–                .fun-fact span {
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 700;
                    color: var(--color-primary);
                }
                .border-top {
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
                .bg-dark .border-top {
                    border-top-color: rgba(255,255,255,0.05);
                }
                .status-online {
                    position: absolute;
                    bottom: 0;
                    right: 35%;
                    width: 25px;
                    height: 25px;
                    background: #2ecc71;
                    border: 4px solid var(--white);
                    border-radius: 50%;
                }
                .bg-dark .status-online {
                    border-color: var(--dark-secondary);
                }
            `}</style>
        </>
    );
};

export default AboutV1;