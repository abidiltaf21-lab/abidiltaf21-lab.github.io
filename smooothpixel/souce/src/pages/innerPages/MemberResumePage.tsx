import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactWOW from 'react-wow';
import { apiService } from '../../services/api';
import LayoutV2 from '../../components/Layouts/LayoutV2';
import SEO from '../../components/utilities/SEO';
import { useLanguage } from '../../context/LanguageContext';

export interface ResumeEntryItem {
    id: number;
    type: 'experience' | 'education';
    title: string;
    subtitle: string;
    dateRange: string;
    description: string;
    sortOrder: number;
}

export interface TeamMemberType {
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
    skills: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    resumeEntries: ResumeEntryItem[];
}

function getSkills(skillsRaw: string): string[] {
    if (!skillsRaw) return [];
    return skillsRaw.split(',').map((s) => s.trim()).filter(Boolean);
}

const TimelineCard = ({ item, delay }: { item: ResumeEntryItem; delay: string }) => (
    <li className="sp-resume-track-item">
        <ReactWOW animation="fadeInUp" delay={delay}>
            <article className="sp-resume-card">
                <header className="sp-resume-card-head">
                    <div className="left">
                        <h4>{item.title}</h4>
                        <p>{item.subtitle}</p>
                    </div>
                    <span className="sp-resume-date">{item.dateRange}</span>
                </header>
                <p className="sp-resume-card-body">{item.description}</p>
            </article>
        </ReactWOW>
    </li>
);

const ResumeColumn = ({
    title,
    label,
    icon,
    items,
    baseDelay,
}: {
    title: string;
    label: string;
    icon: string;
    items: ResumeEntryItem[];
    baseDelay: number;
}) => {
    const { t } = useLanguage();
    return (
        <div className="sp-resume-column">
            <div className="sp-resume-col-header">
                <div className="sp-resume-col-icon">
                    <i className={icon}></i>
                </div>
                <h2>
                    <span>{label}</span>
                    {title}
                </h2>
            </div>
            {items.length === 0 ? (
                <p className="sp-resume-empty">
                    <span className="sp-resume-empty-icon">📋</span>
                    {t('no_timeline_entries')}
                </p>
            ) : (
                <ul className="sp-resume-track">
                    {items.map((item, index) => (
                        <TimelineCard
                            key={item.id || `${item.title}-${index}`}
                            item={item}
                            delay={`${baseDelay + index * 80}ms`}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

const MemberResumePage = () => {
    const { id } = useParams<{ id: string }>();
    const [member, setMember] = useState<TeamMemberType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (!id) return;

        let cancelled = false;
        apiService.getTeamMember(id)
            .then((res) => {
                if (cancelled) return;
                if (res.data) {
                    const raw = res.data;
                    const parsed: TeamMemberType = {
                        id: Number(raw.id ?? raw.Id ?? 0),
                        name: String(raw.name ?? raw.Name ?? ''),
                        role: String(raw.role ?? raw.Role ?? ''),
                        image: String(raw.image ?? raw.Image ?? ''),
                        bio: String(raw.bio ?? raw.Bio ?? ''),
                        skills: String(raw.skills ?? raw.Skills ?? ''),
                        twitter: raw.twitter ?? raw.Twitter ?? '',
                        linkedin: raw.linkedin ?? raw.Linkedin ?? '',
                        instagram: raw.instagram ?? raw.Instagram ?? '',
                        resumeEntries: Array.isArray(raw.resumeEntries || raw.ResumeEntries) 
                            ? (raw.resumeEntries || raw.ResumeEntries).map((e: any) => ({
                                id: Number(e.id ?? e.Id ?? 0),
                                type: String(e.type ?? e.Type ?? 'experience').toLowerCase() === 'education' ? 'education' : 'experience',
                                title: String(e.title ?? e.Title ?? ''),
                                subtitle: String(e.subtitle ?? e.Subtitle ?? ''),
                                dateRange: String(e.dateRange ?? e.DateRange ?? ''),
                                description: String(e.description ?? e.Description ?? ''),
                                sortOrder: Number(e.sortOrder ?? e.SortOrder ?? 0)
                            })).sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                            : []
                    };
                    setMember(parsed);
                } else {
                    setError('Talent profile not found.');
                }
            })
            .catch((err) => {
                console.error("Fetch member resume error:", err);
                setError('Unable to load profile at this time.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    const experiences = member ? member.resumeEntries.filter((e) => e.type === 'experience') : [];
    const educations = member ? member.resumeEntries.filter((e) => e.type === 'education') : [];

    const skillList = member ? getSkills(member.skills) : [];

    return (
        <>
            <SEO 
                title={`${member ? member.name : t('home')} – SmooothPixel Team`} 
                description={`View professional experiences, portfolio skills, and achievements of ${member ? member.name : 'our team members'}.`}
            />
            <LayoutV2>
                <div className="member-resume-detail-page pt-220 pt-md-200 pt-xs-140 pb-120">
                    <div className="container">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">{t('loading')}</span>
                                </div>
                                <p className="mt-3 text-muted">{t('loading_profile')}</p>
                            </div>
                        ) : error || !member ? (
                            <div className="text-center py-5">
                                <h3 className="text-danger mb-3">{t('profile_error')}</h3>
                                <p className="text-muted">{error || 'Profile could not be loaded.'}</p>
                                <Link to="/" className="btn btn-outline-primary mt-3">{t('back_to_home')}</Link>
                            </div>
                        ) : (
                            <>
                                {/* Profile Hero Banner */}
                                <div className="member-hero-card mb-80 p-5 rounded-4 position-relative overflow-hidden shadow-lg border border-secondary">
                                    <div className="row align-items-center g-5">
                                        <div className="col-lg-4 text-center text-lg-start">
                                            <div className="member-hero-img-container mx-auto">
                                                {member.image.match(/\.(mp4|webm|ogg|mov)$/i) || member.image.includes('video/upload') ? (
                                                    <video src={member.image} autoPlay loop muted playsInline className="rounded-4 object-fit-cover shadow" style={{ width: '100%', height: '100%', minHeight: '300px' }} />
                                                ) : (
                                                    <img src={member.image || 'https://via.placeholder.com/400'} alt={member.name} className="rounded-4 object-fit-cover shadow" style={{ width: '100%', height: '100%', minHeight: '300px' }} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="member-hero-details">
                                                <span className="badge bg-soft-primary px-3 py-2 fs-6 mb-3 text-uppercase tracking-wider fw-bold">
                                                    {member.role}
                                                </span>
                                                <h1 className="text-white fw-bold mb-3 font-display">{member.name}</h1>
                                                <p className="lead text-white-70 mb-4" style={{ lineHeight: 1.7 }}>{member.bio || t('creative_designer_bio')}</p>
                                                
                                                {skillList.length > 0 && (
                                                    <div className="member-skills-section mb-4">
                                                        <h6 className="text-white-50 text-uppercase tracking-wide small mb-3">{t('key_proficiencies')}</h6>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {skillList.map((skill, index) => (
                                                                <span key={index} className="badge bg-dark border border-secondary text-white-80 py-2 px-3 rounded-pill fs-7">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-3 border-top border-secondary">
                                                    <div className="d-flex gap-3">
                                                        {member.linkedin && member.linkedin !== '#' && (
                                                            <a href={member.linkedin} className="social-pill" target="_blank" rel="noopener noreferrer">
                                                                <i className="fab fa-linkedin-in me-2"></i> LinkedIn
                                                            </a>
                                                        )}
                                                        {member.twitter && member.twitter !== '#' && (
                                                            <a href={member.twitter} className="social-pill" target="_blank" rel="noopener noreferrer">
                                                                <i className="fab fa-twitter me-2"></i> Twitter
                                                            </a>
                                                        )}
                                                        {member.instagram && member.instagram !== '#' && (
                                                            <a href={member.instagram} className="social-pill" target="_blank" rel="noopener noreferrer">
                                                                <i className="fab fa-instagram me-2"></i> Instagram
                                                            </a>
                                                        )}
                                                    </div>
                                                    <Link to="/" className="back-team-link">
                                                        <i className="fas fa-arrow-left me-2"></i> {t('back_to_roster')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Experience and Education Timeline (From Screenshot) */}
                                <div className="timeline-area sp-resume-area">
                                    <div className="time-line-style-one-box">
                                        <div className="row guttex-xl">
                                            <div className="col-lg-6">
                                                <ResumeColumn title={t('my_expertise')} label={t('work_history')} icon="fas fa-briefcase" items={experiences} baseDelay={0} />
                                            </div>
                                            <div className="col-lg-6">
                                                <ResumeColumn title={t('education')} label={t('academic_background')} icon="fas fa-graduation-cap" items={educations} baseDelay={120} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </LayoutV2>

            <style>{`
                /* Hero card */
                .member-hero-card {
                    background: linear-gradient(145deg, rgba(15, 23, 42, 0.55), rgba(10, 14, 28, 0.45));
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05);
                }
                .member-hero-img-container {
                    max-width: 320px;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06);
                }
                .bg-soft-primary {
                    background: rgba(255, 94, 20, 0.15);
                    color: var(--color-primary, #ff5e14);
                    border: 1px solid rgba(255, 94, 20, 0.2);
                }
                .text-white-70 { color: rgba(255,255,255,0.7); }
                .text-white-80 { color: rgba(255,255,255,0.85); }
                /* Social pills */
                .social-pill {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 18px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #94a3b8;
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: all 0.3s ease;
                    gap: 6px;
                }
                .social-pill:hover {
                    background: var(--sp-gradient, linear-gradient(135deg,#f54200,#ffae00));
                    color: #fff !important;
                    border-color: transparent;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(245, 66, 0, 0.3);
                }
                /* Back link */
                .back-team-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none !important;
                    padding: 8px 16px;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 999px;
                    transition: all 0.3s ease;
                    letter-spacing: 0.02em;
                }
                .back-team-link:hover {
                    color: #fff !important;
                    border-color: var(--color-primary, #ff5e14);
                    background: rgba(255, 94, 20, 0.1);
                }
                .fs-7 { font-size: 0.8rem; }
                /* Timeline section spacing */
                .timeline-area.sp-resume-area {
                    padding-top: 60px;
                }
                @media (max-width: 767px) {
                    .timeline-area.sp-resume-area {
                        padding-top: 40px;
                    }
                    .member-resume-detail-page .row.guttex-xl .col-lg-6:last-child {
                        margin-top: 40px;
                    }
                }
            `}</style>
        </>
    );
};

export default MemberResumePage;
