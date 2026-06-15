import LayoutV2 from "../../components/Layouts/LayoutV2";
import ProjectDetailsContent from "../../components/project/ProjectDetailsContent";
import PromoV1 from "../../components/promo/PromoV1";
import { useProject } from "../../hooks/useProjects";
import { useParams } from "react-router-dom";

const ProjectDetailsPage = () => {

    const { id } = useParams()
    const { project, loading, error } = useProject(id || '0');

    if (loading) return <LayoutV2 breadCrumb='project-details' title='Loading...'><div className="p-50 text-center">Loading...</div></LayoutV2>;
    if (error) return <LayoutV2 breadCrumb='project-details' title='Error'><div className="p-50 text-center text-danger">Error: {error}</div></LayoutV2>;

    return (
        <>
            <LayoutV2 breadCrumb='project-details' title='Digital marketing and analytical solution'>
                {project && <ProjectDetailsContent projectData={project} />}
                <PromoV1 />
            </LayoutV2>
        </>
    );
};

export default ProjectDetailsPage;