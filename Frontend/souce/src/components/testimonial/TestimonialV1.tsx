import shape10 from "/assets/img/shape/10.png"
import partner9 from "/assets/img/partner/9.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination, EffectFade } from 'swiper/modules';

interface TestimonialItem {
    name: string;
    role: string;
    text: string;
    image: string;
}

interface DataType {
    sectionClass?: string;
    testimonials?: TestimonialItem[];
}

const TestimonialV1 = ({ sectionClass, testimonials }: DataType) => {

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
                                    pagination={{
                                        el: '.swiper-pagination',
                                        type: 'bullets',
                                        clickable: true,
                                    }}
                                    navigation={{
                                        nextEl: ".swiper-button-next",
                                        prevEl: ".swiper-button-prev"
                                    }}
                                >
                                    <div className="swiper-wrapper">
                                        {testimonials && testimonials.length > 0 ? (
                                            testimonials.map((item, index) => (
                                                <SwiperSlide className="swiper-slide" key={index}>
                                                    <div className="testimonial-style-one">
                                                        <div className="item">
                                                            <div className="thumb">
                                                                <div className="inner">
                                                                    <img src={item.image} alt="Image Not Found" />
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
                                                                        <img src={partner9} alt="Image Not Found" />
                                                                        <p>4.9/ 60 Reviews</p>
                                                                    </div>
                                                                </div>
                                                                <p>{`"${item.text}"`}</p>
                                                                <div className="tm-footer">
                                                                    <div className="provider">
                                                                        <h4>{item.name}</h4>
                                                                        <span>{item.role}</span>
                                                                    </div>
                                                                    <span>0{index + 1}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            <>
                                                {/* Fallback to original content or empty */}
                                            </>
                                        )}
                                    </div>
                                </Swiper>
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

export default TestimonialV1;