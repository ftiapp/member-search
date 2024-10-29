'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@mui/material';
import { Member } from './type'
import {Address} from './type'
import {MemberProduct} from './type'
import { Box,Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface MemberDetailsProps {
  address: Address | Address[];
  language: 'TH' | 'EN';
  onClose: () => void;
  compPersonCode: string;
  memberCode: string;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ address, language, onClose }) => {
  const addressArray = Array.isArray(address) ? address : [address];
  const companyInfo = addressArray[0];
  const rightGroupInfo = addressArray[0];

  const industryGroups = Array.from(new Set(
    addressArray.map(addr => addr.Industry_GROUP_NAME)
  )).map(groupName => {
    const group = addressArray.find(addr => addr.Industry_GROUP_NAME === groupName);
    return {
      Industry_GROUP_NAME: group?.Industry_GROUP_NAME || '',
      Industry_REPRESENT_1: group?.Industry_REPRESENT_1 || '',
      Industry_REPRESENT_2: group?.Industry_REPRESENT_2 || '',
      Industry_REPRESENT_3: group?.Industry_REPRESENT_3 || '',
    };
  });

  const provinceGroups = Array.from(new Set(
    addressArray.map(addr => addr.Province_GROUP_NAME)
  )).map(groupName => {
    const group = addressArray.find(addr => addr.Province_GROUP_NAME === groupName);
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
        height: '90vh', // ลดความสูงของ box
        maxWidth: '400px', // ปรับขนาด box ให้น้อยลง
        padding: 2,
        boxShadow: 3,
        position: 'relative',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: 4,
        overflowY: 'auto', // เพิ่ม scroll เมื่อเนื้อหายาวเกินไป
        '@media (max-width: 414px)': {
          maxWidth: '100%', // ลดขนาดหน้าต่างสำหรับหน้าจอ 414px
          height: '60vh', // ลดความสูงลงอีกสำหรับหน้าจอที่เล็กกว่า
        },
        '@media (max-width: 360px)': {
          maxWidth: '100%',
          height: '50vh', // ลดความสูงสำหรับหน้าจอ 360px
        },
        '@media (min-width: 1024px)': {
          maxWidth: '600px', // ขยายหน้าต่างให้ใหญ่ขึ้นสำหรับหน้าจอขนาดใหญ่
          height: '95vh', // เพิ่มความสูงหน้าต่าง
        },
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        align="center"
        sx={{
          fontSize: '16px', // ลดขนาดฟอนต์ให้เล็กลงทั่วไป
          '@media (max-width: 414px)': {
            fontSize: '14px', // ลดขนาดฟอนต์สำหรับหน้าจอเล็ก
          },
          '@media (max-width: 360px)': {
            fontSize: '12px', // ลดขนาดฟอนต์ให้เล็กสุดสำหรับหน้าจอเล็กมาก
          },
          '@media (min-width: 1024px)': {
            fontSize: '18px', // ขยายขนาดฟอนต์สำหรับหน้าจอขนาดใหญ่
          },
        }}
      >
        {language === 'TH' ? 'รายละเอียดสมาชิก' : 'Member Details'}
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <Typography sx={{ mt: 1, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'บริษัท' : 'Company'}:</strong> {language === 'TH' ? companyInfo.COMPANY_NAME : companyInfo.COMP_PERSON_NAME_EN}
        </Typography>
        <Typography sx={{ mt: 0.2, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'ที่อยู่' : 'Address'}:</strong> {language === 'TH' ? companyInfo.ADDR_TH : companyInfo.ADDR_EN}
        </Typography>
        <Typography sx={{ mt: 0.2, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'โทรศัพท์' : 'Telephone'}:</strong> {companyInfo.ADDR_TELEPHONE}
        </Typography>
        <Typography sx={{ mt: 0.2, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'โทรสาร' : 'Fax'}:</strong> {companyInfo.ADDR_FAX || '-'}
        </Typography>
        <Typography sx={{ mt: 0.2, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'อีเมล' : 'Email'}:</strong> {companyInfo.ADDR_EMAIL}
        </Typography>
        <Typography sx={{ mt: 0.2, fontSize: '12px', '@media (min-width: 1024px)': { fontSize: '16px' } }}>
          <strong>{language === 'TH' ? 'เว็บไซต์' : 'Website'}:</strong>
          {companyInfo.ADDR_WEBSITE ? (
            companyInfo.ADDR_WEBSITE.split(',').map((website, idx) => (
              <React.Fragment key={idx}>
                <a href={website.trim().startsWith('http') ? website.trim() : `http://${website.trim()}`} target="_blank" rel="noopener noreferrer">
                  {website.trim()}
                </a>
                {idx < companyInfo.ADDR_WEBSITE.split(',').length - 1 && ', '}
              </React.Fragment>
            ))
          ) : (
            <span>{language === 'TH' ? 'ไม่มีข้อมูลเว็บไซต์' : 'No website data available'}</span>
          )}
        </Typography>
      </Box>

      {/* Right_GROUP Table */}
      <Table component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
        <TableBody>
          <TableRow sx={{ backgroundColor: '#3a74e0' }}>
            <TableCell colSpan={3} align="center">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
                  '@media (max-width: 414px)': {
                    fontSize: '12px',
                  },
                  '@media (max-width: 360px)': {
                    fontSize: '10px',
                  },
                }}
              >
                {rightGroupInfo.Right_GROUP_NAME}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: '#eeeeee' }}>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
            </TableCell>
          </TableRow>

          {/* Representative Values with wrapping */}
          <TableRow>
            <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
              {rightGroupInfo.Right_REPRESENT_1 || '-'}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
              {rightGroupInfo.Right_REPRESENT_2 || '-'}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
              {rightGroupInfo.Right_REPRESENT_3 || '-'}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Industry Groups Table */}
      {industryGroups.map((group, index) => (
        group.Industry_GROUP_NAME ? (
          <Table component={Paper} key={index} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#3a74e0' }}>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
                      '@media (max-width: 414px)': {
                        fontSize: '12px',
                      },
                      '@media (max-width: 360px)': {
                        fontSize: '10px',
                      },
                    }}
                  >
                    {group.Industry_GROUP_NAME}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
                  {group.Industry_REPRESENT_1 || '-'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
                  {group.Industry_REPRESENT_2 || '-'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
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
              <TableRow sx={{ backgroundColor: '#3a74e0' }}>
                <TableCell colSpan={3} align="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
                      '@media (max-width: 414px)': {
                        fontSize: '12px',
                      },
                      '@media (max-width: 360px)': {
                        fontSize: '10px',
                      },
                    }}
                  >
                    {group.Province_GROUP_NAME}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 1' : 'Representative 1'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 2' : 'Representative 2'}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                  {language === 'TH' ? 'ผู้แทน 3' : 'Representative 3'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
                  {group.Province_REPRESENT_1 || '-'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
                  {group.Province_REPRESENT_2 || '-'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '12px', wordWrap: 'break-word' }}>
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