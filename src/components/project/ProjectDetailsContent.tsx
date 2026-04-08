import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

interface DataType {
    id: number;
    title: string;
    videoUrl?: string;
    description: string;
    thumbFull?: any;
    details: {
        projectType: string;
        industry: string;
        challenge: string;
        solution: string;
        result: string;
        testimonial: string;
        skills: string;
        duration: string;
    }
}

const ProjectDetailsContent = ({ projectData }: { projectData: DataType }) => {
    const { thumbFull, details, title, videoUrl } = projectData

    // Image Scroll Animation 
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Background Move  */}
            <div className="banner-animation-zoom overflow-hidden">
                <div className="container">
                    <div className="image-move-bg">
                        <div className="animation-zoom-banner" id="js-hero"
                            style={{ width: `${100 + scroll / 18}%` }}
                        >
                            {videoUrl ? (
                                <div className="project-video-container" style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                    {videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ts') ? (
                                        <video
                                            src={videoUrl}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            controls
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <iframe
                                            src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&muted=1&background=1`} 
                                            title={title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        ></iframe>
                                    )}
                                </div>
                            ) : (
                                <img src={`/assets/img/projects/${thumbFull || '1-full.jpg'}`} alt={title} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-details-items default-padding">
                <div className="container">
                    <div className="top-info">
                        <div className="row">
                            <div className="col-xl-4 col-lg-5 left-info mb-xs-40 mb-md-50">
                                <div className="project-single-info">
                                    <h3 className="mb-30">Project Overview</h3>
                                    <ul>
                                        <li>
                                            Project Type <span>{details.projectType}</span>
                                        </li>
                                        <li>
                                            Industry <span>{details.industry}</span>
                                        </li>
                                        <li>
                                            Duration <span>{details.duration}</span>
                                        </li>
                                        <li>
                                            Skills/Tools <span>{details.skills}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="right-info col-xl-8 col-lg-7 pl-50 pl-md-15 pl-xs-15 mt-md-10">
                                <h2>About the Project</h2>
                                <p>{projectData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-details-items default-padding bg-gray">
                <div className="container">
                    <div className="item-grid-container">
                        <div className="single-grid">
                            <div className="item-grid-colum">
                                <div className="left-info">
                                    <h2>The Challenge</h2>
                                </div>
                                <div className="right-info">
                                    <p>{details.challenge}</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-grid">
                            <div className="item-grid-colum">
                                <div className="left-info">
                                    <h2>The Solution</h2>
                                </div>
                                <div className="right-info">
                                    <p>{details.solution}</p>
                                </div>
                            </div>
                        </div>
                        <div className="single-grid">
                            <div className="item-grid-colum">
                                <div className="left-info">
                                    <h2>The Result</h2>
                                </div>
                                <div className="right-info">
                                    <p>{details.result}</p>
                                    
                                    {details.testimonial !== "نه دی ذکر شوی" && (
                                        <div className="client-testimonial-box mt-40 p-30 rounded-20" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                                            <i className="fas fa-quote-left mb-20" style={{ fontSize: '30px', opacity: '0.5' }}></i>
                                            <h4 style={{ color: '#fff', fontStyle: 'italic' }}>"{details.testimonial}"</h4>
                                            <p className="mt-10 mb-0" style={{ opacity: '0.8' }}>— Client Feedback</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-pagination default-padding-bottom bg-gray">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="project-paginvation-items mt-xs--25 mt-md--25">
                                <div className="project-previous">
                                    <Link to="#">
                                        <div className="icon"><i className="fas fa-angle-double-left" /></div>
                                        <div className="nav-title"> Previous Post <h5>Discovery incommode</h5></div>
                                    </Link>
                                </div>
                                <div className="project-all">
                                    <Link to="#"><i className="fas fa-th-large" /></Link>
                                </div>
                                <div className="project-next">
                                    <Link to="#">
                                        <div className="nav-title">Next Post <h5>Discovery incommode</h5></div>
                                        <div className="icon"><i className="fas fa-angle-double-right" /></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailsContent;