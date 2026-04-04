import LayoutV2 from "../../components/Layouts/LayoutV2";
import ProjectDetailsContent from "../../components/project/ProjectDetailsContent";
import PromoV1 from "../../components/promo/PromoV1";
import PortfolioData from "../../assets/jsonData/portfolio/PortfolioData.json"
import { useParams } from "react-router-dom";

const ProjectDetailsPage = () => {

    const { id } = useParams()
    const data = PortfolioData.find(portfolio => portfolio.id === parseInt(id || '0'));

    return (
        <>
            <LayoutV2 breadCrumb='project-details' title='Digital marketing and analytical solution'>
                {data && <ProjectDetailsContent projectData={data} />}
                <PromoV1 />
            </LayoutV2>
        </>
    );
};

export default ProjectDetailsPage;