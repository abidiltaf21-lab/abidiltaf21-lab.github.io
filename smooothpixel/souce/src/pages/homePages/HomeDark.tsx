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

// New Premium Components
import TeamSection from "../../components/team/TeamSection";
import ShowreelSection from "../../components/portfolio/ShowreelSection";
import ReviewSystem from "../../components/testimonial/ReviewSystem";
import PricingCalculator from "../../components/price/PricingCalculator";

const HomeDark = () => {
    return (
        <>
            <LayoutV3>
                <main className="main-content-area">
                    <BannerV1 />
                    
                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <ServicesV1 sectionClass="default-padding" hasTitle={true} />
                    </div>

                    <div className="section-wrapper animate-fade-in dark-bg-section" style={{ padding: '60px 0' }}>
                        <ShowreelSection />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <PortfolioV1 sectionClass="bg-gray default-padding" hasTitle={true} />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <FactV1 />
                    </div>

                    <div className="section-wrapper animate-fade-in dark-bg-section" style={{ padding: '60px 0' }}>
                        <TeamSection />
                    </div>

                    <div className="section-wrapper animate-fade-in" style={{ padding: '60px 0' }}>
                        <ReviewSystem />
                    </div>

                    <div className="section-wrapper animate-fade-in dark-bg-section" style={{ padding: '60px 0' }}>
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
                <BodyDark />
            </LayoutV3>

            <style>{`
                .main-content-area {
                    background: #000;
                    color: #fff;
                    overflow-x: hidden;
                }
                .section-wrapper {
                    position: relative;
                    z-index: 1;
                }
                .dark-bg-section {
                    background: #030712;
                }
                .bg-gray {
                    background: rgba(255,255,255,0.02) !important;
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

export default HomeDark;