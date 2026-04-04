import { Link } from "react-router-dom";

interface DataType {
    breadCrumb?: string;
    title?: string;
}

const BreadCrumb = ({ breadCrumb, title }: DataType) => {
    return (
        <>
            <div className="breadcrumb-area text-center">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <h1>{title ? title : "Error Page"}</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li><Link to="#"><i className="fas fa-home" /> Home</Link></li>
                                    <li className="active">{breadCrumb ? breadCrumb : "not-found"}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BreadCrumb;