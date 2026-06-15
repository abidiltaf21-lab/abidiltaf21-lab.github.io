import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// ── Lazy load every page so only the current page's JS is downloaded ──
const Home                   = lazy(() => import("./pages/homePages/Home"));
const HomeDark               = lazy(() => import("./pages/homePages/HomeDark"));
const ContactPage            = lazy(() => import("./pages/innerPages/ContactPage"));
const PricingPage            = lazy(() => import("./pages/innerPages/PricingPage"));
const ProjectsPage           = lazy(() => import("./pages/innerPages/ProjectsPage"));
const ProjectDetailsPage     = lazy(() => import("./pages/innerPages/ProjectDetailsPage"));
const ServicePage            = lazy(() => import("./pages/innerPages/ServicePage"));
const ServicesDetailsPage    = lazy(() => import("./pages/innerPages/ServicesDetailsPage"));
const MemberResumePage       = lazy(() => import("./pages/innerPages/MemberResumePage"));
const BlogWithSidebarPage    = lazy(() => import("./pages/blogPages/BlogWithSidebarPage"));
const BlogSingleWithSidebarPage = lazy(() => import("./pages/blogPages/BlogSingleWithSidebarPage"));
const NotFoundPage           = lazy(() => import("./pages/innerPages/NotFoundPage"));
const LoginPage              = lazy(() => import("./pages/LoginPage"));
const AdminPage              = lazy(() => import("./pages/AdminPage"));

// ── Simple full-screen loader shown while a chunk is downloading ──
const PageLoader = () => (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0a"
    }}>
        <div style={{
            width: 48,
            height: 48,
            border: "4px solid #ff6b35",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const Routers = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/"                              element={<Home />} />
                <Route path="/home-dark"                     element={<HomeDark />} />
                <Route path="/contact"                       element={<ContactPage />} />
                <Route path="/pricing"                       element={<PricingPage />} />
                <Route path="/blog-with-sidebar"             element={<BlogWithSidebarPage />} />
                <Route path="/blog-single-with-sidebar/:id"  element={<BlogSingleWithSidebarPage />} />
                <Route path="/projects"                      element={<ProjectsPage />} />
                <Route path="/project-details/:id"           element={<ProjectDetailsPage />} />
                <Route path="/resume/:id"                    element={<MemberResumePage />} />
                <Route path="/service"                       element={<ServicePage />} />
                <Route path="/services-details/:id"          element={<ServicesDetailsPage />} />
                <Route path="/login"                         element={<LoginPage />} />
                <Route path="/admin/*"                       element={<AdminPage />} />
                <Route path="*"                              element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};

export default Routers;