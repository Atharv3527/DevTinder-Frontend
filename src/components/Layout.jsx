import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SparklesBackground from './SparklesBackground';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      <SparklesBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
