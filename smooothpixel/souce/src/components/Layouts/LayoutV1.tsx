import HeaderV1 from '../header/HeaderV1';
import FooterV1 from '../footer/FooterV1';

interface LayoutProps {
    children?: React.ReactNode
}

const LayoutV1 = ({ children }: LayoutProps) => {
    return (
        <>
            <HeaderV1 />
            {children}
            <FooterV1 />
        </>
    );
};

export default LayoutV1;