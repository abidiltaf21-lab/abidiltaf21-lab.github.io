import { useEffect, useState } from 'react';
import ReactWOW from 'react-wow';
import { apiService } from '../../services/api';

interface DataType {
    sectionClass?: string;
}

export interface ResumeEntryItem {
    id: number;
    type: 'experience' | 'education';
    title: string;
    subtitle: string;
    dateRange: string;
    description: string;
    sortOrder: number;
}

const FALLBACK_EXPERIENCE: ResumeEntryItem[] = [
    {
        id: 1,
        type: 'experience',
        title: 'Senior Motion Designer',
        subtitle: 'SmooothPixel (Self-Founded)',
        dateRange: '2015 – Present',
        description:
            'Leading creative strategy and production for high-end explainer videos and brand motion graphics. Collaborating with international clients to translate complex ideas into compelling visual journeys.',
        sortOrder: 1,
    },
    {
        id: 2,
        type: 'experience',
        title: 'Lead 2D Animator',
        subtitle: 'Creative Motion Studio',
        dateRange: '2010 – 2015',
        description:
            'Specialized in character animation and storyboard development. Managed a team of designers to deliver consistent, high-quality animation sequences for educational content and commercials.',
        sortOrder: 2,
    },
    {
        id: 3,
        type: 'experience',
        title: 'Junior Graphic Designer',
        subtitle: 'Visual Arts Agency',
        dateRange: '2008 – 2010',
        description:
            'Focused on vector illustrations, brand visuals, and assisting in the early stages of motion graphic productions. Developed a strong foundation in visual storytelling.',
        sortOrder: 3,
    },
];

const FALLBACK_EDUCATION: ResumeEntryItem[] = [
    {
        id: 4,
        type: 'education',
        title: 'B.A. Graphic Design & Visual Communication',
        subtitle: 'National College of Arts, Lahore',
        dateRange: '2004 – 2008',
        description:
            'Studied visual communication, typography, and brand systems. Built the design foundation that later shaped a career in motion graphics and animated storytelling.',
        sortOrder: 1,
    },
    {
        id: 5,
        type: 'education',
        title: 'Advanced Animation Certificate',
        subtitle: 'School of Motion',
        dateRange: '2011 – 2012',
        description:
            'Mastered professional animation principles, expression-driven workflows, and advanced visual effects techniques used in commercial motion design.',
        sortOrder: 2,
    },
    {
        id: 6,
        type: 'education',
        title: 'Cinema 4D & 3D Motion Specialization',
        subtitle: 'Greyscalegorilla (Online)',
        dateRange: '2016',
        description:
            'Focused on 3D product visualization, lighting, and integrating Cinema 4D pipelines into broadcast-quality motion graphics for corporate and tech clients.',
        sortOrder: 3,
    },
];

function normalizeEntry(raw: Record<string, unknown>): ResumeEntryItem {
    const typeRaw = String(raw.type ?? raw.Type ?? 'experience').toLowerCase();
    return {
        id: Number(raw.id ?? raw.Id ?? 0),
        type: typeRaw === 'education' ? 'education' : 'experience',
        title: String(raw.title ?? raw.Title ?? ''),
        subtitle: String(raw.subtitle ?? raw.Subtitle ?? ''),
        dateRange: String(raw.dateRange ?? raw.DateRange ?? ''),
        description: String(raw.description ?? raw.Description ?? ''),
        sortOrder: Number(raw.sortOrder ?? raw.SortOrder ?? 0),
    };
}

function sortEntries(items: ResumeEntryItem[]) {
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
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
}) => (
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
                No entries yet.
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

const ResumeV1 = ({ sectionClass }: DataType) => {
    const [experience, setExperience] = useState<ResumeEntryItem[]>(FALLBACK_EXPERIENCE);
    const [education, setEducation] = useState<ResumeEntryItem[]>(FALLBACK_EDUCATION);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const { data } = await apiService.getResumeEntries();
                if (cancelled || !Array.isArray(data) || data.length === 0) return;

                const normalized = data.map((row: Record<string, unknown>) => normalizeEntry(row));
                const exp = sortEntries(normalized.filter((e) => e.type === 'experience'));
                const edu = sortEntries(normalized.filter((e) => e.type === 'education'));

                if (exp.length) setExperience(exp);
                if (edu.length) setEducation(edu);
            } catch (err) {
                console.warn('Resume API unavailable, using fallback data.', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const showLoading = loading && experience === FALLBACK_EXPERIENCE;

    return (
        <div
            id="resume"
            className={`timeline-area sp-resume-area ${sectionClass ?? ''}`}
        >
            <div className="container">
                <div className="time-line-style-one-box">
                    {showLoading && (
                        <p className="sp-resume-loading">Loading resume…</p>
                    )}
                    <div className="row guttex-xl">
                        <div className="col-lg-6">
                            <ResumeColumn
                                title="My Expertise"
                                label="Work History"
                                icon="fas fa-briefcase"
                                items={experience}
                                baseDelay={0}
                            />
                        </div>
                        <div className="col-lg-6">
                            <ResumeColumn
                                title="Education"
                                label="Academic Background"
                                icon="fas fa-graduation-cap"
                                items={education}
                                baseDelay={120}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeV1;
