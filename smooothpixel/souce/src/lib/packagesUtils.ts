export interface PackageInfo {
    title: string;
    price: number;
    description: string;
    features: string[];
}

export interface PackagesStructure {
    basic: PackageInfo;
    standard: PackageInfo;
    premium: PackageInfo;
}

type TierKey = keyof PackagesStructure;

const TIER_KEYS: TierKey[] = ['basic', 'standard', 'premium'];

const DEFAULTS_BY_KEY: Record<string, PackagesStructure> = {
    animation: {
        basic: {
            title: 'Basic Pack',
            price: 149,
            description: 'Essential starter package.',
            features: [
                'Custom 2D Animation',
                'Corporate Motion Graphics',
                'UI & Social Media Motion',
            ],
        },
        standard: {
            title: 'Standard Kit',
            price: 299,
            description: 'Most popular full package.',
            features: [
                'Everything in Basic',
                '3D & Particle Logo Reveal',
                'Animated Typo & Kinetic Text',
                'Priority delivery (5–7 days)',
            ],
        },
        premium: {
            title: 'Premium Suite',
            price: 499,
            description: 'Ultimate high-fidelity suite.',
            features: [
                'Everything in Standard',
                'Character Rigging & Setup',
                'Unlimited revision rounds',
                'Dedicated art director',
            ],
        },
    },
    explainer: {
        basic: {
            title: 'Basic Pack',
            price: 299,
            description: 'Essential explainer package.',
            features: ['SaaS & Startup Explainers', 'Icon-Based & Flat Design', 'Script support'],
        },
        standard: {
            title: 'Standard Kit',
            price: 499,
            description: 'Full storytelling package.',
            features: [
                'Everything in Basic',
                'Character-Based Storytelling',
                'Infographic & Data Videos',
                'Professional voiceover',
            ],
        },
        premium: {
            title: 'Premium Suite',
            price: 799,
            description: 'Complete conversion-focused suite.',
            features: [
                'Everything in Standard',
                'Whiteboard & Hand-Drawn',
                'Product & App Demos',
                '4K delivery + source files',
            ],
        },
    },
    video: {
        basic: {
            title: 'Basic Pack',
            price: 199,
            description: 'Essential edit package.',
            features: ['Advanced Post-Production', 'Social Media Ads & Promo', 'Color correction'],
        },
        standard: {
            title: 'Standard Kit',
            price: 399,
            description: 'Professional production kit.',
            features: [
                'Everything in Basic',
                'Corporate Video Production',
                'Professional Color Grading',
            ],
        },
        premium: {
            title: 'Premium Suite',
            price: 699,
            description: 'Cinematic full production.',
            features: [
                'Everything in Standard',
                'E-Commerce & Shopify Ads',
                'Subtitles & High-End Edits',
                'Sound design included',
            ],
        },
    },
    '3d': {
        basic: {
            title: 'Basic Pack',
            price: 499,
            description: 'Starter 3D showcase.',
            features: ['Full 3D Product Animation', 'Realistic Texture & Lighting', 'HD render'],
        },
        standard: {
            title: 'Standard Kit',
            price: 899,
            description: 'E-commerce ready package.',
            features: [
                'Everything in Basic',
                'E-Commerce 3D Product Ad',
                'Amazon / Shopify Showcase',
            ],
        },
        premium: {
            title: 'Premium Suite',
            price: 1299,
            description: 'Studio-grade visualization.',
            features: [
                'Everything in Standard',
                'Exploded View Animations',
                'High-Fidelity 4K Renders',
                'Multiple camera angles',
            ],
        },
    },
};

function resolveDefaultsKey(serviceTitle: string): string | null {
    const t = serviceTitle.toLowerCase();
    if (t.includes('animation') || t.includes('motion')) return 'animation';
    if (t.includes('explainer')) return 'explainer';
    if (t.includes('video') || t.includes('production')) return 'video';
    if (t.includes('3d') || t.includes('product')) return '3d';
    return null;
}

function arrayToPackages(features: string[], defaultPrice: number): PackagesStructure {
    const basicCount = Math.min(3, features.length);
    const standardCount = Math.min(5, features.length);
    return {
        basic: {
            title: 'Basic Pack',
            price: defaultPrice || 149,
            description: 'Essential starter package.',
            features: features.slice(0, basicCount),
        },
        standard: {
            title: 'Standard Kit',
            price: defaultPrice ? Math.round(defaultPrice * 1.8) : 299,
            description: 'Most popular full package.',
            features: features.slice(0, standardCount),
        },
        premium: {
            title: 'Premium Suite',
            price: defaultPrice ? Math.round(defaultPrice * 3) : 499,
            description: 'Ultimate high-fidelity suite.',
            features: [...features],
        },
    };
}

function mergeWithDefaults(
    packages: PackagesStructure,
    serviceTitle: string,
    defaultPrice: number
): PackagesStructure {
    const key = resolveDefaultsKey(serviceTitle);
    const defaults = key ? DEFAULTS_BY_KEY[key] : null;
    const result = { ...packages };

    TIER_KEYS.forEach((tier) => {
        const current = { ...result[tier] };
        const fallback = defaults?.[tier];

        if (!current.features?.length && fallback?.features?.length) {
            current.features = [...fallback.features];
        }
        if (!current.description?.trim() && fallback?.description) {
            current.description = fallback.description;
        }
        if (!current.title?.trim() && fallback?.title) {
            current.title = fallback.title;
        }
        if (current.price === 0) {
            if (fallback?.price) {
                current.price = fallback.price;
            } else if (defaultPrice > 0 && tier === 'basic') {
                current.price = defaultPrice;
            } else if (defaultPrice > 0 && tier === 'standard') {
                current.price = Math.round(defaultPrice * 1.8);
            } else if (defaultPrice > 0 && tier === 'premium') {
                current.price = Math.round(defaultPrice * 3);
            }
        }

        result[tier] = current;
    });

    return result;
}

export function getPackages(
    featuresJson?: string,
    defaultPrice: number = 0,
    serviceTitle: string = ''
): PackagesStructure {
    let packages: PackagesStructure | null = null;

    try {
        if (featuresJson && featuresJson.trim() !== '' && featuresJson !== '[]') {
            const parsed = JSON.parse(featuresJson);

            if (parsed && parsed.basic && parsed.standard && parsed.premium) {
                packages = {
                    basic: { ...parsed.basic, features: parsed.basic.features || [] },
                    standard: { ...parsed.standard, features: parsed.standard.features || [] },
                    premium: { ...parsed.premium, features: parsed.premium.features || [] },
                };
            } else if (Array.isArray(parsed) && parsed.length > 0) {
                packages = arrayToPackages(parsed, defaultPrice);
            }
        }
    } catch {
        packages = null;
    }

    if (!packages) {
        packages = {
            basic: {
                title: 'Basic Pack',
                price: defaultPrice || 0,
                description: 'Essential starter package.',
                features: [],
            },
            standard: {
                title: 'Standard Kit',
                price: defaultPrice ? Math.round(defaultPrice * 1.8) : 0,
                description: 'Most popular full package.',
                features: [],
            },
            premium: {
                title: 'Premium Suite',
                price: defaultPrice ? Math.round(defaultPrice * 3) : 0,
                description: 'Ultimate high-fidelity suite.',
                features: [],
            },
        };
    }

    return mergeWithDefaults(packages, serviceTitle, defaultPrice);
}

export function formatPackagePrice(price: number): string {
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
