import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import AccessibilityWidget from '../common/AccessibilityWidget';
import SkipLink from '../common/SkipLink';

export default function Layout() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main-content" className="layout__main">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <AccessibilityWidget />
    </>
  );
}
