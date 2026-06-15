import profileImg from "/assets/img/about/profile.png"
import shape13 from "/assets/img/shape/13.png"
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSocialAccounts } from '../../hooks/useSocialAccounts';
import { apiService } from '../../services/api';
import axios from 'axios';
import { normalizeTelegramHandle } from '../../utils/telegramLink';
import { CONTACT_BUDGET_OPTIONS } from '../../utils/contactBudgetOptions';
import { useLanguage } from '../../context/LanguageContext';

interface FormEventHandler {
    (event: React.FormEvent<HTMLFormElement>): void;
}

interface DataType {
    sectionClass?: string;
}

const ContactV1 = ({ sectionClass }: DataType) => {
    const [submitting, setSubmitting] = useState(false);
    const { t } = useLanguage();
    const { accounts: socialAccounts } = useSocialAccounts();
    const activeAccounts = socialAccounts.filter(a => a.isVisible);
    
    // Distinguish Contact Channels (like Email, Location, Telegram badges)
    const contactBadges = activeAccounts.filter(a => 
        a.platform.toLowerCase() === 'email' || 
        a.platform.toLowerCase() === 'location' || 
        a.platform.toLowerCase() === 'telegram' || 
        a.platform.toLowerCase() === 'phone'
    );

    // Social handles for the icon bar at the bottom
    const socialBarAccounts = activeAccounts.filter(a => 
        a.platform.toLowerCase() !== 'location' && 
        a.platform.toLowerCase() !== 'phone'
    );

    const handleForm: FormEventHandler = async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = String(formData.get('name') ?? '').trim();
        const email = String(formData.get('email') ?? '').trim();
        const phone = String(formData.get('phone') ?? '').trim();
        const telegram = String(formData.get('telegram') ?? '').trim();
        const budgetRange = String(formData.get('budget') ?? '').trim();
        const message = String(formData.get('comments') ?? '').trim();

        if (!name || !email || !message) {
            toast.error('Please fill in name, email, and your project message.');
            return;
        }

        const payload = {
            name,
            email,
            phone: phone || undefined,
            telegram: normalizeTelegramHandle(telegram) || undefined,
            budgetRange: budgetRange || undefined,
            message,
            projectType: 'Inquiry from Website',
            status: 'New',
        };

        setSubmitting(true);
        try {
            await apiService.sendMessage(payload);
            form.reset();
            toast.success('Thanks! Your inquiry has been received. We will reply soon.');
        } catch (err) {
            let errorText = 'Could not send your message. Make sure the API is running.';
            if (axios.isAxiosError(err)) {
                const apiMsg = err.response?.data?.message || err.response?.data?.detail;
                if (apiMsg) errorText = String(apiMsg);
                else if (err.code === 'ERR_NETWORK') {
                    errorText = 'Cannot reach the server. Start ReactApi and use VITE_API_BASE_URL=/api in .env';
                }
            }
            toast.error(errorText);
            console.error('Contact form submit failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div id="contact" className={`contact-style-one-area ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="contact-style-one-items sp-card">
                        <h1 className="fixed-text">{t('contact_title')}</h1>
                        <div className="row">
                            <div className="col-lg-6">
                                <form className="contact-form contact-form" onSubmit={handleForm}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input className="form-control" id="name" name="name" placeholder={t('contact_name')} type="text" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="email" name="email" placeholder={t('contact_email')} type="email" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <input className="form-control" id="phone" name="phone" placeholder={t('contact_phone')} type="text" autoComplete='off' required />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <input
                                                    className="form-control"
                                                    id="telegram"
                                                    name="telegram"
                                                    placeholder={t('contact_telegram')}
                                                    type="text"
                                                    autoComplete="off"
                                                />
                                                <span className="alert-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <select
                                                    className="form-control contact-budget-select"
                                                    id="budget"
                                                    name="budget"
                                                    defaultValue=""
                                                    aria-label="Estimated budget"
                                                >
                                                    {CONTACT_BUDGET_OPTIONS.map((opt) => (
                                                        <option key={opt.value || 'empty'} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group comments">
                                                <textarea className="form-control" id="comments" name="comments" placeholder={t('contact_message')} autoComplete='off' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <button className="btn-style-regular" type="submit" name="submit" id="submit" disabled={submitting}>
                                                <span>{submitting ? t('contact_sending') : t('contact_submit')}</span> <i className="fas fa-arrow-right" />
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
                                                <span className="text">
                                                    {t('years_expert').split('\n').map((line, idx) => (
                                                        <span key={idx}>
                                                            {line}
                                                            {idx === 0 && <br />}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="profile-info-premium">
                                            <div className="status-indicator-glass">
                                                <span className="pulse-ring"></span>
                                                <span className="status-text">{t('ready_for_work')}</span>
                                            </div>
                                            <h3 className="profile-name-premium">Smoooth Pixel</h3>
                                            <p className="profile-desc-premium">{t('senior_expert')}</p>

                                            {contactBadges.length > 0 ? (
                                                contactBadges.map((badge) => (
                                                    badge.platform.toLowerCase() === 'email' ? (
                                                        <div className="contact-email-badge" key={badge.id}>
                                                            <div className="icon"><i className={badge.icon}></i></div>
                                                            <div className="email-text">
                                                                <span>{badge.platform}</span>
                                                                {badge.value.split(',').map((val, idx) => (
                                                                    <a href={`mailto:${val.trim()}`} key={idx} style={{ marginBottom: idx === 0 ? "2px" : "0" }}>
                                                                        {val.trim()}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <a href={badge.link} target="_blank" rel="noopener noreferrer" className="contact-email-badge" style={{ textDecoration: 'none' }} key={badge.id}>
                                                            <div className="icon" style={badge.platform.toLowerCase() === 'telegram' ? { background: '#229ED9', color: '#fff' } : {}}><i className={badge.icon}></i></div>
                                                            <div className="email-text">
                                                                <span style={badge.platform.toLowerCase() === 'telegram' ? { color: '#229ED9' } : {}}>{badge.platform}</span>
                                                                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-heading)', textTransform: 'none', letterSpacing: 'normal' }}>{badge.value}</span>
                                                            </div>
                                                        </a>
                                                    )
                                                ))
                                            ) : (
                                                <>
                                                    <div className="contact-email-badge">
                                                        <div className="icon"><i className="fas fa-envelope"></i></div>
                                                        <div className="email-text">
                                                            <span>{t('official_email')}</span>
                                                            <a href="mailto:info@smooothpixel.com" style={{ marginBottom: "2px" }}>info@smooothpixel.com</a>
                                                            <a href="mailto:smooothpixelteam@gmail.com">smooothpixelteam@gmail.com</a>
                                                        </div>
                                                    </div>

                                                    <a href="https://t.me/SmooothPixel" target="_blank" rel="noopener noreferrer" className="contact-email-badge" style={{ textDecoration: 'none' }}>
                                                        <div className="icon" style={{ background: '#229ED9', color: '#fff' }}><i className="fab fa-telegram-plane"></i></div>
                                                        <div className="email-text">
                                                            <span style={{ color: '#229ED9' }}>{t('telegram_support')}</span>
                                                            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-heading)' }}>@SmooothPixel</span>
                                                        </div>
                                                    </a>
                                                </>
                                            )}

                                            <div className="social-links-premium">
                                                {socialBarAccounts.length > 0 ? (
                                                    socialBarAccounts.map(account => (
                                                        <a href={account.link} target="_blank" rel="noopener noreferrer" key={account.id}>
                                                            <i className={account.icon}></i>
                                                        </a>
                                                    ))
                                                ) : (
                                                    <>
                                                        <a href="https://t.me/SmooothPixel" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram-plane"></i></a>
                                                        <a href="#"><i className="fab fa-behance"></i></a>
                                                        <a href="#"><i className="fab fa-dribbble"></i></a>
                                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                                    </>
                                                )}
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
                .contact-budget-select {
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2364748b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 18px center;
                    padding-right: 44px !important;
                    color: var(--color-heading);
                }
                .contact-budget-select:invalid,
                .contact-budget-select option[value=''] {
                    color: var(--color-paragraph);
                }
                .bg-dark .contact-budget-select {
                    background-color: rgba(255, 255, 255, 0.04);
                    color: var(--color-heading);
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23cbd5e1' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
                }
                .bg-dark .contact-budget-select option {
                    background: #0f172a;
                    color: #f1f5f9;
                }

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
                    width: 52px;
                    height: 52px;
                    background: var(--color-primary);
                    color: black;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
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