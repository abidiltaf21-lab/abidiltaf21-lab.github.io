import { Link } from "react-router-dom";
import SmooothPixelLogo from "../logo/SmooothPixelLogo";
import { useLanguage } from "../../context/LanguageContext";

const FooterV1 = () => {
    const { t } = useLanguage();

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
                                    <li><Link to="/">{t('home')}</Link></li>
                                    <li><Link to="/service">{t('services')}</Link></li>
                                    <li><Link to="/projects">{t('portfolio')}</Link></li>
                                    <li><Link to="/contact">{t('contact')}</Link></li>
                                </ul>
                                <p>Copyright &copy; {(new Date().getFullYear())} Smooothpixel. {t('copyright')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV1;