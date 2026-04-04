import { Route, Routes } from "react-router-dom";
import Home from "./pages/homePages/Home";
import ContactPage from "./pages/innerPages/ContactPage";
import PricingPage from "./pages/innerPages/PricingPage";
import HomeDark from "./pages/homePages/HomeDark";
import ProjectDetailsPage from "./pages/innerPages/ProjectDetailsPage";
import BlogWithSidebarPage from "./pages/blogPages/BlogWithSidebarPage";
import ResumePage from "./pages/innerPages/ResumePage";
import ServicePage from "./pages/innerPages/ServicePage";
import ServicesDetailsPage from "./pages/innerPages/ServicesDetailsPage";
import BlogSingleWithSidebarPage from "./pages/blogPages/BlogSingleWithSidebarPage";
import NotFoundPage from "./pages/innerPages/NotFoundPage";
import ProjectsPage from "./pages/innerPages/ProjectsPage";

const Routers = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} ></Route>
                <Route path="/home-dark" element={<HomeDark />} ></Route>
                <Route path="/contact" element={<ContactPage />} ></Route>
                <Route path="/pricing" element={<PricingPage />} ></Route>
                <Route path="/blog-with-sidebar" element={<BlogWithSidebarPage />} ></Route>
                <Route path="/blog-single-with-sidebar/:id" element={<BlogSingleWithSidebarPage />} ></Route>
                <Route path="/projects" element={<ProjectsPage />} ></Route>
                <Route path="/project-details/:id" element={<ProjectDetailsPage />} ></Route>
                <Route path="/resume" element={<ResumePage />} ></Route>
                <Route path="/service" element={<ServicePage />} ></Route>
                <Route path="/services-details/:id" element={<ServicesDetailsPage />} ></Route>
                <Route path="*" element={<NotFoundPage />} ></Route>
            </Routes>
        </>
    );
};

export default Routers;