import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SparklesBackground from './SparklesBackground';

/**
 * Full-width layout used exclusively for the Home page.
 * Unlike the standard Layout, this does NOT wrap content in
 * the max-w-7xl padded container so the scroll animation can
 * stretch edge-to-edge.
 */
export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      <SparklesBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        {/* No max-w / px constraints — Home manages its own spacing */}
        <main className="flex-1 w-full animate-fade-in relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
