import SmooothPixelLogo from "../logo/SmooothPixelLogo";
import { Link, useLocation } from "react-router-dom";
import useSidebarMenu from "../../hooks/useSidebarMenu";
import useStickyMenu from "../../hooks/useStickyMenu";
import { useLanguage } from "../../context/LanguageContext";
import { useState } from "react";

import ServicesData from "../../assets/jsonData/services/ServicesData.json";

const HeaderV2 = () => {

    const { isOpen, openMenu, closeMenu } = useSidebarMenu();
    const isMenuSticky = useStickyMenu();
    const location = useLocation();
    const { currentLanguage, setLanguage, t, languages } = useLanguage();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const isDark = location.pathname === "/home-dark";
    const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

    return (
        <>
            <header>
                <nav className={`navbar mobile-sidenav navbar-box navbar-default validnavs navbar-sticky on no-full ${isMenuSticky ? "sticked" : ""} ${isOpen ? "navbar-responsive" : ""}`}>
                    <div className="top-search">
                        <div className="container-xl">
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-search" /></span>
                                <input type="text" className="form-control" placeholder="Search" name="search" />
                                <span className="input-group-addon close-search"><i className="fa fa-times" /></span>
                            </div>
                        </div>
                    </div>
                    <div className="container nav-box d-flex justify-content-between align-items-center">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={openMenu}>
                                <i className="fa fa-bars" />
                            </button>
                            <Link className="navbar-brand" to="/">
                                <SmooothPixelLogo />
                            </Link>
                        </div>
                        <div className={`collapse navbar-collapse collapse-mobile ${isOpen ? "show" : ""}`} id="navbar-menu">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" onClick={closeMenu}>
                                <i className="fa fa-times" />
                            </button>
                            <ul className="nav navbar-nav navbar-right" data-in="fadeInDown" data-out="fadeOutUp">
                                <li>
                                    <Link to={isDark ? "/home-dark" : "/"} onClick={closeMenu}>{t('home')}</Link>
                                </li>
                                <li className="dropdown">
                                    <Link className="dropdown-toggle" to="/service">{t('services')}</Link>
                                    <ul className="dropdown-menu">
                                        {ServicesData.map(service => (
                                            <li key={service.id}>
                                                <Link to={`/services-details/${service.id}`} onClick={closeMenu}>{service.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <Link className="smooth-menu" to="/projects">{t('portfolio')}</Link>
                                </li>

                                <li>
                                    <Link className="smooth-menu" to="/pricing">{t('pricing')}</Link>
                                </li>
                                <li>
                                    <Link className="smooth-menu" to="/contact">{t('contact')}</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="nav-right">
                            <div className="attr-right">
                                <div className="attr-nav attr-box">
                                    <ul style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <li>
                                            <Link to={isDark ? "/" : "/home-dark"} className="theme-toggle">
                                                <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
                                            </Link>
                                        </li>
                                        <li className="lang-selector-dropdown-wrapper" style={{ position: 'relative' }}>
                                            <button 
                                                type="button" 
                                                className="lang-toggle-btn"
                                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: isDark ? '#fff' : '#0f172a',
                                                    padding: '10px',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span>{activeLang.flag === 'fa' ? '🇮🇷' : activeLang.flag}</span>
                                                <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: 'inherit' }}>{activeLang.code}</span>
                                                <i className="fas fa-chevron-down" style={{ fontSize: '10px', transition: 'transform 0.3s', transform: langDropdownOpen ? 'rotate(180deg)' : 'none' }}></i>
                                            </button>
                                            {langDropdownOpen && (
                                                <ul className="lang-dropdown-menu-premium animate-scale-up" style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: currentLanguage === 'ar' || currentLanguage === 'fa' ? 'auto' : '0',
                                                    left: currentLanguage === 'ar' || currentLanguage === 'fa' ? '0' : 'auto',
                                                    background: 'rgba(15, 23, 42, 0.95)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    borderRadius: '12px',
                                                    padding: '8px 0',
                                                    margin: '8px 0 0',
                                                    listStyle: 'none',
                                                    minWidth: '130px',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                    zIndex: 9999
                                                }}>
                                                    {languages.map((lang) => (
                                                        <li key={lang.code}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setLanguage(lang.code);
                                                                    setLangDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    background: currentLanguage === lang.code ? 'rgba(255, 94, 20, 0.15)' : 'transparent',
                                                                    border: 'none',
                                                                    color: currentLanguage === lang.code ? 'var(--color-primary, #ff5e14)' : '#cbd5e1',
                                                                    padding: '8px 16px',
                                                                    textAlign: 'left',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                className="lang-item-btn"
                                                            >
                                                                <span>{lang.flag === 'fa' ? '🇮🇷' : lang.flag}</span>
                                                                <span>{lang.name}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                        <li className="button">
                                            <Link className="smooth-menu" to="/contact">{t('lets_talk')} <i className="fas fa-comment-alt" /></Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`overlay-screen ${isOpen ? "opened" : ""}`} onClick={closeMenu}></div>
                </nav>
            </header>
        </>
    );
};

export default HeaderV2;