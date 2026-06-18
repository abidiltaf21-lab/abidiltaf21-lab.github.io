import AboutV1 from "../../components/about/AboutV1";
import BannerV1 from "../../components/banner/BannerV1";
import BodyDark from "../../components/classes/BodyDark";
import ContactV1 from "../../components/contact/ContactV1";
import FactV1 from "../../components/fact/FactV1";
import LayoutV3 from "../../components/Layouts/LayoutV3";
import PortfolioV1 from "../../components/portfolio/PortfolioV1";
import PriceV1 from "../../components/price/PriceV1";
import PromoV1 from "../../components/promo/PromoV1";
import ServicesV1 from "../../components/services/ServicesV1";
import SEO from "../../components/utilities/SEO";

// New Premium Components
import TeamSection from "../../components/team/TeamSection";
import ShowreelSection from "../../components/portfolio/ShowreelSection";
import ReviewSystem from "../../components/testimonial/ReviewSystem";
import PricingCalculator from "../../components/price/PricingCalculator";

const Home = () => {
    return (
        <>
            <SEO 
                title="Motion Graphics & Digital Animation Portfolio" 
                description="Explore SmooothPixel, the portfolio of Abidullah Iltaf, showcasing cutting-edge 2D & 3D animations, motion graphics, and digital design projects."
            />
            <LayoutV3>
                <main className="main-content-area-light">
                    <BannerV1 />
                    
                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <ServicesV1 sectionClass="default-padding" hasTitle={true} />
                    </div>

                    <div className="section-wrapper animate-fade-in bg-gray" style={{ padding: '60px 0' }}>
                        <ShowreelSection />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <PortfolioV1 sectionClass="default-padding" hasTitle={true} />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <FactV1 />
                    </div>

                    <div className="section-wrapper animate-fade-in bg-gray" style={{ padding: '60px 0' }}>
                        <TeamSection />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <ReviewSystem />
                    </div>

                    <div className="section-wrapper animate-fade-in bg-gray" style={{ padding: '60px 0' }}>
                        <PricingCalculator />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <PriceV1 sectionClass="default-padding" hasTitle={true} />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <AboutV1 />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <ContactV1 sectionClass="bg-gray default-padding" />
                    </div>

                    <PromoV1 />
                </main>
                {/* BodyDark is only for dark mode, so we remove it here if it forces dark styles */}
            </LayoutV3>

            <style>{`
                .main-content-area-light {
                    background: var(--bg-gray-secondary);
                    color: var(--color-paragraph);
                    overflow-x: hidden;
                }
                .section-wrapper {
                    position: relative;
                    z-index: 1;
                }
                .bg-gray {
                    background: var(--bg-gray) !important;
                }
                .animate-fade-in {
                    opacity: 0;
                    animation: fadeInUpLite 0.8s ease forwards;
                }
                @keyframes fadeInUpLite {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default Home;