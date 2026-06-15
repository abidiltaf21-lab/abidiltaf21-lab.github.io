import LayoutV2 from "../../components/Layouts/LayoutV2";
import ResumeV1 from "../../components/resume/ResumeV1";import SEO from "../../components/utilities/SEO";

const ResumePage = () => {
    return (
        <>
            <SEO 
                title="About: Abidullah Iltaf – Freelance Motion Designer & Digital Artist" 
                description="Meet Abidullah Iltaf, a freelance motion designer specializing in 2D & 3D animation, motion graphics, and creative digital solutions."
            />
            <LayoutV2>
                <ResumeV1 sectionClass='default-padding-bottom pt-220 pt-md-200 pt-xs-140' />
            </LayoutV2>
        </>
    );
};

export default ResumePage;