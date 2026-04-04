import { Link } from "react-router-dom";

const PromoV1 = () => {
    return (
        <>
            <div className="promot-box-area default-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 offset-xl-2">
                            <div className="promo-box-items text-center">
                                <h2>{`Hello👋i'm available for freelance work`}</h2>
                                <h4>For quick response: <a href="https://t.me/+4917622856810"><i className="fab fa-telegram" /></a></h4>
                                <div className="button mt-40">
                                    <Link className="btn-style-regular" to="/contact"><span>Hire Me Now </span> <i className="fas fa-arrow-right" /></Link>
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