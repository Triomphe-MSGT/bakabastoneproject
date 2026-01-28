import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import FloatingTestimonials from '../ui/FloatingTestimonials';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <FloatingTestimonials />
    </div>
  );
};

export default Layout;
