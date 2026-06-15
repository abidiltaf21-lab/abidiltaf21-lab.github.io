import BlogV1Data from "../../assets/jsonData/blog/BlogV1Data.json"
import SingleBlogV1 from './SingleBlogV1';

const BlogV1 = () => {
    return (
        <>
            <div id="blog" className="blog-area home-blog default-padding bottom-less">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">Blog Insight</h4>
                                <h2 className="title">Valuable insights to change your startup idea</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {BlogV1Data.map(blog =>
                            <div className="col-xl-4 col-md-6 col-lg-6 mb-30" key={blog.id}>
                                <SingleBlogV1 blog={blog} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogV1;