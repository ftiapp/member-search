'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Member } from '../types/type'
import {Address} from '../types/type'
import {MemberProduct} from '../types/type'
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Box, Table, TableBody, TableCell, TableRow, Paper, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
interface MemberDetailsProps {
  address?: Address | Address[]; // อนุญาตให้เป็น undefined
  language: 'TH' | 'EN';
  onClose: () => void;
  compPersonCode: string;
  memberCode: string;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ address = [], language, onClose }) => {
  const addressArray = Array.isArray(address) ? address : [address];
  const companyInfo = addressArray[0] || {}; // ป้องกัน undefined
  const rightGroupInfo = addressArray[0] || {};
  const isSmallScreen = useMediaQuery('(max-width:576px)');
  const industryGroups = Array.from(new Set(
    addressArray.map(addr => addr?.Industry_GROUP_NAME || '')
  )).filter(name => name) // กรองเฉพาะชื่อที่ไม่ว่าง
    .map(groupName => {
      const group = addressArray.find(addr => addr?.Industry_GROUP_NAME === groupName);
      return {
        Industry_GROUP_NAME: group?.Industry_GROUP_NAME || '',
        Industry_REPRESENT_1: group?.Industry_REPRESENT_1 || '',
        Industry_REPRESENT_2: group?.Industry_REPRESENT_2 || '',
        Industry_REPRESENT_3: group?.Industry_REPRESENT_3 || '',
      };
    });
  
  // ป้องกัน error เมื่อ addressArray บางตัวไม่มีค่า Province_GROUP_NAME
  const provinceGroups = Array.from(new Set(
    addressArray.map(addr => addr?.Province_GROUP_NAME || '')
  )).filter(name => name) // กรองเฉพาะชื่อที่ไม่ว่าง
    .map(groupName => {
      const group = addressArray.find(addr => addr?.Province_GROUP_NAME === groupName);
      return {
        Province_GROUP_NAME: group?.Province_GROUP_NAME || '',
        Province_REPRESENT_1: group?.Province_REPRESENT_1 || '',
        Province_REPRESENT_2: group?.Province_REPRESENT_2 || '',
        Province_REPRESENT_3: group?.Province_REPRESENT_3 || '',
      };
    });

  return (
<Box
  sx={{
    width: '80%',
    fontFamily: 'Prompt, sans-serif',
    height: '82vh', // ลดความสูงของ box
    maxWidth: '400px', // ปรับขนาด box ให้น้อยลง
    padding: 2,
    boxShadow: 3,
    position: 'relative',
    margin: 'auto',
    marginTop: '15px', // เพิ่ม marginTop เพื่อเว้นระยะด้านบน
    backgroundColor: '#fff',
    borderRadius: 4,
    overflowY: 'auto', // เพิ่ม scroll เมื่อเนื้อหายาวเกินไป
    
    '@media (min-width: 1024px)': {
      maxWidth: '800px', // ขยายหน้าต่างให้ใหญ่ขึ้นสำหรับหน้าจอขนาดใหญ่
      height: '90vh', // เพิ่มความสูงหน้าต่าง
      marginTop: '30px', // เพิ่ม marginTop สำหรับหน้าจอขนาดใหญ่
    },
  }}
>
      <Typography
        variant="h6"
        component="h2"
        align="center"
        sx={{
           fontSize:isSmallScreen ? '12px':'16px' , wordWrap: 'break-word'
           , fontFamily: 'Prompt, sans-serif',
        }}
      >
        {language === 'TH' ? 'รายละเอียดสมาชิก' : 'Member Details'}
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
  <Typography
    sx={{
      mt: 1,
      fontFamily: 'Prompt, sans-serif',
      fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
    }}
  >
    <strong>{language === 'TH' ? 'บริษัท' : 'Company'}: </strong>
    {language === 'TH'
      ? companyInfo.COMPANY_NAME || 'ไม่พบข้อมูล'
      : companyInfo.COMP_PERSON_NAME_EN || 'No data available'}
  </Typography>
  <Typography
    sx={{
      mt: 0.2,
      fontFamily: 'Prompt, sans-serif',
      fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
    }}
  >
    <strong>{language === 'TH' ? 'ที่อยู่' : 'Address'}:</strong> {language === 'TH' ? companyInfo.ADDR_TH : companyInfo.ADDR_EN}
  </Typography>
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      fontFamily: 'Prompt, sans-serif',
      fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
    }}
  >
    <Typography
  sx={{
    fontFamily: 'Prompt, sans-serif !important',
    fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
  }}
>
  <strong>{language === 'TH' ? 'โทรศัพท์' : 'Telephone'}:</strong> {companyInfo.ADDR_TELEPHONE}
</Typography>
<Typography
  sx={{
    fontFamily: 'Prompt, sans-serif !important',
    fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
  }}
>
      <strong>{language === 'TH' ? 'โทรสาร' : 'Fax'}:</strong> {companyInfo.ADDR_FAX || '-'}
    </Typography>
  </Box>
  <Typography
    sx={{
      mt: 0.2,
      fontFamily: 'Prompt, sans-serif',
      fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
    }}
  >
    <strong>{language === 'TH' ? 'เว็บไซต์' : 'Website'}: </strong>
    {companyInfo.ADDR_WEBSITE ? (
      companyInfo.ADDR_WEBSITE.split(',').map((website, idx) => (
        <React.Fragment key={idx}>
          <a
            href={website.trim().startsWith('http') ? website.trim() : `http://${website.trim()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {website.trim()}
          </a>
          {idx < companyInfo.ADDR_WEBSITE.split(',').length - 1 && ', '}
        </React.Fragment>
      ))
    ) : (
      <span>{language === 'TH' ? ' ไม่มีข้อมูลเว็บไซต์' : 'No website data available'}</span>
    )}
  </Typography>
  <Typography
  sx={{
    mt: 0.2,
    fontFamily: 'Prompt, sans-serif',
    fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
  }}
>
  <strong>{language === 'TH' ? 'อีเมล' : 'Email'}:</strong> {companyInfo.ADDR_EMAIL}
</Typography>
  <Typography
    sx={{
      mt: 0.2,
      fontFamily: 'Prompt, sans-serif',fontSize:isSmallScreen ? '11px':'16px' , wordWrap: 'break-word'
    }}
  >
    <strong>{language === 'TH' ? 'ผลิตภัณฑ์' : 'Products'}:</strong> {companyInfo.PRODUCT_DESC_TH}
  </Typography>
</Box>

      {/* Right_GROUP Table */}
      <Table component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
        <TableBody>
          <TableRow sx={{ backgroundColor: '#043494' }}>
            <TableCell colSpan={3} align="center">
            <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    color: 'white',
    fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
    fontSize:isSmallScreen ? '11px':'14px' , wordWrap: 'break-word'
  }}
>
  {rightGroupInfo?.Right_GROUP_NAME || (language === 'TH' ? 'ไม่มีข้อมูล' : 'No data available')}
</Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: '#eeeeee' }}>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px', wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
              {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px', wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
              {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif'}}>
              {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
            </TableCell>
          </TableRow>

          {/* Representative Values with wrapping */}
          <TableRow>
  <TableCell align="center" sx={{fontSize:isSmallScreen ? '10px':'12px', wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
    {rightGroupInfo?.Right_REPRESENT_1 || '-'}
  </TableCell>
  <TableCell align="center" sx={{ fontSize:isSmallScreen ? '10px':'12px', wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
    {rightGroupInfo?.Right_REPRESENT_2 || '-'}
  </TableCell>
  <TableCell align="center" sx={{ fontSize:isSmallScreen ? '10px':'12px', wordWrap: 'break-word' ,fontFamily: 'Prompt, sans-serif'}}>
    {rightGroupInfo?.Right_REPRESENT_3 || '-'}
  </TableCell>
</TableRow>
        </TableBody>
      </Table>

      {/* Industry Groups Table */}
      {industryGroups.map((group, index) => (
        group.Industry_GROUP_NAME ? (
          <Table component={Paper} key={index} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#043494' }}>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
                       fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word'
                    }}
                  >
                    {group.Industry_GROUP_NAME}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word' ,fontFamily: 'Prompt, sans-serif'}}>
                  {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{  fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {group.Industry_REPRESENT_1 || '-'}
                </TableCell>
                <TableCell align="center" sx={{  fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {group.Industry_REPRESENT_2 || '-'}
                </TableCell>
                <TableCell align="center" sx={{  fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {group.Industry_REPRESENT_3 || '-'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : null
      ))}

      {/* Province Groups Table */}
      {provinceGroups.map((group, index) => (
        group.Province_GROUP_NAME ? (
          <Table component={Paper} key={index} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#043494' }}>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                     
                      fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
                       fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word'
                    }}
                  >
                    {group.Province_GROUP_NAME}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{  fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {group.Province_REPRESENT_1 || '-'}
                </TableCell>
                <TableCell align="center" sx={{  fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word' ,fontFamily: 'Prompt, sans-serif'}}>
                  {group.Province_REPRESENT_2 || '-'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize:isSmallScreen ? '10px':'12px' , wordWrap: 'break-word',fontFamily: 'Prompt, sans-serif' }}>
                  {group.Province_REPRESENT_3 || '-'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : null
      ))}

<IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: 'black',
          '&:hover': {
            color: 'red',
          },
          '@media (max-width: 414px)': {
            top: 5,
            right: 5,
          },
          '@media (max-width: 360px)': {
            top: 3,
            right: 3,
          },
          '@media (min-width: 1024px)': {
            top: 15,
            right: 15,
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default MemberDetails;