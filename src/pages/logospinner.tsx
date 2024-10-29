'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import styles from '../styles/logospinner.module.css';

const LogoSpinner: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLogo(true);
      setTimeout(() => {
        setShowLogo(false);
      },50000); // Show logo for 3 seconds before hiding
    } else {
      setShowLogo(false);
    }
  }, [loading]);

  return (
    <div className={styles.logoContainer}>
      {showLogo && (
        <div className={styles.shimmer}>
          <Image
            src="/FTI-MasterLogo_RGB_forLightBG.png"
            alt="FTI Master Logo"
            width={140}
            height={65}
          
          />
        </div>
      )}
      {loading && (
        <div className={styles.shimmer}>
        
        </div>
      )}
    </div>
  );
};

export default LogoSpinner;