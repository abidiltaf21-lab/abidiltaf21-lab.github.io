import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';

const HOME_SECTION_IDS = [
    'home',
    'services',
    'showreel',
    'portfolio',
    'stats',
    'team',
    'reviews',
    'calculator',
    'pricing',
    'about',
    'contact',
];

type GeoCache = {
    country?: string;
    countryCode?: string;
    city?: string;
    regionName?: string;
};

let geoCache: GeoCache | null = null;

function getSessionId(): string {
    let sid = sessionStorage.getItem('_vsid');
    if (!sid) {
        sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        sessionStorage.setItem('_vsid', sid);
    }
    return sid;
}

async function getGeo(): Promise<GeoCache> {
    if (geoCache) return geoCache;

    // Try ipwho.is (free, fast, no key needed)
    try {
        const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                geoCache = {
                    country:    data.country     || 'Unknown',
                    countryCode: data.country_code || 'XX',
                    city:       data.city         || '',
                    regionName: data.region       || '',
                };
                return geoCache!;
            }
        }
    } catch { /* try fallback */ }

    // Fallback: ip-api.com (also free, HTTP only — no HTTPS for free tier)
    try {
        const res = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,city,regionName',
            { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success') {
                geoCache = {
                    country:    data.country     || 'Unknown',
                    countryCode: data.countryCode || 'XX',
                    city:       data.city         || '',
                    regionName: data.regionName   || '',
                };
                return geoCache!;
            }
        }
    } catch { /* ignore */ }

    return {};
}

async function logVisit(page: string, section?: string) {
    const storageKey = section ? `_vl_${page}_${section}` : `_vl_${page}`;
    if (sessionStorage.getItem(storageKey)) return;

    try {
        const geo = await getGeo();
        await apiService.logVisit({
            country: geo.country,
            countryCode: geo.countryCode,
            city: geo.city,
            region: geo.regionName,
            page,
            section: section || undefined,
            sessionId: getSessionId(),
        });
        sessionStorage.setItem(storageKey, '1');
    } catch {
        // analytics must never break the site
    }
}

const VisitorTracker = () => {
    const location = useLocation();
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const page = location.pathname || '/';
        logVisit(page);
    }, [location.pathname]);

    useEffect(() => {
        const isHome = location.pathname === '/' || location.pathname === '/home-dark';
        observerRef.current?.disconnect();

        if (!isHome) return;

        const seen = new Set<string>();

        const timer = window.setTimeout(() => {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        const id = entry.target.id;
                        if (!id || seen.has(id)) return;
                        seen.add(id);
                        logVisit(location.pathname || '/', id);
                    });
                },
                { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' }
            );

            HOME_SECTION_IDS.forEach((id) => {
                const el = document.getElementById(id);
                if (el) observerRef.current?.observe(el);
            });
        }, 800);

        return () => {
            window.clearTimeout(timer);
            observerRef.current?.disconnect();
        };
    }, [location.pathname]);

    return null;
};

export default VisitorTracker;
