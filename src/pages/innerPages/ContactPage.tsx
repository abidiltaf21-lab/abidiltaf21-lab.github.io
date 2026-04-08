import ContactV1 from "../../components/contact/ContactV1";
import LayoutV2 from "../../components/Layouts/LayoutV2";import SEO from "../../components/utilities/SEO";

const ContactPage = () => {
    return (
        <>
            <SEO 
                title="Contact SmooothPixel | Hire Motion Graphics Designer" 
                description="Get in touch with SmooothPixel to discuss your motion graphics and animation projects. Freelance services available worldwide."
            />
            <LayoutV2 breadCrumb='Contact' title='Let’s work together!'>
                <ContactV1 sectionClass='default-padding-bottom' />
            </LayoutV2>
        </>
    );
};

export default ContactPage;