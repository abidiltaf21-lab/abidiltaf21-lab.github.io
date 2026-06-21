import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';

// All trackable home sections (must match element IDs in DOM)
const HOME_SECTION_IDS = [
    'home', 'services', 'showreel', 'portfolio',
    'stats', 'team', 'reviews', 'calculator', 'pricing', 'about', 'contact',
];

type GeoInfo = {
    country: string;
    countryCode: string;
    city: string;
    region: string;
};

// Module-level promise so geo is fetched ONCE and reused across all calls
let geoPromise: Promise<GeoInfo | null> | null = null;

function getSessionId(): string {
    let sid = sessionStorage.getItem('_vsid');
    if (!sid) {
        sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem('_vsid', sid);
    }
    return sid;
}

async function fetchGeo(): Promise<GeoInfo | null> {
    // Try ipwho.is — free, HTTPS, reliable
    try {
        const res = await fetch('https://ipwho.is/', {
            signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
            const d = await res.json();
            if (d.success && d.country) {
                return {
                    country:     d.country      ?? 'Unknown',
                    countryCode: d.country_code  ?? 'XX',
                    city:        d.city          ?? '',
                    region:      d.region        ?? '',
                };
            }
        }
    } catch { /* fall through */ }

    // Fallback: geoip-lite via a free public API
    try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json', {
            signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
            const d = await res.json();
            if (d.country) {
                return {
                    country:     d.country       ?? 'Unknown',
                    countryCode: d.country_code   ?? 'XX',
                    city:        d.city           ?? '',
                    region:      d.region         ?? '',
                };
            }
        }
    } catch { /* give up */ }

    return null;
}

function getGeo(): Promise<GeoInfo | null> {
    if (!geoPromise) geoPromise = fetchGeo();
    return geoPromise;
}

async function logVisit(page: string, section?: string) {
    // De-duplicate within the same browser session
    const key = section ? `_vl_${page}__${section}` : `_vl_${page}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');   // mark immediately to avoid race duplicates

    try {
        // Geo is fetched in parallel — await it here so country is always included
        const geo = await getGeo();
        await apiService.logVisit({
            country:     geo?.country     ?? undefined,
            countryCode: geo?.countryCode ?? undefined,
            city:        geo?.city        ?? undefined,
            region:      geo?.region      ?? undefined,
            page,
            section:     section || undefined,
            sessionId:   getSessionId(),
        });
    } catch {
        // Analytics must NEVER break the user experience
    }
}

const VisitorTracker = () => {
    const location    = useLocation();
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ── Prefetch geo as soon as the tracker mounts ──────────────────────────
    useEffect(() => { getGeo(); }, []);

    // ── Log page view on every route change ─────────────────────────────────
    useEffect(() => {
        const page = location.pathname || '/';
        // Skip admin panel pages — only track public site visitors
        if (page.startsWith('/admin') || page.startsWith('/login')) return;
        logVisit(page);
    }, [location.pathname]);

    // ── Track which home sections are viewed ────────────────────────────────
    useEffect(() => {
        observerRef.current?.disconnect();

        const isTrackedPage =
            location.pathname === '/' || location.pathname === '/home-dark';
        if (!isTrackedPage) return;

        const seenInPage = new Set<string>();

        // Delay slightly so the DOM is fully rendered
        const timer = window.setTimeout(() => {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        const id = entry.target.id;
                        if (!id || seenInPage.has(id)) return;
                        seenInPage.add(id);
                        logVisit(location.pathname || '/', id);
                    });
                },
                { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' }
            );

            HOME_SECTION_IDS.forEach((id) => {
                const el = document.getElementById(id);
                if (el) observerRef.current?.observe(el);
            });
        }, 600);

        return () => {
            window.clearTimeout(timer);
            observerRef.current?.disconnect();
        };
    }, [location.pathname]);

    return null;
};

export default VisitorTracker;
