import profileImg from "/assets/img/about/profile.png"
import shape13 from "/assets/img/shape/13.png"
import { toast } from 'react-toastify';

interface FormEventHandler {
    (event: React.FormEvent<HTMLFormElement>): void;
}

interface DataType {
    sectionClass?: string;
}

const ContactV1 = ({ sectionClass }: DataType) => {

    const handleForm: FormEventHandler = (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement;
        form.reset()
        toast.success("Thanks For Your Message")
    }

    return (
        <>
            <div id="contact" className={`contact-style-one-area ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="contact-style-one-items">
                        <h1 className="fixed-text">Contact Me</h1>
                        <div className="row">
                            <div className="col-lg-6">
                                <form className="contact-form contact-form" onSubmit={handleForm}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input className="form-control" id="name" name="name" placeholder="Name" type="text" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="email" name="email" placeholder="Email*" type="email" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="phone" name="phone" placeholder="Phone" type="text" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group comments">
                                                <textarea className="form-control" id="comments" name="comments" placeholder="Tell Us About Project *" autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <button className="btn-style-regular" type="submit" name="submit" id="submit">
                                                <span>Get in Touch</span> <i className="fas fa-arrow-right" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Alert Message */}
                                    <div className="col-lg-12 alert-notification">
                                        <div id="message" className="alert-msg" />
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-6">
                                <div className="contact-illustration-premium">
                                    <div className="premium-ornament ornament-1"></div>
                                    <div className="premium-ornament ornament-2"></div>

                                    <div className="profile-card-glass">
                                        <div className="profile-image-frame">
                                            <div className="profile-orbit-ring"></div>
                                            <div className="profile-image-inner">
                                                <img src={profileImg} alt="Profile" className="profile-img-premium" />
                                            </div>
                                            <div className="experience-badge-modern">
                                                <span className="number">15</span>
                                                <span className="text">YEARS<br />EXPERT</span>
                                            </div>
                                        </div>

                                        <div className="profile-info-premium">
                                            <div className="status-indicator-glass">
                                                <span className="pulse-ring"></span>
                                                <span className="status-text">Ready for work</span>
                                            </div>
                                            <h3 className="profile-name-premium">Smoooth Pixel</h3>
                                            <p className="profile-desc-premium">Senior Motion Graphics & 3D Visualization Expert</p>

                                            <div className="contact-email-badge">
                                                <div className="icon"><i className="fas fa-envelope"></i></div>
                                                <div className="email-text">
                                                    <span>Official Email</span>
                                                    <a href="mailto:info@smooothpixel.com">info@smooothpixel.com</a>
                                                </div>
                                            </div>

                                            <div className="social-links-premium">
                                                <a href="#"><i className="fab fa-behance"></i></a>
                                                <a href="#"><i className="fab fa-dribbble"></i></a>
                                                <a href="#"><i className="fab fa-instagram"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <img src={shape13} alt="Decoration" className="shape-bg-premium" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .contact-illustration-premium {
                    position: relative;
                    padding: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 650px;
                }

                /* Animated Ornaments */
                .premium-ornament {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    z-index: 1;
                    opacity: 0.4;
                    animation: float-ornament 10s infinite alternate ease-in-out;
                }
                .ornament-1 {
                    width: 300px;
                    height: 300px;
                    background: var(--color-primary);
                    top: 10%;
                    left: 10%;
                }
                .ornament-2 {
                    width: 250px;
                    height: 250px;
                    background: #ffed4a;
                    bottom: 10%;
                    right: 10%;
                    animation-delay: -5s;
                }

                @keyframes float-ornament {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(30px, 40px) scale(1.1); }
                }

                /* Glass Card */
                .profile-card-glass {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 40px;
                    padding: 25px;
                    width: 100%;
                    max-width: 520px;
                    position: relative;
                    z-index: 3;
                    box-shadow: 
                        0 20px 50px rgba(0,0,0,0.05),
                        inset 0 0 20px rgba(255,255,255,0.5);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .bg-dark .profile-card-glass {
                    background: rgba(30, 31, 34, 0.6);
                    border-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.4);
                }
                .profile-card-glass:hover {
                    transform: translateY(-20px) scale(1.02);
                    background: rgba(255, 255, 255, 0.5);
                }
                .bg-dark .profile-card-glass:hover {
                    background: rgba(30, 31, 34, 0.8);
                }

                /* Image Frame */
                .profile-image-frame {
                    position: relative;
                    margin-bottom: 25px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .profile-orbit-ring {
                    position: absolute;
                    width: 115%;
                    height: 115%;
                    border: 1px dashed var(--color-primary);
                    border-radius: 50%;
                    animation: orbit-rotate 20s infinite linear;
                    z-index: 2;
                    opacity: 0.6;
                }
                .profile-orbit-ring::before {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: 50%;
                    width: 10px;
                    height: 10px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 15px var(--color-primary);
                }
                @keyframes orbit-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .profile-image-inner {
                    border-radius: 30px;
                    overflow: hidden;
                    height: 380px;
                    width: 100%;
                    background: #f8f8f8;
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.05);
                    position: relative;
                    z-index: 3;
                }
                .bg-dark .profile-image-inner {
                    background: #111;
                }
                .profile-img-premium {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 1.2s ease;
                }
                .profile-card-glass:hover .profile-img-premium {
                    transform: scale(1.1);
                }

                /* Experience Badge */
                .experience-badge-modern {
                    position: absolute;
                    bottom: -15px;
                    right: 20px;
                    background: var(--color-primary);
                    color: black;
                    padding: 12px 18px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 15px 30px rgba(255, 110, 0, 0.3);
                    z-index: 5;
                }
                .experience-badge-modern .number {
                    font-size: 28px;
                    font-weight: 900;
                    line-height: 1;
                }
                .experience-badge-modern .text {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    line-height: 1.2;
                    letter-spacing: 1px;
                }

                /* Info Section */
                .profile-info-premium {
                    text-align: left;
                    padding: 5px 10px 0;
                }
                .status-indicator-glass {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(39, 174, 96, 0.1);
                    border: 1px solid rgba(39, 174, 96, 0.2);
                    padding: 6px 14px;
                    border-radius: 100px;
                    margin-bottom: 12px;
                }
                .status-text {
                    color: #27ae60;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .pulse-ring {
                    width: 8px;
                    height: 8px;
                    background: #27ae60;
                    border-radius: 50%;
                    margin-right: 10px;
                    position: relative;
                }
                .pulse-ring::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    border-radius: inherit;
                    animation: status-pulse 2s infinite;
                }
                @keyframes status-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(3.5); opacity: 0; }
                }

                .profile-name-premium {
                    font-size: 26px;
                    font-weight: 900;
                    margin: 0 0 5px;
                    background: linear-gradient(90deg, var(--color-heading), var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .bg-dark .profile-name-premium {
                    background: linear-gradient(90deg, #fff, var(--color-primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .profile-desc-premium {
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                    line-height: 1.5;
                    margin-bottom: 15px;
                }
                .bg-dark .profile-desc-premium {
                    color: #bbb;
                }

                .social-links-premium {
                    display: flex;
                    gap: 12px;
                }
                .contact-email-badge {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(var(--color-primary-rgb), 0.05);
                    padding: 12px 20px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    border: 1px solid rgba(var(--color-primary-rgb), 0.1);
                    transition: all 0.3s ease;
                }
                .bg-dark .contact-email-badge {
                    background: rgba(255, 255, 255, 0.03);
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .contact-email-badge:hover {
                    background: rgba(var(--color-primary-rgb), 0.1);
                    transform: translateX(5px);
                }
                .contact-email-badge .icon {
                    width: 40px;
                    height: 40px;
                    background: var(--color-primary);
                    color: black;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                .contact-email-badge .email-text {
                    display: flex;
                    flex-direction: column;
                }
                .contact-email-badge .email-text span {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 800;
                    color: var(--color-primary);
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .contact-email-badge .email-text a {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--color-heading);
                    text-decoration: none;
                }
                .bg-dark .contact-email-badge .email-text a {
                    color: var(--white);
                }
                .social-links-premium a {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: rgba(0,0,0,0.03);
                    color: var(--color-heading);
                    transition: all 0.3s ease;
                }
                .bg-dark .social-links-premium a {
                    background: rgba(255,255,255,0.05);
                    color: #ccc;
                }
                .social-links-premium a:hover {
                    background: var(--color-primary);
                    color: white;
                    transform: translateY(-5px);
                }

                .shape-bg-premium {
                    position: absolute;
                    top: 0;
                    right: 0;
                    opacity: 0.15;
                    z-index: 0;
                    width: 100%;
                }

                @media (max-width: 991px) {
                    .contact-illustration-premium {
                        min-height: 500px;
                        padding: 20px;
                    }
                    .profile-image-inner {
                        height: 320px;
                    }
                    .profile-card-glass {
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default ContactV1;