'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import styles from '../styles/logospinner.module.css';
interface LogoSpinnerProps {
  loading: boolean;
}
const LogoSpinner: React.FC<LogoSpinnerProps> = ({ loading }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setShowLogo(loading); // Show logo while loading is true
  }, [loading]);

  return (
    <div className={styles.logoContainer}>
      {showLogo && (
        <div className={styles.logoContent}>
          {/* Rotating Logo */}
          <div
            style={{
              width: '90px',
              height: '90px',
              animation: 'spinFastThenSlow 7s infinite ease-in-out',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src="/Logo_FTI.webp"
              alt="Loading Logo"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Loading Text */}
          <p style={{ marginTop: '10px', fontFamily: 'Prompt, sans-serif', fontSize: '14px' }}>
            กำลังค้นหาสมาชิก...
          </p>
        </div>
      )}
    </div>
  );
};

export default LogoSpinner;