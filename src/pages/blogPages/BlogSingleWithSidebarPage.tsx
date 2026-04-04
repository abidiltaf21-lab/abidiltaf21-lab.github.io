import { useParams } from "react-router-dom";
import BlogSingleWithSidebarContent from "../../components/blog/BlogSingleWithSidebarContent";
import LayoutV2 from "../../components/Layouts/LayoutV2";
import BlogData from "../../assets/jsonData/blog/BlogData.json";

const BlogSingleWithSidebarPage = () => {

    const { id } = useParams()
    const data = BlogData.find(blog => blog.id === parseInt(id || '0')); 

    return (
        <>
            <LayoutV2 breadCrumb='blog-single-with-sidebar' title='No Code Development Website Builder'>
                {data && <BlogSingleWithSidebarContent blogData={data} />}
            </LayoutV2>
        </>
    );
};

export default BlogSingleWithSidebarPage;