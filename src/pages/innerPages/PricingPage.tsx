import LayoutV2 from "../../components/Layouts/LayoutV2";
import PriceV1 from "../../components/price/PriceV1";

const PricingPage = () => {
    return (
        <>
            <LayoutV2 breadCrumb='Pricing' title='The best pricing plans to get your best'>
                <PriceV1 sectionClass='default-padding-bottom' />
            </LayoutV2>
        </>
    );
};

export default PricingPage;