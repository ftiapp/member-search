
import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
      <footer className="footer">
        <div className="logoContainer">
          <Image
            src="/FTI-MasterLogo_CMYK-White.png" // Path relative to the public directory
            alt="FTI Master Logo"
            width={200} // Adjust the width as needed
            height={90} // Adjust the height as needed
          />
        </div>
      </footer>
    );
  };
  
  export default Footer;