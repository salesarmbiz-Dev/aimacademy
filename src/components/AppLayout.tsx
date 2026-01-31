import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-rootbeer">
      <Header />
      <main className="pt-16 min-h-[calc(100vh-64px)]">
        <div className="container py-6 md:py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
