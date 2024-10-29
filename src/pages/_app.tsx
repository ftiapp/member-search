
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Mitr } from '@next/font/google';

import { useState } from 'react';

const mitr = Mitr({
  weight: ['300'],
  subsets: ['thai'],
  
});

function App({ Component, pageProps }: AppProps) {
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleLanguageChange = (lang: 'TH' | 'EN') => {
    setLanguage(lang);
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  return (
    <div>
      {/* Display the Header at the top of every page */}
     

      {/* Main content */}
      <Component {...pageProps} language={language} />
    </div>
  );
}

export default App;