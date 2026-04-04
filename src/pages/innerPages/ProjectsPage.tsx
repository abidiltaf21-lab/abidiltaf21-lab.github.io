import HeaderV2 from "../../components/header/HeaderV2";
import LayoutV2 from "../../components/Layouts/LayoutV2";
import PortfolioV1 from "../../components/portfolio/PortfolioV1";

const ProjectsPage = () => {
    return (
        <>
            <LayoutV2 breadCrumb='Projects' title='Digital marketing and analytical solution'>
                <HeaderV2 />
                <PortfolioV1 sectionClass='default-padding-bottom' hasTitle={false} />
            </LayoutV2>
        </>
    );
};

export default ProjectsPage;