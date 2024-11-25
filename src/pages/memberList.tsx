'use client';
import React from 'react';
import { useState } from 'react';
import { Member} from '../types/type'; // Adjust path as per your project structure
import MemberComponent from './member'; // Import MemberComponent
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '../pages/pagination'
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Memberlist.module.css';
interface MemberListProps {
  members?: Member[]; // Optional for added safety
  language: 'TH' | 'EN';
  onMemberClick: (member: Member) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members = [],
  language,
  onMemberClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMemberCode, setSelectedMemberCode] = useState<string | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:576px)');

  const handleRowClick = async (member: Member) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedMemberCode(member.MEMBER_CODE); // ตั้งค่าแถวที่ถูกคลิก
    try {
      await onMemberClick(member); // เรียกฟังก์ชันจาก props
    } catch (error) {
      console.error('Error while processing:', error);
    } finally {
      setSelectedMemberCode(null); // รีเซ็ตเมื่อ API เสร็จ
      setIsProcessing(false);
    }
  };

  if (members.length === 0) {
    return (
      <Box
        className="member-container no-data"
        sx={{ textAlign: 'center', p: 2, fontFamily: 'Prompt, sans-serif' }}
      >
        <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Prompt, sans-serif' }}>
          ไม่พบข้อมูลสมาชิก
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1600,
        margin: 'auto',
        padding: isSmallScreen ? '3px' : '10px',
        border: '1px solid #d1d1d1',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: members.length > (isSmallScreen ? 50 : 1) ? 500 : 'none',
          overflow: 'auto',
        }}
      >
        <Table
          sx={{
            minWidth: isSmallScreen ? 150 : 1500,
            fontFamily: 'Prompt, sans-serif',
          }}
        >
          {/* ส่วนหัวของตาราง */}
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  display: isSmallScreen ? 'none' : 'table-cell',
                  fontSize: isSmallScreen ? '0.7rem' : '0.95rem',
                  fontWeight: 'bold',
                  backgroundColor: '#043494',
                  color: '#ffffff',
                  fontFamily: 'Prompt, sans-serif',
                  position: 'sticky',
                }}
              >
                {language === 'TH' ? 'ลำดับ' : 'No.'}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: isSmallScreen ? '0.6rem' : '0.95rem',
                  fontWeight: 'bold',
                  backgroundColor: '#043494',
                  color: '#ffffff',
                  fontFamily: 'Prompt, sans-serif',
                  position: 'sticky',
                }}
              >
                {language === 'TH' ? 'รหัสสมาชิก' : 'Member Code'}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: isSmallScreen ? '0.6rem' : '0.95rem',
                  fontWeight: 'bold',
                  backgroundColor: '#043494',
                  color: '#ffffff',
                  fontFamily: 'Prompt, sans-serif',
                  position: 'sticky',
                }}
              >
                {language === 'TH' ? 'ชื่อบริษัท' : 'Company Name'}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* ส่วนข้อมูลในตาราง */}
          <TableBody>
  {members.map((member, index) => (
    <TableRow
      key={member.MEMBER_CODE}
      hover
      onClick={() => handleRowClick(member)}
      sx={{
        cursor: 'pointer',
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
        '&:hover': { backgroundColor: '#f1f1f1' },
        transition: 'background-color 0.3s ease',
        fontFamily: 'Prompt, sans-serif',
      }}
    >
      {/* ลำดับ */}
      <TableCell
        align="center"
        sx={{
          display: isSmallScreen ? 'none' : 'table-cell',
          fontSize: isSmallScreen ? '0.6rem' : '0.95rem',
          fontWeight: 500,
          padding: '5px',
          fontFamily: 'Prompt, sans-serif',
        }}
      >
        {index + 1}
      </TableCell>
      {/* รหัสสมาชิก */}
      <TableCell
        sx={{
          fontSize: isSmallScreen ? '0.6rem' : '0.95rem',
          fontWeight: 500,
          padding: '5px',
          fontFamily: 'Prompt, sans-serif',
        }}
      >
        {member.MEMBER_CODE}
      </TableCell>
      {/* ชื่อบริษัท + โลโก้ */}
      <TableCell
        sx={{
          fontSize: isSmallScreen ? '0.6rem' : '0.95rem',
          padding: isSmallScreen ? '5px' : '10px',
          fontFamily: 'Prompt, sans-serif',
          display: 'flex', // ใช้ Flexbox เพื่อจัดเรียง
          justifyContent: 'space-between', // ให้โลโก้อยู่ด้านขวาสุด
          alignItems: 'center', // จัดให้อยู่ตรงกลางแนวตั้ง
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <span>
          {language === 'TH' ? member.COMPANY_NAME : member.COMP_PERSON_NAME_EN}
        </span>
        {selectedMemberCode === member.MEMBER_CODE && (
  <Box
    component="img"
    src="/Logo_FTI.webp"
    alt="Loading Logo"
    sx={{
      width: '30px',
      height: '28px',
      animation: 'spinFastThenSlow 7s infinite ease-in-out', // เพิ่มระยะเวลา
      transformStyle: 'preserve-3d',
      '@keyframes spinFastThenSlow': {
        '0%': { transform: 'rotateY(0deg)' },
        '30%': { transform: 'rotateY(360deg)' }, // หมุนเร็วรอบแรก (1 รอบ)
        '60%': { transform: 'rotateY(720deg)' }, // หมุนเร็วรอบที่สอง (2 รอบ)
        '100%': { transform: 'rotateY(1080deg)' }, // หมุนช้ากว่า (รอบที่ 3)
      },
    }}
  />
)}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

       {/* Pagination inside MemberList container */}
       {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'right', marginTop: 1 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default MemberList;