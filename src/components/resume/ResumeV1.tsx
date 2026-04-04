import ReactWOW from "react-wow";

interface DataType {
    sectionClass?: string;
}

const ResumeV1 = ({ sectionClass }: DataType) => {
    return (
        <>
            <div id="resume" className={`timeline-area ${sectionClass ? sectionClass : ""}`}>
                <div className="container">
                    <div className="time-line-style-one-box">
                        <div className="row guttex-xl">
                            <div className="col-lg-6">
                                <h2>My Expertise</h2>
                                <div className="time-style-one-items">

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Senior Motion Designer</h4>
                                                    <p> SmooothPixel (Self-Founded) </p>
                                                </div>
                                                <div className="right">
                                                    <span>2015 - Present</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    Leading creative strategy and production for high-end explainer videos and
                                                    brand motion graphics. Collaborating with international clients to
                                                    translate complex ideas into compelling visual journeys.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Lead 2D Animator</h4>
                                                    <p> Creative Motion Studio </p>
                                                </div>
                                                <div className="right">
                                                    <span>2010 - 2015</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    Specialized in character animation and storyboard development.
                                                    Managed a team of designers to deliver consistent, high-quality
                                                    animation sequences for educational content and commercials.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Junior Graphic Designer</h4>
                                                    <p> Visual Arts Agency </p>
                                                </div>
                                                <div className="right">
                                                    <span>2008 - 2010</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    Focused on vector illustrations, brand visuals, and assisting in
                                                    the early stages of motion graphic productions. Developed a
                                                    strong foundation in visual storytelling.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>

                                </div>
                            </div>

                            <div className="col-lg-6">
                                <h2>Education Background</h2>
                                <div className="time-style-one-items">

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Programming Course</h4>
                                                    <p>
                                                        Harverd University
                                                    </p>
                                                </div>
                                                <div className="right">
                                                    <span>2006 - 2014</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    The education should be very interactual. Ut tincidunt est ac dolor aliquam
                                                    sodales. Phasellus sed mauris hendrerit, laoreet sem in, lobortis mauris
                                                    hendrerit ante. sectors of the economy or areas of culture sed mauris hendrerit,
                                                    laoreet smart software.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Advanced Animation Course</h4>
                                                    <p> School of Motion </p>
                                                </div>
                                                <div className="right">
                                                    <span>2011 - 2012</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    Mastered professional animation principles, expression-driven
                                                    workflows, and advanced visual effects techniques.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>

                                    {/* Single Item */}
                                    <ReactWOW animation="fadeInUp">
                                        <div className="timeline-style-one-item">
                                            <div className="timeline-header">
                                                <div className="left">
                                                    <h4>Web design course</h4>
                                                    <p>
                                                        University of California
                                                    </p>
                                                </div>
                                                <div className="right">
                                                    <span>2012 - 2015</span>
                                                </div>
                                            </div>
                                            <div className="timeline-body">
                                                <p>
                                                    The education should be very interactual. Ut tincidunt est ac dolor aliquam
                                                    sodales. Phasellus sed mauris hendrerit, laoreet sem in, lobortis mauris
                                                    hendrerit ante. sectors of the economy or areas of culture sed mauris hendrerit,
                                                    laoreet smart software.
                                                </p>
                                            </div>
                                        </div>
                                    </ReactWOW>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeV1;