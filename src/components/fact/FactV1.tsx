import CountUp from 'react-countup'
import ReactWOW from "react-wow"

const FactV1 = () => {
    // Array of motion graphics expertise with Font Awesome icons
    const expertiseData = [
        { name: "After Effects", percent: 100, icon: "fas fa-magic" },
        { name: "Photoshop", percent: 100, icon: "fas fa-image" },
        { name: "Illustrator", percent: 99, icon: "fas fa-bezier-curve" },
        { name: "Blender", percent: 98, icon: "fas fa-cube" },
        { name: "Cinema 4D", percent: 97, icon: "fas fa-cubes" },
        { name: "Premiere Pro", percent: 95, icon: "fas fa-film" },
        { name: "DaVinci Resolve", percent: 94, icon: "fas fa-eye-dropper" },
        { name: "Nuke", percent: 93, icon: "fas fa-atom" },
        { name: "Maya", percent: 92, icon: "fas fa-project-diagram" },
        { name: "ZBrush", percent: 91, icon: "fas fa-palette" }
    ].sort((a, b) => b.percent - a.percent);

    return (
        <>
            <div className="fun-factor-area default-padding overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Tools & Software</h4>
                                <h2 className="title">Software We Master</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="fun-fact-style-two-items text-center">
                        {expertiseData.map((skill, index) => (
                            <ReactWOW animation="fadeInUp" delay={`${index * 100}ms`} key={index}>
                                <div className="funfact-style-two-item software-card">
                                    <div className="icon">
                                        <i className={skill.icon}></i>
                                    </div>
                                    <div className="fun-fact">
                                        <div className="counter">
                                            <div className="timer"><CountUp end={skill.percent} enableScrollSpy={true} /></div>
                                            <div className="operator">%</div>
                                        </div>
                                        <span className="medium">{skill.name}</span>
                                    </div>
                                </div>
                            </ReactWOW>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .software-card {
                    background: #fff;
                    padding: 30px 20px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    transition: all 0.4s ease;
                    border: 1px solid rgba(0,0,0,0.02);
                    height: 100%;
                }
                .bg-dark .software-card {
                    background: #1a1a1a;
                    border-color: rgba(255,255,255,0.05);
                }
                .software-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 40px rgba(var(--color-primary-rgb), 0.12);
                    border-color: var(--color-primary);
                }
                .software-card .icon {
                    margin-bottom: 20px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .software-card .icon i {
                    font-size: 45px;
                    background: var(--color-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .fun-fact .counter {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .fun-fact .timer {
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--color-primary);
                }
                .fun-fact .operator {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-left: 2px;
                }
                .fun-fact .medium {
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--color-heading);
                }
                .bg-dark .fun-fact .medium {
                    color: var(--white);
                }
            `}</style>
        </>
    );
};

export default FactV1;