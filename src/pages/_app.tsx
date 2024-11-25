
import '../styles/Memberlist.module.css'
import type { AppProps } from "next/app";


import { useState } from 'react';



function App({ Component, pageProps }: AppProps) {
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleLanguageChange = (lang: 'TH' | 'EN') => {
    setLanguage(lang);
  };

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  return (
    <div>
      {/* Main content */}
      <Component {...pageProps} language={language} />
    </div>
  );
}

export default App;