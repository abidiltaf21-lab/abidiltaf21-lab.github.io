import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Pagination } from 'swiper/modules';

interface TestimonialItem {
    name: string;
    role: string;
    text: string;
    image: string;
    link: string;
}

interface DataType {
    sectionClass?: string;
    testimonials: TestimonialItem[];
}

const TestimonialV3 = ({ sectionClass, testimonials }: DataType) => {
    return (
        <div id="testimonials" className={`testimonial-style-three-area default-padding overflow-hidden ${sectionClass ? sectionClass : ""}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <div className="site-heading text-center">
                            <h4 className="sub-title">Testimonials</h4>
                            <h2 className="title">Clients Feedback</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <Swiper
                            modules={[Keyboard, Autoplay, Pagination]}
                            freeMode={false}
                            grabCursor={true}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            loop={true}
                            keyboard={{ enabled: true }}
                            pagination={{
                                el: '.testimonial-swiper-pagination',
                                clickable: true,
                            }}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 30 },
                                768: { slidesPerView: 2, spaceBetween: 30 },
                                992: { slidesPerView: 3, spaceBetween: 30 },
                                1200: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                            className="testimonial-carousel"
                        >
                            {testimonials.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="testimonial-style-three-item">
                                        <div className="info">
                                            <div className="thumb">
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    <img src={item.image} alt={item.name} />
                                                </a>
                                            </div>
                                            <div className="provider">
                                                <div className="rating">
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                </div>
                                                <h4>{item.name}</h4>
                                                <span>{item.role}</span>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <p>{`"${item.text}"`}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Pagination Dots */}
                        <div className="testimonial-pagination-wrapper text-center mt-50">
                            <div className="testimonial-swiper-pagination swiper-pagination-style-two" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialV3;
