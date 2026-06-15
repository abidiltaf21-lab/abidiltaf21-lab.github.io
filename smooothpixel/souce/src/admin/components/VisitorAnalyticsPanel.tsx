import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
    Tooltip as RechartsTooltip, XAxis, YAxis,
} from 'recharts';
import { apiService } from '../../services/api';

type PeriodKey = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

interface VisitorFilters {
    country: string;
    city: string;
    page: string;
    section: string;
    period: PeriodKey;
    dateFrom: string;
    dateTo: string;
}

const DEFAULT_FILTERS: VisitorFilters = {
    country: '',
    city: '',
    page: '',
    section: '',
    period: '30d',
    dateFrom: '',
    dateTo: '',
};

interface FilterOptions {
    countries: { country: string; countryCode: string; visits: number }[];
    cities: { country: string; city: string; visits: number }[];
    pages: { page: string; label: string; visits: number }[];
    sections: { section: string; label: string; visits: number }[];
}

interface VisitorStats {
    total: number;
    uniqueVisitors: number;
    byCountry: { country: string; countryCode: string; visits: number }[];
    byCity: { country: string; city: string; visits: number }[];
    byPage: { page: string; label: string; visits: number }[];
    bySection: { section: string; label: string; visits: number }[];
    byDay: { date: string; visits: number }[];
    recent: {
        country?: string;
        Country?: string;
        countryCode?: string;
        CountryCode?: string;
        city?: string;
        City?: string;
        page?: string;
        Page?: string;
        section?: string;
        Section?: string;
        sectionLabel?: string;
        pageLabel?: string;
        visitedAt: string;
    }[];
    appliedFilters?: {
        country?: string;
        city?: string;
        page?: string;
        section?: string;
        period?: string;
        dateFrom?: string;
        dateTo?: string;
    };
}

const PERIOD_PRESETS: { key: PeriodKey; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: '7 days' },
    { key: '30d', label: '30 days' },
    { key: '90d', label: '90 days' },
    { key: 'all', label: 'All time' },
    { key: 'custom', label: 'Custom' },
];

function buildParams(filters: VisitorFilters): Record<string, string> {
    const params: Record<string, string> = { period: filters.period };
    if (filters.country) params.country = filters.country;
    if (filters.city) params.city = filters.city;
    if (filters.page) params.page = filters.page;
    if (filters.section) params.section = filters.section;
    if (filters.period === 'custom') {
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
    }
    return params;
}

const VisitorAnalyticsPanel: React.FC = () => {
    const [draft, setDraft] = useState<VisitorFilters>({ ...DEFAULT_FILTERS });
    const [applied, setApplied] = useState<VisitorFilters>({ ...DEFAULT_FILTERS });
    const [options, setOptions] = useState<FilterOptions | null>(null);
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(false);

    const loadOptions = useCallback(async (country?: string) => {
        try {
            const res = await apiService.getVisitorFilterOptions(country ? { country } : undefined);
            setOptions(res.data);
        } catch {
            setOptions(null);
        }
    }, []);

    const loadStats = useCallback(async (filters: VisitorFilters) => {
        setLoadingStats(true);
        try {
            const res = await apiService.getVisitorStats(buildParams(filters));
            setStats(res.data);
        } catch {
            setStats(null);
        } finally {
            setLoadingStats(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await loadOptions();
            await loadStats(DEFAULT_FILTERS);
        };
        init();
    }, [loadOptions, loadStats]);

    const handleApply = () => {
        setApplied({ ...draft });
        loadStats(draft);
    };

    const handleReset = () => {
        setDraft({ ...DEFAULT_FILTERS });
        setApplied({ ...DEFAULT_FILTERS });
        loadOptions();
        loadStats(DEFAULT_FILTERS);
    };

    const cityOptions = useMemo(() => {
        if (!options?.cities) return [];
        if (!draft.country) return options.cities;
        return options.cities.filter((c) => c.country === draft.country);
    }, [options, draft.country]);

    const activeChips = useMemo(() => {
        const chips: string[] = [];
        const f = applied;
        const periodLabel = PERIOD_PRESETS.find((p) => p.key === f.period)?.label ?? f.period;
        chips.push(`Period: ${periodLabel}`);
        if (f.period === 'custom' && (f.dateFrom || f.dateTo)) {
            chips.push(`Dates: ${f.dateFrom || '…'} → ${f.dateTo || '…'}`);
        }
        if (f.country) chips.push(`Country: ${f.country}`);
        if (f.city) chips.push(`City: ${f.city}`);
        if (f.page) {
            const label = options?.pages.find((p) => p.page === f.page)?.label ?? f.page;
            chips.push(`Page: ${label}`);
        }
        if (f.section) {
            const label = options?.sections.find((s) => s.section === f.section)?.label ?? f.section;
            chips.push(`Section: ${label}`);
        }
        return chips;
    }, [applied, options]);

    const hasActiveFilters =
        applied.country ||
        applied.city ||
        applied.page ||
        applied.section ||
        applied.period !== '30d' ||
        (applied.period === 'custom' && (applied.dateFrom || applied.dateTo));

    return (
        <div className="glass-panel p-4 mb-5 visitor-analytics-panel">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h5 className="text-white m-0 fw-700">
                        <i className="fas fa-globe-americas me-2" style={{ color: '#8b5cf6' }}></i>
                        Website Visitors
                    </h5>
                    <p className="text-muted m-0 mt-1 fs-13">
                        Filter by country, city, date, page, and home section
                    </p>
                </div>
                {stats && (
                    <div className="d-flex gap-3 flex-wrap">
                        <div className="text-center px-3 py-2 rounded-3 visitor-stat-pill">
                            <div className="text-white fw-800 fs-4">{stats.total}</div>
                            <div className="text-muted fs-11 text-uppercase fw-700">Filtered visits</div>
                        </div>
                        <div className="text-center px-3 py-2 rounded-3 visitor-stat-pill green">
                            <div className="text-white fw-800 fs-4">{stats.uniqueVisitors}</div>
                            <div className="text-muted fs-11 text-uppercase fw-700">Unique sessions</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="visitor-filter-box p-3 p-md-4 rounded-4 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <h6 className="text-white m-0 fw-700 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>
                        <i className="fas fa-filter me-2" style={{ color: '#8b5cf6' }}></i>
                        Filters
                    </h6>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm visitor-btn-reset" onClick={handleReset}>
                            <i className="fas fa-undo me-1"></i> Reset
                        </button>
                        <button type="button" className="btn btn-sm visitor-btn-apply" onClick={handleApply} disabled={loadingStats}>
                            {loadingStats ? (
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            ) : (
                                <i className="fas fa-search me-1"></i>
                            )}
                            Apply filters
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="visitor-filter-label">Time period</label>
                    <div className="d-flex flex-wrap gap-2">
                        {PERIOD_PRESETS.map((p) => (
                            <button
                                key={p.key}
                                type="button"
                                className={`visitor-period-btn ${draft.period === p.key ? 'active' : ''}`}
                                onClick={() => setDraft((prev) => ({ ...prev, period: p.key }))}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {draft.period === 'custom' && (
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="visitor-filter-label">From date</label>
                            <input
                                type="date"
                                className="visitor-filter-input"
                                value={draft.dateFrom}
                                onChange={(e) => setDraft((prev) => ({ ...prev, dateFrom: e.target.value }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="visitor-filter-label">To date</label>
                            <input
                                type="date"
                                className="visitor-filter-input"
                                value={draft.dateTo}
                                onChange={(e) => setDraft((prev) => ({ ...prev, dateTo: e.target.value }))}
                            />
                        </div>
                    </div>
                )}

                <div className="row g-3">
                    <div className="col-md-6 col-lg-3">
                        <label className="visitor-filter-label">Country</label>
                        <select
                            className="visitor-filter-input"
                            value={draft.country}
                            onChange={(e) => {
                                const country = e.target.value;
                                setDraft((prev) => ({ ...prev, country, city: '' }));
                                loadOptions(country || undefined);
                            }}
                        >
                            <option value="">All countries</option>
                            {(options?.countries || []).map((c) => (
                                <option key={`${c.country}-${c.countryCode}`} value={c.country}>
                                    {c.country} ({c.visits})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <label className="visitor-filter-label">City</label>
                        <select
                            className="visitor-filter-input"
                            value={draft.city}
                            onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
                            disabled={!draft.country && cityOptions.length > 50}
                        >
                            <option value="">All cities</option>
                            {cityOptions.map((c) => (
                                <option key={`${c.country}-${c.city}`} value={c.city}>
                                    {c.city}{draft.country ? '' : `, ${c.country}`} ({c.visits})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <label className="visitor-filter-label">Page</label>
                        <select
                            className="visitor-filter-input"
                            value={draft.page}
                            onChange={(e) => setDraft((prev) => ({ ...prev, page: e.target.value }))}
                        >
                            <option value="">All pages</option>
                            {(options?.pages || []).map((p) => (
                                <option key={p.page} value={p.page}>
                                    {p.label} ({p.visits})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <label className="visitor-filter-label">Home section</label>
                        <select
                            className="visitor-filter-input"
                            value={draft.section}
                            onChange={(e) => setDraft((prev) => ({ ...prev, section: e.target.value }))}
                        >
                            <option value="">All sections</option>
                            {(options?.sections || []).map((s) => (
                                <option key={s.section} value={s.section}>
                                    {s.label} ({s.visits})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <span className="visitor-filter-label d-block mb-2">Active filters</span>
                        <div className="d-flex flex-wrap gap-2">
                            {activeChips.map((chip) => (
                                <span key={chip} className="visitor-chip">{chip}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <p className="text-muted mb-0 fs-14">Loading visitor data…</p>
            ) : loadingStats && !stats ? (
                <p className="text-muted mb-0 fs-14">Applying filters…</p>
            ) : !stats || stats.total === 0 ? (
                <p className="text-muted mb-0 fs-14">
                    No visits match these filters. Try resetting or widening the date range.
                </p>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        <div className="col-lg-7">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>
                                Visits over time
                            </h6>
                            <div style={{ height: '220px', opacity: loadingStats ? 0.5 : 1 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.byDay.length ? stats.byDay : [{ date: '—', visits: 0 }]}>
                                        <defs>
                                            <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={3} fill="url(#visitorGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>Top countries</h6>
                            <div style={{ height: '220px', opacity: loadingStats ? 0.5 : 1 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.byCountry.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 16 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                        <XAxis type="number" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <YAxis type="category" dataKey="country" width={90} stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="visits" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>Top cities</h6>
                            <div className="table-responsive" style={{ maxHeight: '240px', opacity: loadingStats ? 0.5 : 1 }}>
                                <table className="table table-dark table-borderless align-middle mb-0 visitor-table">
                                    <thead>
                                        <tr className="text-muted fs-11 text-uppercase">
                                            <th>City</th>
                                            <th>Country</th>
                                            <th className="text-end">Visits</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.byCity.map((row, i) => (
                                            <tr key={i}>
                                                <td className="text-white fs-13">{row.city}</td>
                                                <td className="text-muted fs-12">{row.country}</td>
                                                <td className="text-end">
                                                    <span className="badge rounded-pill visitor-count-badge">{row.visits}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>Pages viewed</h6>
                            <div style={{ height: '240px', opacity: loadingStats ? 0.5 : 1 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.byPage}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="label" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="visits" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-5">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>Home sections</h6>
                            {stats.bySection.length === 0 ? (
                                <p className="text-muted fs-13">No section views in this filter range.</p>
                            ) : (
                                <div style={{ height: '260px', opacity: loadingStats ? 0.5 : 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.bySection} layout="vertical" margin={{ left: 4, right: 12 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                            <XAxis type="number" stroke="#64748b" axisLine={false} tickLine={false} allowDecimals={false} />
                                            <YAxis type="category" dataKey="label" width={120} stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <RechartsTooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                            <Bar dataKey="visits" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-7">
                            <h6 className="text-white fw-700 mb-3 fs-13 text-uppercase" style={{ letterSpacing: '1px' }}>
                                Recent visits <span className="text-muted fw-500">(up to 50)</span>
                            </h6>
                            <div className="table-responsive" style={{ maxHeight: '260px', opacity: loadingStats ? 0.5 : 1 }}>
                                <table className="table table-dark table-borderless align-middle mb-0 visitor-table">
                                    <thead>
                                        <tr className="text-muted fs-11 text-uppercase">
                                            <th>When</th>
                                            <th>Location</th>
                                            <th>Page / Section</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recent.map((row, i) => {
                                            const country = row.country || row.Country || '—';
                                            const city = row.city || row.City || '';
                                            const pageLabel = row.pageLabel || row.page || row.Page || '—';
                                            const sectionLabel = row.sectionLabel || row.section || row.Section;
                                            return (
                                                <tr key={i}>
                                                    <td className="text-muted fs-12 text-nowrap">{row.visitedAt}</td>
                                                    <td className="text-white fs-13">
                                                        {city ? `${city}, ` : ''}{country}
                                                        {(row.countryCode || row.CountryCode) && (
                                                            <span className="ms-1 text-muted fs-11">
                                                                ({row.countryCode || row.CountryCode})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="fs-13">
                                                        <span className="text-white">{pageLabel}</span>
                                                        {sectionLabel && (
                                                            <span className="d-block text-muted fs-11 mt-1">
                                                                <i className="fas fa-layer-group me-1"></i>
                                                                {sectionLabel}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .visitor-filter-box {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--admin-glass-border, rgba(255,255,255,0.08));
                }
                .visitor-filter-label {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #a78bfa;
                    margin-bottom: 8px;
                }
                .visitor-filter-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: #fff;
                    padding: 10px 14px;
                    font-size: 13px;
                }
                .visitor-filter-input:focus {
                    outline: none;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
                }
                .visitor-period-btn {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: transparent;
                    color: rgba(255, 255, 255, 0.65);
                    border-radius: 999px;
                    padding: 8px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .visitor-period-btn:hover {
                    border-color: #8b5cf6;
                    color: #fff;
                }
                .visitor-period-btn.active {
                    background: #8b5cf6;
                    border-color: #8b5cf6;
                    color: #fff;
                }
                .visitor-btn-apply {
                    background: #8b5cf6;
                    border: none;
                    color: #fff;
                    font-weight: 700;
                    border-radius: 10px;
                    padding: 8px 16px;
                }
                .visitor-btn-reset {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.75);
                    font-weight: 600;
                    border-radius: 10px;
                    padding: 8px 16px;
                }
                .visitor-chip {
                    font-size: 11px;
                    font-weight: 600;
                    padding: 6px 12px;
                    border-radius: 999px;
                    background: rgba(139, 92, 246, 0.15);
                    border: 1px solid rgba(139, 92, 246, 0.35);
                    color: #ddd6fe;
                }
                .visitor-stat-pill {
                    background: rgba(139, 92, 246, 0.12);
                    border: 1px solid rgba(139, 92, 246, 0.25);
                }
                .visitor-stat-pill.green {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.25);
                }
                .visitor-count-badge {
                    background: rgba(139, 92, 246, 0.2);
                    color: #c4b5fd;
                }
                .visitor-table thead th {
                    border-bottom: 1px solid var(--admin-glass-border);
                    padding-bottom: 10px;
                }
                .visitor-table tbody tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                }
                .visitor-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
                .fs-13 { font-size: 13px; }
            `}</style>
        </div>
    );
};

export default VisitorAnalyticsPanel;
