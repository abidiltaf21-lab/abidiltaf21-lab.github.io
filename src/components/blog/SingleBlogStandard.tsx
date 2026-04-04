import { Link } from "react-router-dom";

interface DataType {
    id?: number;
    date?: string;
    author?: string;
    title?: string;
    text?: string;
    btnIcon?: string;
    thumb?: string;
}

const SingleBlogStandard = ({ blog }: { blog: DataType }) => {
    const { id, thumb, author, date, title, text, btnIcon } = blog

    return (
        <>
            <div className="blog-style-one item">
                <div className="thumb">
                    <Link to={`/blog-single-with-sidebar/${id}`}>
                        <img src={`/assets/img/blog/${thumb}`} alt="Image Not Found" />
                    </Link>
                </div>
                <div className="info">
                    <div className="meta">
                        <ul>
                            <li><Link to="#" >{author}</Link></li>
                            <li>{date}</li>
                        </ul>
                    </div>
                    <h2>
                        <Link to={`/blog-single-with-sidebar/${id}`}>{title}</Link>
                    </h2>
                    <p>{text}</p>
                    <Link to={`/blog-single-with-sidebar/${id}`} className="button-regular">
                        Continue Reading <i className={btnIcon}></i>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SingleBlogStandard;