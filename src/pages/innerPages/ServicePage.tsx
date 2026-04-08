import LayoutV2 from "../../components/Layouts/LayoutV2";
import ServicesV1 from "../../components/services/ServicesV1";import SEO from "../../components/utilities/SEO";

const ServicePage = () => {
    return (
        <>
            <SEO 
                title="Services: Motion Graphics, Explainer Videos & Digital Design Services" 
                description="SmooothPixel offers professional motion graphics, explainer videos, and digital design services for businesses and creatives worldwide."
            />
            <LayoutV2 breadCrumb='Service' title='Professional service websites design'>
                <ServicesV1 sectionClass='default-padding-bottom' />
            </LayoutV2>
        </>
    );
};

export default ServicePage;