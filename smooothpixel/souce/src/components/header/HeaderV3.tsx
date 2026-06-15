import SmooothPixelLogo from "../logo/SmooothPixelLogo";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import useSidebarMenu from "../../hooks/useSidebarMenu";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";

type NavChild = {
    label: string;
    to: string;
    description?: string;
    icon?: string;
};

type NavItem = {
    label: string;
    to: string;
    highlight?: boolean;
    children?: NavChild[];
    mega?: {
        title: string;
        description: string;
        ctaLabel: string;
        ctaTo: string;
    };
};

const SCROLL_OFFSET = -88;

const NAV_CONFIG: NavItem[] = [
    { label: "Home", to: "home" },
    {
        label: "Services",
        to: "services",
        mega: {
            title: "Our expertise",
            description:
                "Premium 3D animation, SaaS explainers, and cinematic video production for ambitious brands.",
            ctaLabel: "Free consultation",
            ctaTo: "contact",
        },
        children: [
            { label: "Animation & Motion", to: "services", description: "3D, VFX & motion graphics", icon: "🎬" },
            { label: "SaaS & Explainers", to: "services", description: "Product demos & walkthroughs", icon: "💡" },
            { label: "Video Production", to: "services", description: "Edit, grade & delivery", icon: "🎥" },
        ],
    },
    {
        label: "Work",
        to: "portfolio",
        children: [
            { label: "Portfolio", to: "portfolio", description: "Selected client projects", icon: "🖼️" },
            { label: "Showreel", to: "showreel", description: "Watch our best cuts", icon: "▶️" },
        ],
    },
    { label: "Team", to: "team" },
    { label: "Reviews", to: "reviews" },
    {
        label: "Price Calculator",
        to: "calculator",
        highlight: true,
        children: [
            { label: "Estimate budget", to: "calculator", description: "Interactive project cost tool", icon: "🧮" },
            { label: "Pricing packages", to: "pricing", description: "Fixed plans & deliverables", icon: "📦" },
        ],
    },
    { label: "About", to: "about" },
    { label: "Contact", to: "contact" },
];

const scrollProps = {
    spy: true,
    smooth: true,
    duration: 550,
    offset: SCROLL_OFFSET,
    activeClass: "active",
};

function ChevronIcon() {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="sp-nav-chevron"
            aria-hidden
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

const HeaderV3 = () => {
    const { isOpen, openMenu, closeMenu } = useSidebarMenu();
    const location = useLocation();
    const isDark = location.pathname === "/home-dark";
    const [scrolled, setScrolled] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const { currentLanguage, setLanguage, t, languages } = useLanguage();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];
    const langDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 48);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close language dropdown on outside click
    useEffect(() => {
        if (!langDropdownOpen) return;
        const handler = (e: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [langDropdownOpen]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMenu();
    }, [closeMenu]);

    const renderDropdownPanel = (item: NavItem) => {
        if (!item.children?.length) return null;

        if (item.mega) {
            return (
                <div className="sp-dropdown-panel sp-dropdown-mega" role="menu">
                    <div className="sp-mega-grid">
                        <div className="sp-mega-aside">
                            <span className="sp-mega-kicker">Services</span>
                            <h5>{item.mega.title}</h5>
                            <p>{item.mega.description}</p>
                            <ScrollLink to={item.mega.ctaTo} {...scrollProps} className="sp-mega-cta">
                                {item.mega.ctaLabel} <span aria-hidden>→</span>
                            </ScrollLink>
                        </div>
                        <div className="sp-mega-links">
                            {item.children.map((child) => (
                                <ScrollLink
                                    key={`${item.label}-${child.label}`}
                                    to={child.to}
                                    {...scrollProps}
                                    className="sp-dropdown-link"
                                    role="menuitem"
                                >
                                    <span className="sp-dropdown-link-icon">{child.icon}</span>
                                    <span>
                                        <strong>{child.label}</strong>
                                        {child.description && <small>{child.description}</small>}
                                    </span>
                                </ScrollLink>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="sp-dropdown-panel sp-dropdown-compact" role="menu">
                {item.children.map((child) => (
                    <ScrollLink
                        key={`${item.label}-${child.label}`}
                        to={child.to}
                        {...scrollProps}
                        className="sp-dropdown-link"
                        role="menuitem"
                    >
                        {child.icon && <span className="sp-dropdown-link-icon">{child.icon}</span>}
                        <span>
                            <strong>{child.label}</strong>
                            {child.description && <small>{child.description}</small>}
                        </span>
                    </ScrollLink>
                ))}
            </div>
        );
    };

    const renderDesktopNavItem = (item: NavItem) => {
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren) {
            return (
                <ScrollLink
                    key={item.label}
                    to={item.to}
                    {...scrollProps}
                    className={`sp-nav-tab ${item.highlight ? "sp-nav-tab-accent" : ""}`}
                >
                    {item.label}
                </ScrollLink>
            );
        }

        return (
            <div key={item.label} className="sp-nav-dropdown">
                <span className="sp-nav-dropdown-trigger">
                    <ScrollLink
                        to={item.to}
                        {...scrollProps}
                        className={`sp-nav-tab sp-nav-tab-has-menu ${item.highlight ? "sp-nav-tab-accent" : ""}`}
                    >
                        {item.label}
                        <ChevronIcon />
                    </ScrollLink>
                </span>
                {renderDropdownPanel(item)}
            </div>
        );
    };

    return (
        <>
            <header
                className={`sp-header ${isDark ? "sp-theme-dark" : "sp-theme-light"} ${scrolled ? "sp-scrolled" : ""}`}
            >
                <div className="sp-header-glow" aria-hidden />
                <div className="sp-header-inner">
                    <Link to="/" className="sp-logo" onClick={scrollToTop} aria-label="SmooothPixel home">
                        <SmooothPixelLogo light={isDark} />
                    </Link>

                    <nav className="sp-nav-desktop" aria-label="Main navigation">
                        <div className="sp-nav-tabs-scroll">
                            <div className="sp-nav-tabs">{NAV_CONFIG.map(renderDesktopNavItem)}</div>
                        </div>
                    </nav>

                    <div className="sp-header-actions">
                        <Link
                            to={isDark ? "/" : "/home-dark"}
                            className="sp-icon-btn"
                            title="Toggle theme"
                            aria-label="Toggle theme"
                        >
                            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
                        </Link>

                        {/* ── Premium Language Switcher ── */}
                        <div className="sp-lang-wrapper" ref={langDropdownRef}>
                            <button
                                type="button"
                                className={`sp-lang-btn ${langDropdownOpen ? 'sp-lang-btn--open' : ''}`}
                                onClick={() => setLangDropdownOpen(v => !v)}
                                aria-haspopup="listbox"
                                aria-expanded={langDropdownOpen}
                                aria-label="Change language"
                            >
                                <span className="sp-lang-flag">
                                    {activeLang.flag === 'fa' ? '🇮🇷' : activeLang.flag}
                                </span>
                                <span className="sp-lang-code">
                                    {activeLang.code.toUpperCase()}
                                </span>
                                <svg className="sp-lang-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {langDropdownOpen && (
                                <div className="sp-lang-dropdown" role="listbox" aria-label="Select language">
                                    <div className="sp-lang-dropdown-header">Language</div>
                                    {languages.map((lang) => {
                                        const isActive = currentLanguage === lang.code;
                                        return (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                role="option"
                                                aria-selected={isActive}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setLangDropdownOpen(false);
                                                }}
                                                className={`sp-lang-option ${isActive ? 'sp-lang-option--active' : ''}`}
                                            >
                                                <span className="sp-lang-option-flag">
                                                    {lang.flag === 'fa' ? '🇮🇷' : lang.flag}
                                                </span>
                                                <span className="sp-lang-option-name">{lang.name}</span>
                                                {isActive && (
                                                    <svg className="sp-lang-option-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <Link to="/contact" className="sp-cta-btn">
                            <span>{t('lets_talk')}</span>
                            <i className="far fa-comment-dots" aria-hidden />
                        </Link>
                        <button type="button" className="sp-hamburger" onClick={openMenu} aria-label="Open menu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </header>

            <div className={`sp-mobile-overlay ${isOpen ? "sp-active" : ""}`} onClick={closeMenu} />
            <aside className={`sp-mobile-sidebar ${isOpen ? "sp-active" : ""}`} aria-hidden={!isOpen}>
                <div className="sp-sidebar-head">
                    <SmooothPixelLogo light={isDark} />
                    <button type="button" className="sp-sidebar-close" onClick={closeMenu} aria-label="Close menu">
                        <i className="fa fa-times" />
                    </button>
                </div>
                <nav className="sp-sidebar-nav" aria-label="Mobile navigation">
                    {NAV_CONFIG.map((item) => {
                        const hasChildren = Boolean(item.children?.length);
                        const expanded = mobileExpanded === item.label;

                        if (!hasChildren) {
                            return (
                                <ScrollLink
                                    key={item.label}
                                    to={item.to}
                                    {...scrollProps}
                                    onClick={closeMenu}
                                    className={`sp-sidebar-link ${item.highlight ? "sp-sidebar-accent" : ""}`}
                                >
                                    {item.label}
                                </ScrollLink>
                            );
                        }

                        return (
                            <div key={item.label} className="sp-sidebar-group">
                                <button
                                    type="button"
                                    className={`sp-sidebar-group-btn ${expanded ? "sp-expanded" : ""}`}
                                    onClick={() => setMobileExpanded(expanded ? null : item.label)}
                                    aria-expanded={expanded}
                                >
                                    <span>{item.label}</span>
                                    <ChevronIcon />
                                </button>
                                {expanded && (
                                    <div className="sp-sidebar-sub">
                                        <ScrollLink
                                            to={item.to}
                                            {...scrollProps}
                                            onClick={closeMenu}
                                            className="sp-sidebar-sublink sp-sidebar-sublink-main"
                                        >
                                            Overview
                                        </ScrollLink>
                                        {item.children!.map((child) => (
                                            <ScrollLink
                                                key={child.label}
                                                to={child.to}
                                                {...scrollProps}
                                                onClick={closeMenu}
                                                className="sp-sidebar-sublink"
                                            >
                                                {child.icon && <span>{child.icon}</span>}
                                                {child.label}
                                            </ScrollLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
                <div className="sp-sidebar-footer">
                    {/* Mobile Language Switcher */}
                    <div className="sp-sidebar-lang">
                        <span className="sp-sidebar-lang-label">Language</span>
                        <div className="sp-sidebar-lang-grid">
                            {languages.map((lang) => {
                                const isActive = currentLanguage === lang.code;
                                return (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => setLanguage(lang.code)}
                                        className={`sp-sidebar-lang-item ${isActive ? 'sp-sidebar-lang-item--active' : ''}`}
                                        aria-pressed={isActive}
                                    >
                                        <span>{lang.flag === 'fa' ? '🇮🇷' : lang.flag}</span>
                                        <span>{lang.code.toUpperCase()}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <Link to="/contact" className="sp-cta-btn sp-cta-full" onClick={closeMenu}>
                        <span>{t('lets_talk')}</span>
                        <i className="far fa-comment-dots" />
                    </Link>
                </div>
            </aside>

            <style>{`
                /* ===== Light theme (default home) ===== */
                .sp-header.sp-theme-light {
                    --sp-bar-bg: linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,250,240,0.98) 100%);
                    --sp-bar-border: rgba(255, 174, 0, 0.28);
                    --sp-bar-shadow: 0 12px 40px rgba(255, 140, 0, 0.12), 0 4px 24px rgba(15, 23, 42, 0.08);
                    --sp-bar-shadow-scrolled: 0 16px 48px rgba(255, 140, 0, 0.18), 0 8px 32px rgba(15, 23, 42, 0.1);
                    --sp-glow: linear-gradient(120deg, rgba(255,174,0,0.55), rgba(245,66,0,0.25), rgba(255,220,120,0.4));
                    --sp-tabs-track: rgba(255, 174, 0, 0.08);
                    --sp-tabs-border: rgba(255, 174, 0, 0.15);
                    --sp-text: #475569;
                    --sp-text-hover: #0f172a;
                    --sp-text-active: #b45309;
                    --sp-tab-hover-bg: rgba(255, 174, 0, 0.1);
                    --sp-tab-active-bg: linear-gradient(135deg, rgba(255,174,0,0.22), rgba(245,66,0,0.1));
                    --sp-tab-active-border: rgba(255, 174, 0, 0.45);
                    --sp-accent-tab: #d97706;
                    --sp-dropdown-bg: rgba(255, 255, 255, 0.98);
                    --sp-dropdown-border: rgba(255, 174, 0, 0.2);
                    --sp-dropdown-shadow: 0 20px 50px rgba(255, 140, 0, 0.15), 0 8px 30px rgba(15, 23, 42, 0.08);
                    --sp-dropdown-title: #0f172a;
                    --sp-dropdown-muted: #64748b;
                    --sp-dropdown-hover: rgba(255, 174, 0, 0.1);
                    --sp-dropdown-icon-bg: rgba(255, 174, 0, 0.12);
                    --sp-icon-btn-bg: rgba(255, 174, 0, 0.08);
                    --sp-icon-btn-border: rgba(255, 174, 0, 0.2);
                    --sp-icon-color: #64748b;
                    --sp-hamburger-bg: rgba(255, 174, 0, 0.1);
                    --sp-hamburger-border: rgba(255, 174, 0, 0.25);
                    --sp-hamburger-bar: #334155;
                    --sp-sidebar-bg: #ffffff;
                    --sp-sidebar-border: rgba(255, 174, 0, 0.15);
                    --sp-sidebar-text: #475569;
                    --sp-sidebar-hover: rgba(255, 174, 0, 0.08);
                    --sp-mega-kicker: #ea580c;
                }

                /* ===== Dark theme (home-dark only) ===== */
                .sp-header.sp-theme-dark {
                    --sp-bar-bg: linear-gradient(135deg, rgba(18,20,32,0.94), rgba(10,12,20,0.96));
                    --sp-bar-border: rgba(255,255,255,0.1);
                    --sp-bar-shadow: 0 16px 48px rgba(0,0,0,0.45);
                    --sp-bar-shadow-scrolled: 0 20px 56px rgba(0,0,0,0.55);
                    --sp-glow: linear-gradient(120deg, rgba(255,174,0,0.35), rgba(139,92,246,0.2), rgba(56,189,248,0.25));
                    --sp-tabs-track: rgba(255,255,255,0.04);
                    --sp-tabs-border: rgba(255,255,255,0.06);
                    --sp-text: rgba(255,255,255,0.72);
                    --sp-text-hover: #fff;
                    --sp-text-active: #ffe7a8;
                    --sp-tab-hover-bg: rgba(255,255,255,0.08);
                    --sp-tab-active-bg: rgba(255,174,0,0.14);
                    --sp-tab-active-border: rgba(255,174,0,0.25);
                    --sp-accent-tab: #fcd34d;
                    --sp-dropdown-bg: rgba(14,16,26,0.98);
                    --sp-dropdown-border: rgba(255,255,255,0.1);
                    --sp-dropdown-shadow: 0 24px 60px rgba(0,0,0,0.55);
                    --sp-dropdown-title: #fff;
                    --sp-dropdown-muted: rgba(255,255,255,0.5);
                    --sp-dropdown-hover: rgba(255,255,255,0.06);
                    --sp-dropdown-icon-bg: rgba(255,255,255,0.06);
                    --sp-icon-btn-bg: rgba(255,255,255,0.05);
                    --sp-icon-btn-border: rgba(255,255,255,0.08);
                    --sp-icon-color: rgba(255,255,255,0.8);
                    --sp-hamburger-bg: rgba(255,255,255,0.05);
                    --sp-hamburger-border: rgba(255,255,255,0.1);
                    --sp-hamburger-bar: #fff;
                    --sp-sidebar-bg: rgba(12,14,22,0.99);
                    --sp-sidebar-border: rgba(255,255,255,0.08);
                    --sp-sidebar-text: rgba(255,255,255,0.8);
                    --sp-sidebar-hover: rgba(255,255,255,0.06);
                    --sp-mega-kicker: #fbbf24;
                }

                .sp-header {
                    position: fixed;
                    top: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    width: min(1240px, calc(100% - 32px));
                    transition: top 0.35s ease, width 0.35s ease;
                    overflow: visible;
                }
                .sp-header.sp-scrolled { top: 8px; }
                .sp-header-glow {
                    position: absolute;
                    inset: -2px;
                    border-radius: 999px;
                    background: var(--sp-glow);
                    opacity: 0.55;
                    filter: blur(14px);
                    z-index: -1;
                    pointer-events: none;
                }
                .sp-scrolled .sp-header-glow { opacity: 0.75; }

                .sp-header-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 0 12px 0 22px;
                    height: 68px;
                    background: var(--sp-bar-bg);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border: 1px solid var(--sp-bar-border);
                    border-radius: 999px;
                    box-shadow: var(--sp-bar-shadow);
                    transition: box-shadow 0.35s ease, border-color 0.35s ease;
                    overflow: visible;
                }
                .sp-scrolled .sp-header-inner {
                    box-shadow: var(--sp-bar-shadow-scrolled);
                }

                .sp-logo {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    text-decoration: none;
                }
                .sp-logo img { height: 28px; }

                .sp-nav-desktop {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    min-width: 0;
                    overflow: visible;
                }
                .sp-nav-tabs-scroll {
                    max-width: min(100%, 58vw);
                    overflow: visible;
                }
                .sp-nav-tabs {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    padding: 4px;
                    background: var(--sp-tabs-track);
                    border: 1px solid var(--sp-tabs-border);
                    border-radius: 999px;
                    overflow: visible;
                }

                .sp-nav-tab {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: var(--sp-text);
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-decoration: none;
                    padding: 10px 14px;
                    border-radius: 999px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: color 0.2s, background 0.2s, box-shadow 0.2s, border-color 0.2s;
                    border: 1px solid transparent;
                }
                .sp-nav-tab:hover {
                    color: var(--sp-text-hover);
                    background: var(--sp-tab-hover-bg);
                }
                .sp-nav-tab.active {
                    color: var(--sp-text-active);
                    background: var(--sp-tab-active-bg);
                    border-color: var(--sp-tab-active-border);
                    box-shadow: 0 4px 16px rgba(255, 174, 0, 0.15);
                }
                .sp-nav-tab-accent {
                    color: var(--sp-accent-tab);
                    font-weight: 700;
                }
                .sp-nav-tab-accent.active {
                    background: var(--sp-tab-active-bg);
                }
                .sp-nav-chevron {
                    transition: transform 0.25s ease;
                    opacity: 0.75;
                }
                .sp-nav-dropdown:hover .sp-nav-chevron,
                .sp-nav-dropdown:focus-within .sp-nav-chevron {
                    transform: rotate(180deg);
                }

                .sp-nav-dropdown {
                    position: relative;
                }
                .sp-nav-dropdown:hover {
                    z-index: 10070;
                }
                .sp-nav-dropdown-trigger {
                    display: inline-flex;
                }
                .sp-dropdown-panel {
                    position: absolute;
                    top: calc(100% + 6px);
                    left: 50%;
                    transform: translateX(-50%) translateY(8px) scale(0.98);
                    min-width: 260px;
                    padding: 10px;
                    background: var(--sp-dropdown-bg);
                    border: 1px solid var(--sp-dropdown-border);
                    border-radius: 18px;
                    box-shadow: var(--sp-dropdown-shadow);
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                    z-index: 10060;
                }
                .sp-dropdown-panel::before {
                    content: '';
                    position: absolute;
                    top: -12px;
                    left: 0;
                    right: 0;
                    height: 12px;
                }
                .sp-nav-dropdown:hover .sp-dropdown-panel,
                .sp-nav-dropdown:focus-within .sp-dropdown-panel {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transform: translateX(-50%) translateY(0) scale(1);
                }
                .sp-dropdown-mega {
                    width: min(560px, 92vw);
                    padding: 18px;
                }
                .sp-mega-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 18px;
                }
                .sp-mega-aside {
                    padding-right: 16px;
                    border-right: 1px solid var(--sp-dropdown-border);
                }
                .sp-mega-kicker {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: var(--sp-mega-kicker);
                    margin-bottom: 8px;
                }
                .sp-mega-aside h5 {
                    color: var(--sp-dropdown-title);
                    font-size: 16px;
                    font-weight: 800;
                    margin: 0 0 10px;
                }
                .sp-mega-aside p {
                    color: var(--sp-dropdown-muted);
                    font-size: 12px;
                    line-height: 1.6;
                    margin: 0 0 14px;
                }
                .sp-mega-cta {
                    color: var(--sp-mega-kicker);
                    font-size: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                }
                .sp-mega-cta:hover { color: #f54200; }
                .sp-mega-links {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .sp-dropdown-link {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    text-decoration: none !important;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.18s;
                }
                .sp-dropdown-link:hover {
                    background: var(--sp-dropdown-hover);
                    transform: translateX(2px);
                }
                .sp-dropdown-link-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 10px;
                    background: var(--sp-dropdown-icon-bg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                .sp-dropdown-link strong {
                    display: block;
                    color: var(--sp-dropdown-title);
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .sp-dropdown-link small {
                    display: block;
                    color: var(--sp-dropdown-muted);
                    font-size: 11px;
                    line-height: 1.35;
                }

                .sp-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }
                .sp-icon-btn {
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: var(--sp-icon-color);
                    background: var(--sp-icon-btn-bg);
                    border: 1px solid var(--sp-icon-btn-border);
                    text-decoration: none;
                    transition: all 0.25s ease;
                }
                .sp-icon-btn:hover {
                    color: #ea580c;
                    border-color: rgba(255, 174, 0, 0.5);
                    background: rgba(255, 174, 0, 0.15);
                    transform: rotate(12deg);
                }
                .sp-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 20px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #ffae00, #f54200);
                    color: #fff !important;
                    font-weight: 800;
                    font-size: 12px;
                    text-decoration: none !important;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    box-shadow: 0 8px 24px rgba(255,174,0,0.35);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .sp-cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(255,174,0,0.45);
                }

                .sp-hamburger {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    gap: 5px;
                    width: 42px;
                    height: 42px;
                    background: var(--sp-hamburger-bg);
                    border: 1px solid var(--sp-hamburger-border);
                    border-radius: 12px;
                    cursor: pointer;
                    padding: 10px;
                }
                .sp-hamburger span {
                    display: block;
                    height: 2px;
                    background: var(--sp-hamburger-bar);
                    border-radius: 2px;
                }

                .sp-mobile-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    backdrop-filter: blur(6px);
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .sp-mobile-overlay.sp-active { opacity: 1; visibility: visible; }

                .sp-mobile-sidebar {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: min(360px, 88vw);
                    height: 100vh;
                    background: var(--sp-sidebar-bg);
                    border-left: 1px solid var(--sp-sidebar-border);
                    z-index: 10001;
                    display: flex;
                    flex-direction: column;
                    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
                    box-shadow: -12px 0 40px rgba(255, 140, 0, 0.08);
                }
                .sp-mobile-sidebar.sp-active { right: 0; }

                .sp-sidebar-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 22px 24px;
                    border-bottom: 1px solid var(--sp-sidebar-border);
                }
                .sp-sidebar-close {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    border: 1px solid var(--sp-icon-btn-border);
                    background: var(--sp-icon-btn-bg);
                    color: var(--sp-text-hover);
                    cursor: pointer;
                }
                .sp-sidebar-nav {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px 20px;
                }
                .sp-sidebar-link,
                .sp-sidebar-group-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 14px 16px;
                    border-radius: 14px;
                    color: var(--sp-sidebar-text);
                    font-size: 15px;
                    font-weight: 600;
                    text-decoration: none;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                }
                .sp-sidebar-link:hover,
                .sp-sidebar-group-btn:hover,
                .sp-sidebar-link.active {
                    background: var(--sp-sidebar-hover);
                    color: var(--sp-text-hover);
                }
                .sp-sidebar-link.active {
                    color: var(--sp-text-active);
                    font-weight: 700;
                }
                .sp-sidebar-accent { color: var(--sp-accent-tab); }
                .sp-sidebar-group-btn.sp-expanded .sp-nav-chevron {
                    transform: rotate(180deg);
                }
                .sp-sidebar-sub {
                    padding: 4px 8px 12px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .sp-sidebar-sublink {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    border-radius: 10px;
                    color: var(--sp-dropdown-muted);
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    cursor: pointer;
                }
                .sp-sidebar-sublink-main { font-weight: 700; color: var(--sp-dropdown-title); }
                .sp-sidebar-sublink:hover {
                    background: var(--sp-sidebar-hover);
                    color: var(--sp-text-hover);
                }
                .sp-sidebar-footer {
                    padding: 20px 24px 28px;
                    border-top: 1px solid var(--sp-sidebar-border);
                }
                .sp-cta-full { width: 100%; justify-content: center; }

                /* ──────────────────────────────────────────
                   PREMIUM LANGUAGE SWITCHER
                ────────────────────────────────────────── */
                .sp-lang-wrapper {
                    position: relative;
                    flex-shrink: 0;
                }

                .sp-lang-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    height: 42px;
                    padding: 0 14px;
                    border-radius: 999px;
                    border: 1px solid var(--sp-icon-btn-border);
                    background: var(--sp-icon-btn-bg);
                    color: var(--sp-icon-color);
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    white-space: nowrap;
                    backdrop-filter: blur(8px);
                }
                .sp-lang-btn:hover,
                .sp-lang-btn--open {
                    border-color: rgba(255,174,0,0.55);
                    background: rgba(255,174,0,0.12);
                    color: var(--sp-text-active);
                    box-shadow: 0 4px 18px rgba(255,174,0,0.18);
                }
                .sp-lang-flag {
                    font-size: 16px;
                    line-height: 1;
                }
                .sp-lang-code {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    opacity: 0.85;
                }
                .sp-lang-chevron {
                    opacity: 0.6;
                    transition: transform 0.25s ease;
                    margin-left: 2px;
                }
                .sp-lang-btn--open .sp-lang-chevron {
                    transform: rotate(180deg);
                    opacity: 1;
                }

                .sp-lang-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    min-width: 175px;
                    padding: 8px;
                    background: var(--sp-dropdown-bg);
                    border: 1px solid var(--sp-dropdown-border);
                    border-radius: 18px;
                    box-shadow: var(--sp-dropdown-shadow);
                    z-index: 10070;
                    animation: spLangIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @keyframes spLangIn {
                    from { opacity: 0; transform: translateY(6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)  scale(1);    }
                }

                .sp-lang-dropdown-header {
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--sp-dropdown-muted);
                    padding: 4px 12px 8px;
                }

                .sp-lang-option {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 9px 12px;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: var(--sp-dropdown-title);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.18s, color 0.18s;
                    text-align: left;
                }
                .sp-lang-option:hover {
                    background: var(--sp-dropdown-hover);
                }
                .sp-lang-option--active {
                    background: linear-gradient(135deg, rgba(255,174,0,0.18), rgba(245,66,0,0.08));
                    color: var(--sp-accent-tab);
                    font-weight: 700;
                }
                .sp-lang-option-flag {
                    font-size: 18px;
                    line-height: 1;
                    flex-shrink: 0;
                }
                .sp-lang-option-name {
                    flex: 1;
                }
                .sp-lang-option-check {
                    margin-left: auto;
                    color: var(--sp-accent-tab);
                    flex-shrink: 0;
                    opacity: 0.85;
                }

                /* Mobile sidebar language picker */
                .sp-sidebar-lang {
                    margin-bottom: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--sp-sidebar-border);
                }
                .sp-sidebar-lang-label {
                    display: block;
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    color: var(--sp-dropdown-muted);
                    margin-bottom: 10px;
                }
                .sp-sidebar-lang-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .sp-sidebar-lang-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 12px;
                    border-radius: 999px;
                    border: 1px solid var(--sp-icon-btn-border);
                    background: var(--sp-icon-btn-bg);
                    color: var(--sp-sidebar-text);
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .sp-sidebar-lang-item:hover {
                    border-color: rgba(255,174,0,0.45);
                    background: rgba(255,174,0,0.1);
                    color: var(--sp-text-active);
                }
                .sp-sidebar-lang-item--active {
                    border-color: rgba(255,174,0,0.6);
                    background: linear-gradient(135deg, rgba(255,174,0,0.2), rgba(245,66,0,0.1));
                    color: var(--sp-accent-tab);
                    box-shadow: 0 2px 10px rgba(255,174,0,0.2);
                }

                @media (max-width: 1199px) {
                    .sp-nav-tab { padding: 9px 11px; font-size: 12px; }
                    .sp-cta-btn span { display: none; }
                    .sp-lang-code { display: none; }
                }
                @media (max-width: 991px) {
                    .sp-nav-desktop { display: none; }
                    .sp-hamburger { display: flex; }
                    .sp-header { width: calc(100% - 24px); }
                    .sp-header-inner { padding: 0 12px 0 18px; height: 60px; }
                    .sp-lang-btn { display: none; }
                }
                @media (max-width: 575px) {
                    .sp-cta-btn { display: none; }
                }
            `}</style>
        </>
    );
};

export default HeaderV3;
