import AboutV1 from "../../components/about/AboutV1";
import BannerV1 from "../../components/banner/BannerV1";

import BodyDark from "../../components/classes/BodyDark";
import ContactV1 from "../../components/contact/ContactV1";
import FactV1 from "../../components/fact/FactV1";
import LayoutV3 from "../../components/Layouts/LayoutV3";
import PortfolioV1 from "../../components/portfolio/PortfolioV1";
import PriceV1 from "../../components/price/PriceV1";
import PromoV1 from "../../components/promo/PromoV1";
import ResumeV1 from "../../components/resume/ResumeV1";
import ServicesV1 from "../../components/services/ServicesV1";
import TestimonialV3 from "../../components/testimonial/TestimonialV3";
import TestimonialData from "../../assets/jsonData/testimonial/TestimonialData.json";


const HomeDark = () => {
    return (
        <>
            <LayoutV3>
                <BannerV1 />
                <ServicesV1 sectionClass="default-padding" hasTitle={true} />
                <PortfolioV1 sectionClass="bg-gray default-padding" hasTitle={true} />
                <FactV1 />
                <ResumeV1 sectionClass="bg-gray default-padding" />
                <TestimonialV3 testimonials={TestimonialData} />

                <PriceV1 sectionClass="default-padding" hasTitle={true} />
                <AboutV1 />
                <ContactV1 sectionClass="bg-gray default-padding" />

                <PromoV1 />
                <BodyDark />
            </LayoutV3>
        </>
    );
};

export default HomeDark;