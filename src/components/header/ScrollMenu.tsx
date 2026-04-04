import { Link } from 'react-scroll';

interface DataType {
    closeMenu?: () => void;
}

const ScrollMenu: React.FC<DataType> = ({ closeMenu }) => {
    return (
        <>

            <li>
                <Link className="smooth-menu" to="portfolio" offset={-50} onClick={closeMenu}>Portfolio</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="resume" offset={-50} onClick={closeMenu}>Resume</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="pricing" offset={-50} onClick={closeMenu}>Pricing</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="about" offset={-50} onClick={closeMenu}>About</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="contact" offset={-50} onClick={closeMenu}>Contact</Link>
            </li>
        </>
    );
};

export default ScrollMenu;