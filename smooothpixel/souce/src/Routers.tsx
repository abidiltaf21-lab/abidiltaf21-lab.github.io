import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/homePages/Home";
import ContactPage from "./pages/innerPages/ContactPage";
import PricingPage from "./pages/innerPages/PricingPage";
import HomeDark from "./pages/homePages/HomeDark";
import ProjectDetailsPage from "./pages/innerPages/ProjectDetailsPage";
import BlogWithSidebarPage from "./pages/blogPages/BlogWithSidebarPage";

import MemberResumePage from "./pages/innerPages/MemberResumePage";
import ServicePage from "./pages/innerPages/ServicePage";
import ServicesDetailsPage from "./pages/innerPages/ServicesDetailsPage";
import BlogSingleWithSidebarPage from "./pages/blogPages/BlogSingleWithSidebarPage";
import NotFoundPage from "./pages/innerPages/NotFoundPage";
import ProjectsPage from "./pages/innerPages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

const Routers = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home-dark" element={<HomeDark />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/blog-with-sidebar" element={<BlogWithSidebarPage />} />
                <Route path="/blog-single-with-sidebar/:id" element={<BlogSingleWithSidebarPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/project-details/:id" element={<ProjectDetailsPage />} />

                <Route path="/resume/:id" element={<MemberResumePage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path="/services-details/:id" element={<ServicesDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default Routers;