import { Link } from "react-router-dom";
import ReactWOW from "react-wow";

interface DataType {
    id?: number;
    thumb?: string;
    tag?: string;
    date?: string;
    title?: string;
    animationDelay?: string;
}

const SingleBlogV1 = ({ blog }: { blog: DataType }) => {
    const { id, thumb, date, title, animationDelay, tag } = blog

    return (
        <>
            <ReactWOW animation="fadeInUp" delay={animationDelay} >
                <div className="home-blog-style-one-item">
                    <div className="home-blog-thumb">
                        <Link to={`/blog-single-with-sidebar/${id}`}>
                            <img src={`/assets/img/blog/${thumb}`} alt="Image not Found" />
                        </Link>
                    </div>
                    <div className="content">
                        <ul className="home-blog-meta">
                            <li>
                                <Link to="#">{tag}</Link>
                            </li>
                            <li>{date}</li>
                        </ul>
                        <div className="info">
                            <h4 className="blog-title">
                                <Link to={`/blog-single-with-sidebar/${id}`}>{title}</Link>
                            </h4>
                            <Link to={`/blog-single-with-sidebar/${id}`} className="btn-read-more">Read More <i className="fas fa-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </ReactWOW>
        </>
    );
};

export default SingleBlogV1;