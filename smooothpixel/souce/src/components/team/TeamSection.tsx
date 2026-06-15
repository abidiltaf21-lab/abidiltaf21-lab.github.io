import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const FALLBACK: any[] = [
    { id: 1, name: "Abidullah Iltaf", role: "Creative Director", bio: "Visionary motion designer with 10+ years crafting cinematic brand stories.", image: "https://i.pravatar.cc/400?u=abidullah", skills: "After Effects,Cinema 4D,Motion Design", linkedin: "#", twitter: "#", instagram: "#" },
    { id: 2, name: "Ziaulhaq", role: "Lead Animator", bio: "Expert in 3D simulations, character rigging, and photorealistic rendering.", image: "https://i.pravatar.cc/400?u=ziaulhaq", skills: "Blender,Houdini,Nuke", linkedin: "#", twitter: "#", instagram: "#" },
    { id: 3, name: "Sarah Noor", role: "Visual Designer", bio: "Brand identity specialist with a passion for typography and UI motion.", image: "https://i.pravatar.cc/400?u=sarahnoor", skills: "Figma,Illustrator,Lottie", linkedin: "#", twitter: "#", instagram: "#" },
];

const getSkills = (m: any): string[] => {
    const raw = m.skills || m.Skills || "";
    if (Array.isArray(raw)) return raw.map((s: string) => s.trim()).filter(Boolean);
    return typeof raw === "string" ? raw.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
};

const TeamCard: React.FC<{ member: any; idx: number }> = ({ member, idx }) => {
    const { t } = useLanguage();
    const id      = member.id       || member.Id       || member._id;
    const name    = member.name     || member.Name     || "Team Member";
    const role    = member.role     || member.Role     || "Creative";
    const bio     = member.bio      || member.Bio      || member.description || "A key creative force in our team.";
    const image   = member.image    || member.Image    || `https://i.pravatar.cc/400?u=${encodeURIComponent(name)}`;
    const skills  = getSkills(member);
    
    const linkedin = member.linkedin || member.LinkedIn || "#";
    const twitter  = member.twitter  || member.Twitter  || "#";
    const instagram= member.instagram|| member.Instagram|| "#";

    return (
        <div className="col-xl-4 col-md-6 mb-4" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="modern-team-card-light">
                <div className="card-inner sp-card">
                    <div className="image-holder">
                        {image.match(/\.(mp4|webm|ogg|mov)$/i) || image.includes('video/upload') ? (
                            <video src={image} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <img src={image} alt={name} loading="lazy" />
                        )}
                        <div className="social-overlay">
                            {linkedin !== "#" && <a href={linkedin} className="social-icon"><i className="fab fa-linkedin-in"></i></a>}
                            {twitter !== "#" && <a href={twitter} className="social-icon"><i className="fab fa-twitter"></i></a>}
                            {instagram !== "#" && <a href={instagram} className="social-icon"><i className="fab fa-instagram"></i></a>}
                        </div>
                    </div>
                    
                    <div className="content-holder">
                        <div className="role-tag">{role}</div>
                        <h3 className="member-name">{name}</h3>
                        <p className="member-bio">{bio}</p>
                        
                        <div className="skills-stack mb-3">
                            {skills.slice(0,3).map((s, i) => (
                                <span key={i} className="skill-pill">{s}</span>
                            ))}
                        </div>

                        <div className="mt-auto pt-2">
                            <Link to={`/resume/${id}`} className="btn-resume-premium">
                                <i className="far fa-file-alt me-2"></i> {t('view_resume')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .modern-team-card-light {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .card-inner.sp-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .image-holder {
                    height: 200px; /* Reduced Image Height */
                    overflow: hidden;
                    position: relative;
                }
                .image-holder img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .modern-team-card-light:hover .image-holder img {
                    transform: scale(1.08);
                }
                .social-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(var(--color-primary-rgb), 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                .modern-team-card-light:hover .social-overlay {
                    opacity: 1;
                }
                .social-icon {
                    width: 38px;
                    height: 38px;
                    background: #fff;
                    color: var(--color-primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .social-icon:hover {
                    transform: scale(1.1);
                    background: #000;
                    color: #fff;
                }
                .content-holder {
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    text-align: center;
                }
                .member-bio {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 15px;
                }
                .skills-stack {
                    margin-top: auto;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .btn-resume-premium {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 20px;
                    background: transparent;
                    color: var(--color-primary, #ff5e14);
                    border: 1.5px solid var(--color-primary, #ff5e14);
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(255, 94, 20, 0.05);
                }
                .btn-resume-premium i {
                    transition: transform 0.3s ease;
                }
                .btn-resume-premium:hover {
                    background: var(--color-primary, #ff5e14);
                    color: #fff !important;
                    box-shadow: 0 8px 25px rgba(255, 94, 20, 0.3);
                    transform: translateY(-2px);
                }
                .btn-resume-premium:hover i {
                    transform: scale(1.1) rotate(5deg);
                }
            `}</style>
        </div>
    );
};

const TeamSection: React.FC = () => {
    const [members, setMembers] = useState<any[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        apiService.getTeam()
            .then(res => {
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setMembers(res.data);
                }
            })
            .catch(err => console.error("Team fetch error:", err));
    }, []);

    const list = members.length > 0 ? members : FALLBACK;

    return (
        <section id="team" className="team-area default-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <div className="site-heading">
                            <h4 className="sub-title">{t('team_sub')}</h4>
                            <h2 className="title">{t('team_title')}</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {list.map((m, i) => <TeamCard key={m.id || m._id || i} member={m} idx={i} />)}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
