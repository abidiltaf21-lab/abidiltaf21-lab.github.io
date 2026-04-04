import { Link } from "react-router-dom";
import SmooothPixelLogo from "../logo/SmooothPixelLogo";

const FooterV1 = () => {
    return (
        <>
            <footer className="default-padding bg-cover" style={{ backgroundImage: 'url(assets/img/shape/1.jpg)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="footer-items text-center">
                                <Link to="/" className="footer-logot">
                                    <SmooothPixelLogo light={true} />
                                </Link>
                                <ul className="foter-menu">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/service">Services</Link></li>
                                    <li><Link to="/projects/2">Portfolio</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                                <p>Copyright  &copy; {(new Date().getFullYear())} Smooothpixel. All Rights Reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV1;