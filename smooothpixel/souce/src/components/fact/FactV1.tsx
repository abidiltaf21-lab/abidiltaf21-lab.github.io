import CountUp from 'react-countup'
import ReactWOW from "react-wow"
import { useLanguage } from '../../context/useLanguage';

const FactV1 = () => {
    const { t } = useLanguage();
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
            <div id="stats" className="fun-factor-area default-padding overflow-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">{t('facts_sub')}</h4>
                                <h2 className="title">{t('facts_title')}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="fun-fact-style-two-items text-center">
                        {expertiseData.map((skill, index) => (
                            <ReactWOW animation="fadeInUp" delay={`${index * 100}ms`} key={index}>
                                <div className="funfact-style-two-item software-card sp-card">
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
        </>
    );
};

export default FactV1;