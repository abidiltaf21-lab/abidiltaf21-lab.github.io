import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProjectForm from './ProjectForm';
import ProjectsManager from './ProjectsManager';
import RequestsInbox from './RequestsInbox';
import CategoriesManager from './CategoriesManager';
import MediaLibrary from './MediaLibrary';
import SiteSettings from './SiteSettings';
import { AdminLayout } from './components/AdminLayout';

import TeamManager from './pages/TeamManager';

import ShowreelManager from './pages/ShowreelManager';
import ShowreelForm from './pages/ShowreelForm';
import ReviewManager from './pages/ReviewManager';
import PricingManager from './pages/PricingManager';
import ProfileManager from './pages/ProfileManager';
import ServicesManager from './pages/ServicesManager';

const AdminApp: React.FC = () => {
  return (
    <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsManager />} />
          <Route path="/team" element={<TeamManager />} />

          <Route path="/services" element={<ServicesManager />} />
          <Route path="/showreel" element={<ShowreelManager />} />
          <Route path="/showreel/add" element={<ShowreelForm />} />
          <Route path="/showreel/edit/:id" element={<ShowreelForm />} />
          <Route path="/reviews" element={<ReviewManager />} />
          <Route path="/pricing" element={<PricingManager />} />
          <Route path="/add" element={<ProjectForm />} />
          <Route path="/edit/:id" element={<ProjectForm />} />
          <Route path="/requests" element={<RequestsInbox />} />
          <Route path="/categories" element={<CategoriesManager />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/settings" element={<SiteSettings />} />
          <Route path="/profile" element={<ProfileManager />} />
        </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
