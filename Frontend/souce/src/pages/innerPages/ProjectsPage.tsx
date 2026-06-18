import HeaderV2 from "../../components/header/HeaderV2";
import LayoutV2 from "../../components/Layouts/LayoutV2";
import PortfolioV1 from "../../components/portfolio/PortfolioV1";import SEO from "../../components/utilities/SEO";

const ProjectsPage = () => {
    return (
        <>
            <SEO 
                title="Portfolio: 2D & 3D Animation Portfolio | SmooothPixel" 
                description="Browse SmooothPixel's diverse animation projects, including 2D explainer videos, 3D motion graphics, and digital art showcases."
            />
            <LayoutV2 breadCrumb='Projects' title='Digital marketing and analytical solution'>
                <HeaderV2 />
                <PortfolioV1 sectionClass='default-padding-bottom' hasTitle={false} />
            </LayoutV2>
        </>
    );
};

export default ProjectsPage;