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
import MessagesManager from './pages/admin/MessagesManager';
import SettingsPage from './pages/admin/SettingsPage';
import CollectionsManager from './pages/admin/CollectionsManager';
import ExpertiseManager from './pages/admin/ExpertiseManager';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
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
        
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="collections" element={<CollectionsManager />} />
          <Route path="expertise" element={<ExpertiseManager />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
