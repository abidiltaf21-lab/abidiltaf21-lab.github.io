import BlogData from '../../assets/jsonData/blog/BlogData.json'
import SingleRecentPost from './SingleRecentPost';

const RecentPostsWidget = () => {
    return (
        <>
            <div className="sidebar-item recent-post">
                <h4 className="title">Recent Post</h4>
                <ul>
                    {BlogData.map(blog =>
                        <li key={blog.id}>
                            <SingleRecentPost blog={blog} />
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default RecentPostsWidget;