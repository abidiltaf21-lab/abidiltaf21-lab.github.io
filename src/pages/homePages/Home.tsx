import AboutV1 from "../../components/about/AboutV1";
import BannerV1 from "../../components/banner/BannerV1";
import ContactV1 from "../../components/contact/ContactV1";
import FactV1 from "../../components/fact/FactV1";
import LayoutV1 from "../../components/Layouts/LayoutV1";
import PortfolioV1 from "../../components/portfolio/PortfolioV1";
import PriceV1 from "../../components/price/PriceV1";
import PromoV1 from "../../components/promo/PromoV1";
import ResumeV1 from "../../components/resume/ResumeV1";
import ServicesV1 from "../../components/services/ServicesV1";
import TestimonialV3 from "../../components/testimonial/TestimonialV3";
import TestimonialData from "../../assets/jsonData/testimonial/TestimonialData.json";


const Home = () => {
    return (
        <>
            <LayoutV1>
                <BannerV1 />
                <ServicesV1 sectionClass="default-padding" hasTitle={true} />
                <PortfolioV1 sectionClass="bg-gray default-padding" hasTitle={true} maxItems={6} />
                <FactV1 />
                <ResumeV1 sectionClass="bg-gray default-padding" />
                <TestimonialV3 testimonials={TestimonialData} />

                <PriceV1 sectionClass="default-padding bg-light" hasTitle={true} />
                <AboutV1 />
                <ContactV1 sectionClass="bg-gray default-padding" />

                <PromoV1 />
            </LayoutV1>
        </>
    );
};

export default Home;