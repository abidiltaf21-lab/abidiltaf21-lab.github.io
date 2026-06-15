import { Link } from 'react-scroll';

interface DataType {
    closeMenu?: () => void;
}

const ScrollMenu: React.FC<DataType> = ({ closeMenu }) => {
    return (
        <>
            <li>
                <Link className="smooth-menu" to="services" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Services</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="portfolio" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Portfolio</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="team" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Our Team</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="reviews" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Reviews</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="calculator" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Estimator</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="pricing" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Pricing</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="about" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>About</Link>
            </li>
            <li>
                <Link className="smooth-menu" to="contact" spy={true} smooth={true} duration={500} offset={-80} onClick={closeMenu}>Contact</Link>
            </li>
        </>
    );
};

export default ScrollMenu;