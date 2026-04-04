import about3 from "/assets/img/about/3.jpg";
import shape12 from "/assets/img/shape/12.png";
import { Link } from "react-router-dom";

const FaqV1 = () => {
    return (
        <>
            <div className="faq-style-one-area default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="thumb-style-one">
                                <img src={about3} alt="Image Not Found" />
                                <div className="chat-card">
                                    <p>{`Can't find what your are loking for you?`}</p>
                                    <h5>I would like to chat with you</h5>
                                    <Link to="#" ><i className="fab fa-facebook-messenger" /></Link>
                                    <img src={shape12} alt="Image Not Found" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <div className="faq-style-one-items">
                                <h4 className="sub-title">Faq</h4>
                                <h2>Frequently Asked Questions</h2>
                                <div className="accordion mt-30" id="faqAccordion">
                                    <div className="accordion-item accordion-style-one">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                May i see your work samples?
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item accordion-style-one">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                What are your rates?
                                            </button>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item accordion-style-one">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                How do you prefer to communicate?
                                            </button>
                                        </h2>
                                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                            <div className="accordion-body">
                                                <p>
                                                    New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.
                                                </p>
                                            </div>
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

export default FaqV1;