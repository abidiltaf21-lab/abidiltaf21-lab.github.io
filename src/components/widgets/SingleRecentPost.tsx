import { Link } from "react-router-dom";

interface DataType {
    id?: number;
    thumb?: string;
    date?: string;
    title: string;
}

const SingleRecentPost = ({ blog }: { blog: DataType }) => {
    const { id, thumb, title, date } = blog

    const truncateString = (str: string): string => {
        if (str.length <= 30) {
            return str;
        }
        return `${str.slice(0, 35)} ...`;
    };

    const truncatedTitle = truncateString(title);

    return (
        <>
            <div className="thumb">
                <Link to={`/blog-single-with-sidebar/${id}`}>
                    <img src={`/assets/img/blog/${thumb}`} alt="Thumb" />
                </Link>
            </div>
            <div className="info">
                <div className="meta-title">
                    <span className="post-date">{date}</span>
                </div>
                <Link to={`/blog-single-with-sidebar/${id}`}>{truncatedTitle}</Link>
            </div>
        </>
    );
};

export default SingleRecentPost;