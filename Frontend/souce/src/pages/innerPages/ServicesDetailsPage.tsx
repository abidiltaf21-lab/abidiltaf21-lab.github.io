import { useParams } from 'react-router-dom';
import LayoutV2 from '../../components/Layouts/LayoutV2';
import ServicesDetailsContent from '../../components/services/ServicesDetailsContent';
import ServicesDetailsData from "../../assets/jsonData/services/ServicesDetailsData.json";

const ServicesDetailsPage = () => {
    const { id } = useParams();
    const service = ServicesDetailsData.find(s => s.id === parseInt(id || "1")) || ServicesDetailsData[0];

    return (
        <>
            <LayoutV2 breadCrumb={service.title} title={service.title}>
                <ServicesDetailsContent />
            </LayoutV2>
        </>
    );
};

export default ServicesDetailsPage;