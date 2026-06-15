import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

export interface SiteSettings {
    heroTitle: string;
    heroSubtitle: string;
    heroVideoUrl: string;
    ctaText: string;
    ctaLink: string;
    siteName: string;
    logoUrl: string;
    seoDescription: string;
    socialInstagram: string;
    socialBehance: string;
    socialDribbble: string;
    socialLinkedIn: string;
    galleryAutoplay: boolean;
    heroVideoOpacity: number;
    heroTypedText: string;
    heroTypedColor: string;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await apiClient.get('/SiteSettings');
                if (data) {
                    // Map both PascalCase and camelCase for safety
                    const normalizedSettings: SiteSettings = {
                        heroTitle: data.heroTitle || data.HeroTitle || '',
                        heroSubtitle: data.heroSubtitle || data.HeroSubtitle || '',
                        heroVideoUrl: data.heroVideoUrl || data.HeroVideoUrl || '',
                        heroVideoOpacity: data.heroVideoOpacity ?? data.HeroVideoOpacity ?? 0.5,
                        heroTypedText: data.heroTypedText || data.HeroTypedText || 'Motion Graphics,2D Animation,Explainer Videos',
                        heroTypedColor: data.heroTypedColor || data.HeroTypedColor || 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
                        ctaText: data.ctaText || data.CtaText || '',
                        ctaLink: data.ctaLink || data.CtaLink || '',
                        siteName: data.siteName || data.SiteName || '',
                        logoUrl: data.logoUrl || data.LogoUrl || '',
                        seoDescription: data.seoDescription || data.SeoDescription || '',
                        socialInstagram: data.socialInstagram || data.SocialInstagram || '',
                        socialBehance: data.socialBehance || data.SocialBehance || '',
                        socialDribbble: data.socialDribbble || data.SocialDribbble || '',
                        socialLinkedIn: data.socialLinkedIn || data.SocialLinkedIn || '',
                        galleryAutoplay: data.galleryAutoplay ?? data.GalleryAutoplay ?? true
                    };
                    setSettings(normalizedSettings);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading, error };
};
