import ContactV1 from "../../components/contact/ContactV1";
import LayoutV2 from "../../components/Layouts/LayoutV2";

const ContactPage = () => {
    return (
        <>
            <LayoutV2 breadCrumb='Contact' title='Let’s work together!'>
                <ContactV1 sectionClass='default-padding-bottom' />
            </LayoutV2>
        </>
    );
};

export default ContactPage;