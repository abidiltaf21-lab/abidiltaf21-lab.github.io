import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const PromoV1 = () => {
    const { t } = useLanguage();
    return (
        <>
            <div className="promot-box-area default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 offset-xl-2">
                            <div className="promo-box-items text-center">
                                <h2>{t('freelance_promo')}</h2>
                                <h4>{t('quick_response')} <a href="https://t.me/SmooothPixel" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram" style={{ marginRight: '6px' }} />@SmooothPixel</a></h4>
                                <div className="button mt-40">
                                    <Link className="btn-style-regular" to="/contact"><span>{t('hire_me')} </span> <i className="fas fa-arrow-right" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromoV1;