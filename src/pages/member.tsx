'use client';
import React, { useState } from 'react';
import { Member } from './type'; // Adjust path as per your project structure
import axios from 'axios'; // Import Axios for HTTP requests
import MemberDetails from './memberdetails'
import { Address } from './type'; // Ensure correct pat
import { useRouter } from 'next/router'; // นำเข้า useRouter จาก next/router เพื่อใช้ในการ redirect
import { Modal, Box } from '@mui/material'; // ใช้ Material-UI สำหรับ Modal

interface MemberComponentProps {
  member: Member;
  language: 'TH' | 'EN';
  onClick: (member: Member) => void;
}

const MemberComponent: React.FC<MemberComponentProps> = ({ member, language, onClick }) => {
  const handleClick = () => {
    onClick(member);
  };

  return (
    <div className="member-container" onClick={handleClick}>
      <div className="member-box">
        <h3><strong>{member.MEMBER_CODE}</strong></h3>
        {language === 'TH' ? (
          <p><strong>บริษัท:</strong> {member.COMPANY_NAME}</p>
        ) : (
          <p><strong>Company:</strong> {member.COMP_PERSON_NAME_EN}</p>
        )}
      </div>
    </div>
  );
};

export default MemberComponent;