import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import CollectionDetail from './pages/CollectionDetail';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProjectManager from './pages/admin/ProjectManager';
import TeamManager from './pages/admin/TeamManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsPage from './pages/admin/SettingsPage';
import CollectionsManager from './pages/admin/CollectionsManager';
import ExpertiseManager from './pages/admin/ExpertiseManager';



import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import ScrollToAnchor from './components/ui/ScrollToAnchor';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ScrollToAnchor />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="collection/:id" element={<CollectionDetail />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="project/:id" element={<ProjectDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Login Route Removed */}
            
            {/* Administration secrète : Inaccessible sans l'URL et le Basic Auth serveur */}
            <Route path={import.meta.env.VITE_ADMIN_PATH || "/panel-protection-fallback"}>
              <Route index element={<Login />} />
              <Route element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="collections" element={<CollectionsManager />} />
                <Route path="expertise" element={<ExpertiseManager />} />
                <Route path="projects" element={<ProjectManager />} />
                <Route path="team" element={<TeamManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
