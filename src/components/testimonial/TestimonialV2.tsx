import shape10 from "/assets/img/shape/10.png"
import illustration2 from "/assets/img/illustration/2.png"
import partner9Light from "/assets/img/partner/9-light.png"
import illustration3 from "/assets/img/illustration/3.png"
import illustration4 from "/assets/img/illustration/4.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, EffectFade } from 'swiper/modules';

interface DataType {
    sectionClass?: string;
}

const TestimonialV2 = ({ sectionClass }: DataType) => {

    return (
        <>
            <div className={`testimonial-style-one-area default-padding ${sectionClass ? sectionClass : ""}`}>
                <div className="shape-left-top">
                    <img src={shape10} alt="Image Not Found" />
                </div>
                <div className="container">
                    <div className="heading-left">
                        <div className="row">
                            <div className="col-xl-6">
                                <h4 className="sub-title">Testimonials</h4>
                                <h2 className="title">Clients Testimonials</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="testimonial-style-one-items">
                                <Swiper
                                    modules={[Keyboard, Autoplay, Pagination, EffectFade]}
                                    direction={"horizontal"}
                                    loop={true}
                                    autoplay={true}
                                    // pagination
                                    pagination={{
                                        el: '.swiper-pagination',
                                        type: 'bullets',
                                        clickable: true,
                                    }}
                                    // Navigation arrows
                                    navigation={{
                                        nextEl: ".swiper-button-next",
                                        prevEl: ".swiper-button-prev"
                                    }}
                                >
                                    <div className="swiper-wrapper">
                                        {/* Single item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-one">
                                                <div className="item">
                                                    <div className="thumb">
                                                        <div className="inner">
                                                            <img src={illustration2} alt="Image Not Found" />
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        <div className="tm-review">
                                                            <div className="top">
                                                                <h5>Reviews On</h5>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </div>
                                                            <div className="bottom">
                                                                <img src={partner9Light} alt="Image Not Found" />
                                                                <p>4.9/ 60 Reviews</p>
                                                            </div>
                                                        </div>
                                                        <p>
                                                            {`"Thanks to your web agency team for their professional work. The
                                                            website they created for my business exceeded my expectations, and
                                                            my clients have given positive feedback about its design and
                                                            user-friendliness."`}
                                                        </p>
                                                        <div className="tm-footer">
                                                            <div className="provider">
                                                                <h4>Brooklyn Simmons</h4>
                                                                <span>UI/UX DESIGNER</span>
                                                            </div>
                                                            <span>01</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                        {/* Single item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-one">
                                                <div className="item">
                                                    <div className="thumb">
                                                        <div className="inner">
                                                            <img src={illustration3} alt="Image Not Found" />
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        <div className="tm-review">
                                                            <div className="top">
                                                                <h5>Reviews On</h5>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </div>
                                                            <div className="bottom">
                                                                <img src={partner9Light} alt="Image Not Found" />
                                                                <p>4.9/ 60 Reviews</p>
                                                            </div>
                                                        </div>
                                                        <p>
                                                            {`"Thanks to your web agency team for their professional work. The
                                                            website they created for my business exceeded my expectations, and
                                                            my clients have given positive feedback about its design and
                                                            user-friendliness."`}
                                                        </p>
                                                        <div className="tm-footer">
                                                            <div className="provider">
                                                                <h4>Brooklyn Simmons</h4>
                                                                <span>UI/UX DESIGNER</span>
                                                            </div>
                                                            <span>02</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                        {/* Single item */}
                                        <SwiperSlide className="swiper-slide">
                                            <div className="testimonial-style-one">
                                                <div className="item">
                                                    <div className="thumb">
                                                        <div className="inner">
                                                            <img src={illustration4} alt="Image Not Found" />
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        <div className="tm-review">
                                                            <div className="top">
                                                                <h5>Reviews On</h5>
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                                <i className="fas fa-star" />
                                                            </div>
                                                            <div className="bottom">
                                                                <img src={partner9Light} alt="Image Not Found" />
                                                                <p>4.9/ 60 Reviews</p>
                                                            </div>
                                                        </div>
                                                        <p>
                                                            {`"Thanks to your web agency team for their professional work. The
                                                            website they created for my business exceeded my expectations, and
                                                            my clients have given positive feedback about its design and
                                                            user-friendliness."`}
                                                        </p>
                                                        <div className="tm-footer">
                                                            <div className="provider">
                                                                <h4>Brooklyn Simmons</h4>
                                                                <span>UI/UX DESIGNER</span>
                                                            </div>
                                                            <span>03</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </div>
                                </Swiper>
                                {/* Navigation */}
                                <div className="testimonial-pagination">
                                    <div className="swiper-pagination" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialV2;