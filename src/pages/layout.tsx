'use client';
import React from 'react';

type Language = 'TH' | 'EN';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onLanguageChange: (lang: 'TH' | 'EN') => void;
  language: 'TH' | 'EN';
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onLanguageChange, language }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;