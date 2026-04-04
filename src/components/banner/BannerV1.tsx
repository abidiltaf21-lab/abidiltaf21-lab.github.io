import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import '../../assets/css/HeroParticles.css';
import { useEffect, useState } from 'react';

const BannerV1 = () => {

    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const particleCount = 20;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100 + 100}%`,
            size: `${Math.random() * 8 + 4}px`,
            duration: `${Math.random() * 15 + 10}s`,
            delay: `${Math.random() * 10}s`,
        }));
        setParticles(newParticles);
    }, []);

    const textLines = [
        '<b className="">Explainer Videos</b>',
        '<b className="">Whiteboard Animation</b>',
        '<b className="">Product Animation</b>',
        '<b className="">App Explainer</b>',
        '<b className="">App Promo</b>',
        '<b className="">Logo Animation</b>',
        '<b className="">Social Media Videos</b>'
    ]

    return (
        <>
            <div className="banner-style-one-area bg-gray overflow-hidden relative">
                <div className="particles-container">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                animationDuration: p.duration,
                                animationDelay: p.delay
                            }}
                        />
                    ))}
                </div>
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-10 text-center">
                            <div className="banner-style-one-items">
                                <div className="info">
                                    <h1>From Simple Idea to Captivating Video</h1>
                                    <h2>
                                        <span className="header-caption" id="page-top">
                                            <span className="cd-headline clip is-full-width">
                                                <span className="cd-words-wrapper">
                                                    <ReactTyped
                                                        strings={textLines} typeSpeed={35} backSpeed={35} backDelay={2000} loop>
                                                    </ReactTyped>
                                                </span>
                                            </span>
                                        </span>
                                    </h2>
                                    <p>
                                        15 years of bringing ideas to life. I help brands tell unforgettable stories through motion graphics, 2D animation, and explainer videos. Every frame is crafted with purpose—turning complex messages into simple, visual journeys that engage, educate, and inspire.
                                    </p>
                                    <div className="flex-social mt-40 justify-content-center">
                                        <div className="button">
                                            <Link className="btn-style-regular" to="/contact"><span>Hire Me Now</span> <i className="fas fa-arrow-right" /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BannerV1;