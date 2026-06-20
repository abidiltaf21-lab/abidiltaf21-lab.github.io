import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

// Sections on homepage to track
const TRACKED_SECTIONS: Record<string, string> = {
    'banner-section':      'home',
    'services-section':    'services',
    'showreel-section':    'showreel',
    'portfolio-section':   'portfolio',
    'stats-section':       'stats',
    'team-section':        'team',
    'reviews-section':     'reviews',
    'calculator-section':  'calculator',
    'pricing-section':     'pricing',
    'about-section':       'about',
    'contact-section':     'contact',
};

// Unique session ID per browser tab (not persisted — privacy-friendly)
function getSessionId(): string {
    let sid = sessionStorage.getItem('_sp_sid');
    if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('_sp_sid', sid);
    }
    return sid;
}

// Fetch geo-info from ipapi.co (free, no key needed for low traffic)
async function fetchGeoInfo(): Promise<{
    country: string;
    countryCode: string;
    city: string;
    region: string;
} | null> {
    try {
        const cached = sessionStorage.getItem('_sp_geo');
        if (cached) return JSON.parse(cached);

        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        if (!res.ok) return null;
        const data = await res.json();

        const geo = {
            country:     data.country_name || 'Unknown',
            countryCode: data.country_code  || 'XX',
            city:        data.city          || '',
            region:      data.region        || '',
        };
        sessionStorage.setItem('_sp_geo', JSON.stringify(geo));
        return geo;
    } catch {
        return null;
    }
}

export function useVisitorTracking() {
    const location  = useLocation();
    const sessionId = getSessionId();
    const loggedPages    = useRef<Set<string>>(new Set());
    const loggedSections = useRef<Set<string>>(new Set());
    const observerRef    = useRef<IntersectionObserver | null>(null);

    // ── Log page visit on each route change ──────────────────────────────────
    useEffect(() => {
        const page = location.pathname;

        // Only log each page once per session
        if (loggedPages.current.has(page)) return;
        loggedPages.current.add(page);

        (async () => {
            const geo = await fetchGeoInfo();
            try {
                await apiService.logVisit({
                    page,
                    sessionId,
                    country:     geo?.country     ?? undefined,
                    countryCode: geo?.countryCode ?? undefined,
                    city:        geo?.city        ?? undefined,
                    region:      geo?.region      ?? undefined,
                });
            } catch {
                // Silently fail — never break the UX
            }
        })();
    }, [location.pathname]);

    // ── Track which sections are viewed via IntersectionObserver ─────────────
    useEffect(() => {
        // Disconnect previous observer on route change
        observerRef.current?.disconnect();
        loggedSections.current.clear();

        const geo = JSON.parse(sessionStorage.getItem('_sp_geo') || 'null') as {
            country?: string; countryCode?: string; city?: string; region?: string;
        } | null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionKey = (entry.target as HTMLElement).dataset.trackSection;
                    if (!sectionKey || loggedSections.current.has(sectionKey)) return;
                    loggedSections.current.add(sectionKey);

                    // Fire and forget
                    apiService.logVisit({
                        page:        location.pathname,
                        section:     sectionKey,
                        sessionId,
                        country:     geo?.country     ?? undefined,
                        countryCode: geo?.countryCode ?? undefined,
                        city:        geo?.city        ?? undefined,
                        region:      geo?.region      ?? undefined,
                    }).catch(() => {});
                });
            },
            { threshold: 0.3 }
        );

        // Observe all elements with data-track-section attribute
        document.querySelectorAll('[data-track-section]').forEach((el) => observer.observe(el));
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [location.pathname]);
}
