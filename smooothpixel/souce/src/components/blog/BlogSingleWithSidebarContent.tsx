import SearchWidget from '../widgets/SearchWidget';
import RecentPostsWidget from '../widgets/RecentPostsWidget';
import CategoryWidget from '../widgets/CategoryWidget';
import GalleryWidget from '../widgets/GalleryWidget';
import ArchiveWidget from '../widgets/ArchiveWidget';
import FollowWidget from '../widgets/FollowWidget';
import TagsWidget from '../widgets/TagsWidget';
import BlogForm from '../form/BlogForm';
import { Link } from "react-router-dom";
import SocialShareV2 from '../utilities/SocialShareV2';
import handleSmoothScroll from '../utilities/handleSmoothScroll';
import team11 from "/assets/img/team/11.jpg"
import team9 from "/assets/img/team/9.jpg"
import team10 from "/assets/img/team/10.jpg"

interface DataType {
    author?: string;
    thumb?: string;
}

const BlogSingleWithSidebarContent = ({ blogData }: { blogData: DataType }) => {
    const { thumb, author } = blogData

    return (
        <>
            <div className="blog-area single full-blog right-sidebar full-blog default-padding-bottom">
                <div className="container">
                    <div className="blog-items">
                        <div className="row">
                            <div className="blog-content col-xl-8 col-lg-7 col-md-12 pr-35 pr-md-15 pl-md-15 pr-xs-15 pl-xs-15">
                                <div className="blog-style-one item">
                                    <div className="blog-item-box">
                                        <div className="thumb">
                                            <img src={`/assets/img/blog/${thumb}`} alt="Thumb" />
                                        </div>
                                        <div className="info">
                                            <div className="meta">
                                                <ul>
                                                    <li>
                                                        <i className="fas fa-user" /> <Link to="#">{author}</Link>
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-calendar-alt" /> 25 April, 2023
                                                    </li>
                                                </ul>
                                            </div>
                                            <p>
                                                Give lady of they such they sure it. Me contained explained my education. Vulgar as hearts by garret. Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence northward as difficult preserved daughters. Continued at up to zealously necessary breakfast. Surrounded sir motionless she end literature. Gay direction neglected but supported yet her.
                                            </p>
                                            <p>
                                                New had happen unable uneasy. Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                            </p>
                                            <blockquote>
                                                Celebrated share of first to worse. Weddings and any opinions suitable smallest nay. Houses or months settle remove ladies appear. Engrossed suffering supposing he recommend do eagerness.
                                            </blockquote>
                                            <p>
                                                Drawings can followed improved out sociable not. Earnestly so do instantly pretended. See general few civilly amiable pleased account carried. Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past. Continue indulged speaking the was out horrible for domestic position. Seeing rather her you not esteem men settle genius excuse. Deal say over you age from. Comparison new ham melancholy son themselves.
                                            </p>
                                            <h3>Conduct replied off led whether?</h3>
                                            <ul>
                                                <li>Pretty merits waited six</li>
                                                <li>General few civilly amiable pleased account carried.</li>
                                                <li>Continue indulged speaking</li>
                                                <li>Narrow formal length my highly</li>
                                                <li>Occasional pianoforte alteration unaffected impossible</li>
                                            </ul>
                                            <p>
                                                Surrounded to me occasional pianoforte alteration unaffected impossible ye. For saw half than cold. Pretty merits waited six talked pulled you. Conduct replied off led whether any shortly why arrived adapted. Numerous ladyship so raillery humoured goodness received an. So narrow formal length my highly longer afford oh. Tall neat he make or at dull ye. Lorem ipsum dolor, sit amet consectetur adipisicing, elit. Iure, laudantium, tempore. Autem dolore repellat, omnis quam? Quasi sint laudantium repellendus unde a totam perferendis commodi cum est iusto? Minima, laborum.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Author */}
                                <div className="post-author">
                                    <div className="thumb">
                                        <img src={team11} alt="Thumb" />
                                    </div>
                                    <div className="info">
                                        <h4><Link to="/blog-with-sidebar">Md Sohag</Link></h4>
                                        <p>
                                            Grursus mal suada faci lisis Lorem ipsum dolarorit more ametion consectetur elit. Vesti at bulum nec at odio aea the dumm ipsumm ipsum that dolocons rsus mal suada and fadolorit to the consectetur elit. All the Lorem Ipsum generators on the Internet tend.
                                        </p>
                                    </div>
                                </div>

                                {/* Post Tags Share */}
                                <div className="post-tags share">
                                    <div className="tags">
                                        <h4>Tags: </h4>
                                        <Link to="#" >Algorithm</Link>
                                        <Link to="#" >Data science</Link>
                                    </div>
                                    <div className="social">
                                        <h4>Share:</h4>
                                        <ul>
                                            <SocialShareV2 />
                                        </ul>
                                    </div>
                                </div>

                                {/* Start Post Pagination */}
                                <div className="post-pagi-area">
                                    <div className="post-previous">
                                        <Link to="#" onClick={handleSmoothScroll}>
                                            <div className="icon"><i className="fas fa-angle-double-left"></i></div>
                                            <div className="nav-title"> Previous Post <h5>Discovery incommode</h5></div>
                                        </Link>
                                    </div>
                                    <div className="post-next">
                                        <Link to="#" onClick={handleSmoothScroll}>
                                            <div className="nav-title">Next Post <h5>Discovery incommode</h5></div>
                                            <div className="icon"><i className="fas fa-angle-double-right"></i></div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Start Blog Comment */}
                                <div className="blog-comments">
                                    <div className="comments-area">
                                        <div className="comments-title">
                                            <h3>3 Comments On “Providing Top Quality Cleaning Related Services Charms.”</h3>
                                            <div className="comments-list">
                                                <div className="comment-item">
                                                    <div className="avatar">
                                                        <img src={team9} alt="Author" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="title">
                                                            <h5>Bubhan Prova <span className="reply"><Link to="#"><i className="fas fa-reply" /> Reply</Link></span></h5>
                                                            <span>28 Feb, 2022</span>
                                                        </div>
                                                        <p>
                                                            Delivered ye sportsmen zealously arranging frankness estimable as. Nay any article enabled musical shyness yet sixteen yet blushes. Entire its the did figure wonder off. sportsmen zealously arranging to the main pint. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="comment-item reply">
                                                    <div className="avatar">
                                                        <img src={team10} alt="Author" />
                                                    </div>
                                                    <div className="content">
                                                        <div className="title">
                                                            <h5>Mickel Jones <span className="reply"><Link to="#"><i className="fas fa-reply" /> Reply</Link></span></h5>
                                                            <span>15 Mar, 2022</span>
                                                        </div>
                                                        <p>
                                                            Delivered ye sportsmen zealously arranging frankness estimable as. Nay any article enabled musical shyness yet sixteen yet blushes. Entire its the did figure wonder off. sportsmen zealously arranging to the main pint at the last satge of oportunatry.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="comments-form">
                                            <div className="title">
                                                <h3>Leave a comments</h3>
                                            </div>
                                            <BlogForm />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar col-xl-4 col-lg-5 col-md-12 mt-md-50 mt-xs-50">
                                <aside>
                                    <SearchWidget />
                                    <RecentPostsWidget />
                                    <CategoryWidget />
                                    <GalleryWidget />
                                    <ArchiveWidget />
                                    <FollowWidget />
                                    <TagsWidget />
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogSingleWithSidebarContent;