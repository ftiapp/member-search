'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './searchbar'; // Assuming this is the correct path
import MemberList from './memberList'; // Assuming this is the correct path
import { Member } from '../types/type';
import MemberComponent from './member';
import {Address} from '../types/type';
import Pagination from './pagination';
import Footer from './footer'; // Import the Footer component
import LogoSpinner from './logospinner';
import axios from 'axios'; // Import Axios for HTTP requests
import  MemberDetails  from './memberdetails';
import { Menu as MenuIcon } from '@mui/icons-material'; // Importing MenuIcon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info'; // Import the icon
import { Grid, Typography, Box, Modal, Drawer, IconButton, useMediaQuery, Button,Autocomplete,TextField ,Accordion, AccordionSummary, AccordionDetails,Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import Image from 'next/image';

const IndexPage: React.FC = () => {
  // State management
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberTypeCode, setMemberTypeCode] = useState<string>('');
  const [tempMemberTypeCode, setTempMemberTypeCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [provinces, setProvinces] = useState<Array<{ ADDR_PROVINCE_NAME: string }>>([]);
  const [provincegroup, setProvinceGroups] = useState<Array<{ MEMBER_GROUP_NAME: string; MEMBER_GROUP_NAME_EN: string }>>([]);
  const [industrygroup, setIndustryGroups]= useState<Array<{ MEMBER_GROUP_NAME: string; MEMBER_GROUP_NAME_EN: string }>>([]);
  const [tempProvince, setTempProvince] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address[] | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [tempIndustryGroup, setTempIndustryGroup] = useState('');
  const [tempProvinceGroup, setTempProvinceGroup] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [isProvinceReportModalOpen, setIsProvinceReportModalOpen] = useState(false);
  const [provinceReportData, setProvinceReportData] = useState<any[]>([]);
  const [loadingProvinceReport, setLoadingProvinceReport] = useState(false);
 const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProvinceGroup, setSelectedProvinceGroup] = useState<string | null>(null);
const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingIndustryData, setLoadingIndustryData] = useState(false);
  const [showFooter, setShowFooter] = useState(true); // New state for footer visibility
  const [lastScrollTop, setLastScrollTop] = useState(0); // Track last scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        setShowFooter(false);
      } else {
        // Scrolling up
        setShowFooter(true);
      }
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]); // Add lastScrollTop as dependency
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 480) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(10); // Default items per page for larger screens
      }
    };

    updateItemsPerPage(); // Initial check
    window.addEventListener('resize', updateItemsPerPage); // Update on resize

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);
  // Constants
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '57%',
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: '8px',
    fontFamily: 'Prompt, sans-serif',
  };
  const memberTypes = [
    { label: 'สามัญนิติบุคคล (สน)', value: '11' },
    { label: 'สามัญสมาคมการค้า (สส)', value: '12' },
    { label: 'สบทบนิติบุคคล (ทน)', value: '21' },
    { label: 'สมทบบุคคลธรรมดา (ทบ)', value: '22' }
  ];
  type MemberTypeCode = '11' | '12' | '21' | '22';

  interface MemberTypeCounts {
    '11': number;
    '12': number;
    '21': number;
    '22': number;
  }
  const [memberTypeCounts, setMemberTypeCounts] = useState<MemberTypeCounts>({
    '11': 0,
    '12': 0,
    '21': 0,
    '22': 0,
  });
  const memberTypeMapping: Record<string, string> = {
    '11': 'สามัญนิติบุคคล (สน)',
    '12': 'สามัญสมาคมการค้า (สส)',
    '21': 'สบทบนิติบุคคล (ทน)',
    '22': 'สมทบบุคคลธรรมดา (ทบ)',
    'รวมทั้งหมด': 'รวมทั้งหมด', // Default for rollup
  };
  const provinceGroupMapping: Record<string, string> = {
    '11': 'สามัญนิติบุคคล (สน)',
    '12': 'สามัญสมาคมการค้า (สส)',
    '21': 'สบทบนิติบุคคล (ทน)',
    '22': 'สมทบบุคคลธรรมดา (ทบ)',
    'รวมทั้งหมด': 'รวมทั้งหมด', // Default for rollup
  };
  const industryGroupMapping: Record<string, string> = {
    '11': 'สามัญนิติบุคคล (สน)',
    '12': 'สามัญสมาคมการค้า (สส)',
    '21': 'สบทบนิติบุคคล (ทน)',
    '22': 'สมทบบุคคลธรรมดา (ทบ)',
    'รวมทั้งหมด': 'รวมทั้งหมด', // Default for rollup
  };
  // Mobile view detection
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('/api/provinces');
        setProvinces(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch province groups
  useEffect(() => {
    const fetchProvinceGroups = async () => {
      try {
        const response = await axios.get('/api/provincegroup');
        setProvinceGroups(response.data);
      } catch (error) {
        console.error('Error fetching province groups:', error);
      }
    };

    fetchProvinceGroups();
  }, []);
useEffect(()=> {
  const fetchIndustryGroups = async () => {
    try {
      const response = await axios.get('/api/industrygroup');
      setIndustryGroups(response.data);
    } catch (error) {
      console.error('Error fetching industry groups:', error)
    }
  };
  fetchIndustryGroups();
}, []);
  // Mobile view detection effect
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);





  // Search functionality
  const performSearch = async () => {
    
    setLoading(true); // เริ่มแสดง LogoSpinner
  setSearchResults([]); // ซ่อนผลลัพธ์ก่อนหน้า
    console.log('Performing search with:', {
      query: searchQuery || '<empty>',
      selectedFilter,
      tempMemberTypeCode,
      tempProvince,
      tempIndustryGroup,
      tempProvinceGroup,
    });
  
    const params = new URLSearchParams();
  
    // เพิ่มตัวกรองจาก SearchBar เฉพาะเมื่อมีข้อความค้นหา
    if (searchQuery && searchQuery.trim() !== '') {
      params.append('q', searchQuery);
      if (selectedFilter !== 'all') {
        params.append('selectedFilter', selectedFilter);
      }
    }
  
    // เพิ่มตัวกรองจาก Drawer
    if (tempMemberTypeCode) params.append('member_type_code', tempMemberTypeCode);
    if (tempProvince) params.append('province', tempProvince);
    if (tempIndustryGroup) params.append('industry_group_name', tempIndustryGroup);
    if (tempProvinceGroup) params.append('province_group_name', tempProvinceGroup);
  
    try {
      const response = await axios.get(`/api/search?${params.toString()}`);
      setSearchResults(response.data);
      const results: Member[] = response.data;
  
      // กรองเฉพาะสมาชิกที่มีสถานะ 'A'
      const activeResults = results.filter(
        (result) => result.MEMBER_STATUS_CODE === 'A'
      );
      const uniqueResults = results.filter(
        (result, index, self) =>
          index === self.findIndex((r) => r.MEMBER_CODE === result.MEMBER_CODE)
      );
  
      // Initialize counts with correct structure
      const counts: MemberTypeCounts = { '11': 0, '12': 0, '21': 0, '22': 0 };
  
      // Increment counts safely
      uniqueResults.forEach((member) => {
        const code = member.MEMBER_TYPE_CODE as keyof MemberTypeCounts;
        counts[code]++; // Type-safe increment
      });
  
      setMemberTypeCounts(counts); // Update state with new counts
      setSearchResults(uniqueResults);
      setCurrentPage(1);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await performSearch(); // เรียก performSearch โดยไม่ต้องส่ง query
  };

  // Filter handlers
  const handleMemberTypeChange = (event: any, value: any) => {
    setTempMemberTypeCode(value ? value.value : '');
  };

  const handleClearFilters = () => {
    setTempMemberTypeCode('');
    setTempProvince('');
    setTempIndustryGroup('');
    setTempProvinceGroup('');
    setMemberTypeCode('');
    setSearchQuery('');
    setSearchResults([]);
    setInitialLoad(true);
  };
  const handleDrawerSearch = () => {
    performSearch(); // เรียก performSearch โดยตรงจากปุ่มใน Drawer
    toggleDrawer(false); // ปิด Drawer
  };
 
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResults.slice(startIndex, endIndex);
  };

  // Member details handlers
  const fetchAddressDetails = async (memberCode: string) => {
    try {
      const response = await axios.get(`/api/address?member_code=${memberCode}`);
      const data: Address[] = response.data;
      setSelectedAddress(data);
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  const handleMemberClick = async (member: Member) => {
    setSelectedMember(member);
    await fetchAddressDetails(member.MEMBER_CODE);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMember(null);
    setSelectedAddress(null);
  };

  // Drawer handlers
  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const statisticsOptions = [
    {label:language === 'TH' ? 'สภาอุตสาหกรรมแห่งประเทศไทย' : 'Federation of Thai Industries', value: 'ftti'},
    {label:language === 'TH' ? 'กลุ่มอุตสาหกรรม' : 'Industry Group', value: 'IndustryGroup'},
    {label:language === 'TH' ? 'สภาอุตสาหกรรมจังหวัด' : 'Province Group', value: 'provinceGroup'}
  ];

  
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'TH' ? 'EN' : 'TH'));
  };
  const [selectedStatistic, setSelectedStatistic] = useState<{ label: string; value: string } | undefined>({
    label: language === 'TH' ? 'สภาอุตสาหกรรมแห่งประเทศไทย' : 'Federation of Thai Industries',
    value: 'ftti'
});

const [selectedProvinceStatistic, setSelectedProvinceStatistic] = useState<{ label: string; value: string } | undefined>({
    label: language === 'TH' ? 'สภาอุตสาหกรรมจังหวัด' : 'Province Group',
    value: 'provinceGroup'
});
const [selectedIndustryStatistic, setSelectedIndustryStatistic] = useState<{ label: string; value: string } | undefined>({
  label: language === 'TH' ? 'กลุ่มอุตสาหกรรม' : 'Industry Group',
  value: 'IndustryGroup'
});
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [industryData, setIndustryData] = useState<any[]>([]);
  
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [statisticsData, setStatisticsData] = useState<any[]>([]);

  const [isStatisticsProvinceModalOpen, setIsStatisticsProvinceModalOpen] = useState(false);
  const [statisticsProvinceData, setStatisticsProvinceData] = useState<any[]>([]);

  const [isStatisticsIndustryModalOpen, setIsStatisticsIndustryModalOpen] = useState(false);
  const [statisticIndustryData, setStatisticsIndustryData] = useState<any[]>([]);

  const handleOpenIndustryModal = async () => {
    
    try {
      const response = await axios.get('/api/industry-group-counts');
      setIndustryData(response.data); // ตั้งค่าข้อมูล Industry
      setIsIndustryModalOpen(true); // เปิด Industry Modal
    } catch (error) {
      console.error('Error fetching industry data:', error);
    }
  };
  
  const handleOpenProvinceModal = async () => {
    setLoadingProvinceReport(true);
    try {
      const response = await axios.get('/api/province-group-counts');
      console.log('Response Data:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
      setProvinceReportData(response.data); // อัพเดต State
      setIsProvinceModalOpen(true); // เปิด Modal
    } catch (error) {
      console.error('Error fetching province report data:', error);
    } finally {
      setLoadingProvinceReport(false);
    }
  };
  
  
  const handleOpenStatisticsModal = async () => {
    if (!selectedStatistic || !selectedStatistic.value) {
        console.warn('No statistic type selected');
        return; // หยุดการทำงานถ้าไม่มีค่า
    }

    setLoadingReport(true);
    try {
        const response = await axios.get(`/api/countmember?type=${selectedStatistic.value}`);
        console.log('API Response:', response.data); // ตรวจสอบข้อมูลที่ได้จาก API
        setStatisticsData(response.data); // ตั้งค่าข้อมูล Statistics
        setIsStatisticsModalOpen(true); // เปิด Statistics Modal
    } catch (error) {
        console.error('Error fetching statistics data:', error);
    } finally {
        setLoadingReport(false);
    }
};


const handleOpenProvinceStatisticsModal = async () => {
  if (!selectedProvinceStatistic || !selectedProvinceStatistic.value) {
      console.warn('No province statistic type selected');
      return;
  }

  setLoadingReport(true);
  try {
      const response = await axios.get(`/api/countmemberprovince?type=${selectedProvinceStatistic.value}`);
      console.log('Province Statistics Data:', response.data);
      setStatisticsData(response.data); 
      setIsStatisticsModalOpen(true);
  } catch (error) {
      console.error('Error fetching province statistics data:', error);
  } finally {
      setLoadingReport(false);
  }
};


const handleOpenIndustryStatisticsModal = async () => {
  if (!selectedIndustryStatistic || !selectedIndustryStatistic.value) {
    console.warn('No industry statistic type selected');
    return;
  }

  setLoadingReport(true);
  try {
    const response = await axios.get(`/api/countmemberindustry?type=${selectedIndustryStatistic.value}`);
    console.log('Industry Statistics Data:', response.data);
    setStatisticsIndustryData(response.data); // ตั้งค่าข้อมูลที่ถูกต้อง
    setIsStatisticsIndustryModalOpen(true); // เปิด Industry Modal
  } catch (error) {
    console.error('Error fetching Industry statistics data:', error);
  } finally {
    setLoadingReport(false);
  }
};
  const handleCloseIndustryModal = () => {
    setIsIndustryModalOpen(false);
    setIndustryData([]); // ล้างข้อมูล Industry
  };
  
  const handleCloseProvinceModal = () => {
    setIsProvinceModalOpen(false);
    setProvinceData([]); // ล้างข้อมูล Province
  };
  
  const handleCloseStatisticsModal = () => {
    setIsStatisticsModalOpen(false);
    setStatisticsData([]); // ล้างข้อมูล Statistics
  };


  const handleCloseStatisticsProvinceModal = () => {
    setIsStatisticsModalOpen(false);
    setStatisticsData([]); // ล้างข้อมูล Province Statistics
  };
  const handleCloseStatisticsIndustryModal = () => {
    setIsStatisticsModalOpen(false);
    setStatisticsData([]); // ล้างข้อมูล Industry Statistics
  };

  const handleOpenModal = () => {
    if (!selectedStatistic || !selectedStatistic.value) {
      console.warn('No statistic type selected');
      return;
    }
  
    switch (selectedStatistic.value) {
      case 'provinceGroup':
        handleOpenProvinceStatisticsModal(); // เรียก Modal สำหรับกลุ่มจังหวัด
        break;
  
      case 'IndustryGroup':
        handleOpenIndustryStatisticsModal(); // เรียก Modal สำหรับกลุ่มอุตสาหกรรม
        break;
  
      default:
        handleOpenStatisticsModal(); // เรียก Modal สำหรับประเภทอื่น
        break;
    }
    
  };
  




  return (
    <Grid container direction="column" alignItems="center" spacing={2} style={{ fontFamily: 'Prompt, sans-serif' }}>
  

      {/* Logo */}
      <Grid item>
  <Image
    src="/logo-membersearch.png"
    alt="Logo"
    width={362} // ความกว้างของรูป
    height={75} // ความสูงของรูป
    priority // เพื่อให้รูปโหลดล่วงหน้า
    style={{
      marginTop: '40px',
      marginBottom: '-20px',
    }}
    className="responsive-logo"
  />
</Grid>


 
  {/* Modern Icon Buttons */}
  <Grid 
        container 
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        style={{ width: '100%', padding: '10px 20px', position: 'absolute', top: '20px', right: '20px' }}
      >
        {/* Language Toggle Button */}
        <Button
  onClick={toggleLanguage}
  startIcon={<TranslateIcon />}
  variant="outlined"
  style={{
    borderColor: '#043494',
    backgroundColor: '#043494',
    color: 'white',
    marginRight: '50px',
    marginTop: '15px',
    padding: '5px 15px',
    fontFamily: 'Prompt, sans-serif',
    textTransform: 'none',
    borderRadius: '30px',
    fontSize: '14px',
    display: isMobile ? 'none' : 'inline-flex', // ซ่อนบนมือถือ
  }}
>
  {language === 'TH' ? 'English' : 'ไทย'}
</Button>
      {/* Burger Menu Icon */}
      <IconButton 
        onClick={() => toggleDrawer(true)} 
        style={{ 
          color: '#043494',
          backgroundColor: 'white',
          borderRadius: '50%',
          padding: '10px',
          position: 'absolute', 
          top: '20px', 
          right: '20px' 
        }}
      >
        <MenuIcon style={{ color: '#043494' }} />
      </IconButton>
      </Grid>
      <Grid>
      {/* SearchBar */}
      <Grid item style={{ width: '100%' }}>
      <SearchBar
      language={language} 
  query={searchQuery} // ส่งคำค้นหา
  onQueryChange={(newQuery) => setSearchQuery(newQuery)} // อัปเดตคำค้นหาใน State
  onSearch={performSearch} // เรียก performSearch เมื่อกดค้นหา
  selectedFilter={selectedFilter}
  setSelectedFilter={setSelectedFilter}
/>
</Grid>

{/* แสดง LogoSpinner ระหว่าง Loading */}
{loading && (
  <Grid 
    item 
    style={{ 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      zIndex: 1000, // ให้แสดงอยู่บนสุด
      width: '30%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <LogoSpinner loading={loading} />
  </Grid>
)}
      </Grid>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '20%',
            backgroundColor: 'white',fontFamily: 'Prompt, sans-serif'
          },
        }}
      >
        <Box sx={{ width: '100%' }} role="presentation">
          
          <IconButton 
            onClick={() => toggleDrawer(false)} 
            style={{ position: 'absolute', right: '10px', top: '10px' }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h6" align="center" fontFamily='Prompt' 
            style={{ marginBottom: '10px', marginTop: '10px', color: '#003366' }}>
             {language === 'TH' ? 'ตัวกรอง' : 'Filter'}
          </Typography>
          
          <Box sx={{ borderBottom: '2px solid lightgray', margin: '0 20px', width: 'calc(100% - 40px)', marginBottom: '5px' }} />

          {/* Member Type Dropdown */}
<Typography 
  variant="body1" 
  align="left" 
  fontFamily='Prompt'
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}
>
  {language === 'TH' ? 'ประเภทสมาชิก' : 'Member Type'}
</Typography>

<Autocomplete
  disablePortal
  options={memberTypes}
  getOptionLabel={(option) => option.label}
  value={memberTypes.find(type => type.value === tempMemberTypeCode) || null}
  sx={{
    width: '80%', // ลดความกว้างลง
    marginLeft: '30px',
    marginBottom: '10px',
    '& .MuiInputBase-root': {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '0.9rem', // ลดขนาดฟอนต์
      borderRadius: '10px', // ขอบโค้งมน
    },
    '& .MuiFormLabel-root': {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '0.8rem', // ลดขนาดฟอนต์ของ Label
    },
  }}
  slotProps={{
    popper: {
      sx: {
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'Prompt, sans-serif',
        },
        '& .MuiAutocomplete-option': {
          fontFamily: 'Prompt, sans-serif',
        },
      },
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={language === 'TH' ? 'เลือกประเภทสมาชิก' : 'Select Member Type'}
      InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: '10px', // ขอบโค้งมนสำหรับ TextField
        },
      }}
    />
  )}
  onChange={handleMemberTypeChange}
/>

<Typography 
  variant="body1" 
  align="left" 
  fontFamily="Prompt"
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}
>
  {language === 'TH' ? 'ที่ตั้งบริษัท' : 'Location'}
</Typography>
<Autocomplete
  options={provinces}
  getOptionLabel={(option) => option.ADDR_PROVINCE_NAME}
  value={provinces.find(p => p.ADDR_PROVINCE_NAME === tempProvince) || null}
  disablePortal
  sx={{
    width: '80%', // ลดขนาดความกว้าง
    marginLeft: '30px',
    marginBottom: '10px',
    '& .MuiInputBase-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ input
      borderRadius: '10px', // ขอบโค้งมน
      fontSize: '0.9rem', // ลดขนาดฟอนต์ของ input
    },
    '& .MuiFormLabel-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ label
      fontSize: '0.8rem', // ลดขนาดฟอนต์ของ label
    },
  }}
  slotProps={{
    popper: {
      sx: {
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'Prompt, sans-serif', // ฟอนต์ของตัวเลือก
        },
        '& .MuiAutocomplete-option': {
          fontFamily: 'Prompt, sans-serif', // ฟอนต์ของตัวเลือกใน listbox
        },
      },
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={language === 'TH' ? 'เลือกจังหวัด' : 'Select Province'}
      InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: '10px', // ขอบโค้งมนสำหรับ TextField
        },
      }}
      InputLabelProps={{
        style: { fontFamily: 'Prompt, sans-serif' }, // ฟอนต์ของ label
      }}
    />
  )}
  onChange={(event, value) => setTempProvince(value ? value.ADDR_PROVINCE_NAME : '')}
/>
           
<Typography 
  variant="body1" 
  align="left" 
  fontFamily="Prompt"
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}
>
  {language === 'TH' ? 'สมาชิกกลุ่มอุตสาหกรรม' : 'Industry Group'}
</Typography>
<Autocomplete
  options={industrygroup} // ใช้ industryGroups state ที่มีอยู่
  getOptionLabel={(option) =>
    language === 'TH' ? option.MEMBER_GROUP_NAME : option.MEMBER_GROUP_NAME_EN
  } // แสดง MEMBER_GROUP_NAME
  value={
    industrygroup.find(
      (group) => group.MEMBER_GROUP_NAME === tempIndustryGroup
    ) || null
  } // ผูกค่ากับ tempIndustryGroup
  disablePortal // บังคับให้อยู่ใน DOM หลัก
  sx={{
    width: '80%', // ลดขนาดความกว้าง
    marginLeft: '30px',
    marginBottom: '10px',
    '& .MuiInputBase-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ input
      borderRadius: '10px', // ขอบโค้งมน
      fontSize: '0.9rem', // ลดขนาดฟอนต์
    },
    '& .MuiFormLabel-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ label
      fontSize: '0.8rem', // ลดขนาดฟอนต์
    },
  }}
  slotProps={{
    popper: {
      sx: {
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'Prompt, sans-serif', // ใช้ฟอนต์ Prompt สำหรับตัวเลือกใน Listbox
        },
        '& .MuiAutocomplete-option': {
          fontFamily: 'Prompt, sans-serif', // ใช้ฟอนต์ Prompt สำหรับตัวเลือก
        },
      },
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={
        language === 'TH'
          ? 'เลือกกลุ่มอุตสาหกรรม'
          : 'Select Industry Group'
      }
      InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: '10px', // ขอบโค้งมนสำหรับ TextField
        },
      }}
      InputLabelProps={{
        style: { fontFamily: 'Prompt, sans-serif' }, // ฟอนต์ของ Label
      }}
    />
  )}
  onChange={(event, value) => {
    setTempIndustryGroup(value ? value.MEMBER_GROUP_NAME : ''); // อัพเดต state
  }}
/>


    <Typography 
  variant="body1" 
  align="left" 
  fontFamily="Prompt"
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}
>
  {language === 'TH' ? 'สมาชิกสภาจังหวัด' : 'Province Group'}
</Typography>
<Autocomplete
  options={provincegroup} // ใช้ provinceGroups state ที่มีอยู่
  getOptionLabel={(option) =>
    language === 'TH' ? option.MEMBER_GROUP_NAME : option.MEMBER_GROUP_NAME_EN
  } // แสดง MEMBER_GROUP_NAME
  value={
    provincegroup.find(
      (group) => group.MEMBER_GROUP_NAME === tempProvinceGroup
    ) || null
  } // ผูกค่ากับ tempprovinceGroup
  disablePortal // บังคับให้อยู่ใน DOM หลัก
  sx={{
    width: '80%', // ลดขนาดความกว้าง
    marginLeft: '30px',
    marginBottom: '1px',
    '& .MuiInputBase-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ input
      borderRadius: '10px', // ขอบโค้งมน
      fontSize: '0.9rem', // ลดขนาดฟอนต์
    },
    '& .MuiFormLabel-root': {
      fontFamily: 'Prompt, sans-serif', // ฟอนต์ของ label
      fontSize: '0.8rem', // ลดขนาดฟอนต์
    },
  }}
  slotProps={{
    popper: {
      sx: {
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'Prompt, sans-serif', // ใช้ฟอนต์ Prompt สำหรับตัวเลือกใน Listbox
        },
        '& .MuiAutocomplete-option': {
          fontFamily: 'Prompt, sans-serif', // ใช้ฟอนต์ Prompt สำหรับตัวเลือก
        },
      },
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={
        language === 'TH'
          ? 'เลือกสภาจังหวัด'
          : 'Select Province Group'
      }
      InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: '10px', // ขอบโค้งมนสำหรับ TextField
        },
      }}
      InputLabelProps={{
        style: { fontFamily: 'Prompt, sans-serif' }, // ฟอนต์ของ Label
      }}
    />
  )}
  onChange={(event, value) => {
    setTempProvinceGroup(value ? value.MEMBER_GROUP_NAME : ''); // อัพเดต state
  }}
/>





          {/* Search and Clear buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0' }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#003366',
                color: 'white',
                fontFamily: 'Prompt',
                width: '40%',
                
                fontSize:'13px'
              }}
              onClick={handleDrawerSearch} // เรียกฟังก์ชัน handleDrawerSearch
            >
              {language === 'TH' ? 'ค้นหาข้อมูล' : 'Search'}
            </Button>

            <Button
              variant="contained"
              style={{
                backgroundColor: '#003366',
                color: 'white',
                fontFamily: 'Prompt',
                width: '40%',
                fontSize:'13px'
              }}
              onClick={handleClearFilters}
            >
              {language === 'TH' ? 'ล้างตัวกรอง' : 'Clear'}
            </Button>
            




          </Box>
          <Box sx={{ borderBottom: '2px solid lightgray', margin: '0 20px', width: 'calc(100% - 40px)', marginBottom: '20px',marginTop: '5px' }} />
        </Box>
         {/* Statistics Report Button */}
         <Typography 
  variant="body1" 
  align="left" 
  fontFamily="Prompt"
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '5px' }}
>
  {language === 'TH' ? 'รายงานสรุปยอดสมาชิก' : 'Statistics Report'}
</Typography>
<Grid container direction="column" alignItems="center" spacing={1} sx={{ fontFamily: 'Prompt' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3, width: '100%' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            fontFamily: 'Prompt',
            fontSize:'12px',
            width: '80%',
            marginTop: 1,
            '&:hover': { backgroundColor: '#002244' },
          }}
          onClick={ handleOpenIndustryModal}
        >
          
          {language === 'TH' ? 'รายงานสรุปยอดสมาชิกกลุ่มอุตสาหกรรม' : 'Total members : Industry Group'}
        </Button>
      </Box>

      <Modal
  open={isIndustryModalOpen}
  onClose={handleCloseIndustryModal}
  aria-labelledby="industry-modal-title"
  aria-describedby="industry-modal-description"
>
  
  <Box sx={{ ...modalStyle }}>
    <Typography
      id="industry-modal-title"
      variant="h6"
      align="center"
      sx={{ marginBottom: 2, fontFamily: 'Prompt' }}
    >
      รายงานสรุปยอดสมาชิกกลุ่มอุตสาหกรรม
    </Typography>
    {loadingIndustryData ? ( // ใช้ State การโหลดที่แยกสำหรับ Industry Modal
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    ) : (
      <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  backgroundColor: '#003366',
                  color: 'white',
                  fontFamily: 'Prompt',
                  padding: '2px 4px',
                },
              }}
            >
              <TableCell align="center">{language === 'TH' ? 'กลุ่มอุตสาหกรรม' : 'Industry Group'}</TableCell>
              <TableCell align="center">สามัญนิติบุคคล (สน.)</TableCell>
              <TableCell align="center">สามัญสมาคมการค้า (สส.)</TableCell>
              <TableCell align="center">สบทบนิติบุคคล (ทน.)</TableCell>
              <TableCell align="center">สมทบบุคคลธรรมดา (ทบ.)</TableCell>
              <TableCell align="center">{language === 'TH' ? 'รวม' : 'Totals'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {industryData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                  borderBottom:
                    index === industryData.length - 1
                      ? '3px solid black'
                      : '1px solid rgba(224, 224, 224, 1)',
                  '& td': {
                    fontWeight: index === industryData.length - 1 ? 'bold' : 'normal',
                  },
                }}
              >
                <TableCell align="left" sx={{ fontFamily: 'Prompt', padding: '2px 4px' }}>
                  {row.Industry_GROUP_NAME}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Prompt', padding: '2px 4px' }}>
                  {row.Type_11}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Prompt', padding: '2px 4px' }}>
                  {row.Type_12}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Prompt', padding: '2px 4px' }}>
                  {row.Type_21}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Prompt', padding: '2px 4px' }}>
                  {row.Type_22}
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Prompt', padding: '2px 4px', color: 'red' }}>
                  {row.Total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
</Modal>
<Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1, width: '100%' }}>
<Button
          variant="contained"
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            fontFamily: 'Prompt',
            width: '80%',
            fontSize:'12px',
            marginTop: 1,
            '&:hover': { backgroundColor: '#002244' },
            alignItems:'ccenter'
            , justifyContent: 'center'
          }}
  onClick={handleOpenProvinceModal}
>
{language === 'TH' ? 'รายงานสรุปยอดสมาชิกสภาอุตสาหกรรมจังหวัด' : 'Total members : Provincial Group'}
</Button>
</Box>
{/* Province Report Modal */}
<Modal
    open={isProvinceModalOpen} // ใช้ state เฉพาะของ Modal
    onClose={handleCloseProvinceModal}
    aria-labelledby="province-modal-title"
    aria-describedby="province-modal-description"
>
  <Box sx={modalStyle}>
    <IconButton
      onClick={handleCloseProvinceModal}
      sx={{ position: 'absolute', right: 10, top: 10,color:'red'}}
      aria-label="close"
    >
      <CloseIcon />
    </IconButton>

    <Typography
      id="province-report-modal-title"
      variant="h6"
      align="center"
      sx={{ marginBottom: 1, fontFamily: 'Prompt' }}
    >
      รายงานสรุปยอดสมาชิกสภาจังหวัด
    </Typography>

    {loadingProvinceReport ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress />
  </Box>
) : (
  <TableContainer
    component={Paper}
    sx={{
      maxHeight: '60vh',
      '@media (max-width: 330px)': { // Apply these styles for screens <= 480px
        maxHeight: '100vh',
        maxWidth:'100vh'
      },
    }}
  >
    <Table stickyHeader>
      <TableHead>
        <TableRow
          sx={{
            '& th': {
              backgroundColor: '#003366',
              color: 'white',
              fontFamily: 'Prompt',
              padding: { xs: '8px 12px', md: '2px 4px' }, // Increase padding on small screens
              fontSize: { xs: '1rem', md: '0.875rem' }, // Increase font size on small screens
            },
          }}
        >
          <TableCell align="center">{language === 'TH' ? 'กลุ่มจังหวัด' : 'Province Group'} </TableCell>
          <TableCell align="center">สามัญนิติบุคคล (สน.)</TableCell>
          <TableCell align="center">สามัญสมาคมการค้า (สส.)</TableCell>
          <TableCell align="center">สบทบนิติบุคคล (ทน.)</TableCell>
          <TableCell align="center">สมทบบุคคลธรรมดา (ทบ.)</TableCell>
          <TableCell align="center">{language === 'TH' ? 'รวม' : '  Totals'}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
  {provinceReportData.length > 0 ? (
    provinceReportData.map((row, index) => (
      <TableRow
        key={index}
        sx={{
          backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
          borderBottom: index === provinceReportData.length - 1 ? '3px solid black' : '1px solid rgba(224, 224, 224, 1)',
          '& td': {
            fontWeight: index === provinceReportData.length - 1 ? 'bold' : 'normal',
            fontSize: { xs: '1rem', md: '0.875rem' },
            padding: { xs: '8px 12px', md: '2px 4px' },
          },
        }}
      >
        <TableCell align="left" sx={{ fontFamily: 'Prompt' }}>
          {row.Province_GROUP_NAME}
        </TableCell>
        <TableCell align="center" sx={{ fontFamily: 'Prompt' }}>
          {row.Type_11}
        </TableCell>
        <TableCell align="center" sx={{ fontFamily: 'Prompt' }}>
          {row.Type_12}
        </TableCell>
        <TableCell align="center" sx={{ fontFamily: 'Prompt' }}>
          {row.Type_21}
        </TableCell>
        <TableCell align="center" sx={{ fontFamily: 'Prompt' }}>
          {row.Type_22}
        </TableCell>
        <TableCell align="center" sx={{ fontFamily: 'Prompt', color: 'red' }}>
          {row.Total}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center" sx={{ fontFamily: 'Prompt', fontStyle: 'italic' }}>
        {language === 'TH' ? 'ไม่มีข้อมูล' : 'No data available'}
      </TableCell>
    </TableRow>
  )}
</TableBody>
    </Table>
  </TableContainer>
)}
   



   
  </Box>
  
  </Modal>
  
    </Grid>
    <Typography 
  variant="body1" 
  align="left" 
  fontFamily="Prompt"
  style={{ color: '#003366', marginLeft: '30px', marginBottom: '5px' }}
>
  {language === 'TH' ? 'รายงานสถิติ' : 'Statistics Report'}
</Typography>
         <Box
  sx={{
    display: 'flex',
    flexDirection: 'column', // จัดเรียงแนวตั้ง
    justifyContent: 'center', // จัดให้อยู่ตรงกลางในแนวนอน
    alignItems: 'center', // จัดให้อยู่ตรงกลางในแนวตั้ง
    height: '100vh', // กำหนดความสูงเต็มจอเพื่อให้อยู่กลางหน้าจอ
  }}
>
  
  {/* Autocomplete Component */}
  <Autocomplete
  options={statisticsOptions} // ใช้ options เดียวกัน
  getOptionLabel={(option) => option.label}
  value={selectedStatistic}
  onChange={(event, value) => {
    setSelectedStatistic(value); // เก็บค่าที่เลือกใน Dropdown
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label={language === 'TH' ? 'เลือกสถิติ' : 'Select Statistics'}
      sx={{
        fontFamily: 'Prompt', // ฟ้อนต์ Prompt สำหรับ TextField
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px', // ขอบโค้งมน
        },
        '& .MuiInputBase-input': {
          fontFamily: 'Prompt', // ฟ้อนต์สำหรับข้อความใน Input
        },
        '& .MuiInputLabel-root': {
          fontFamily: 'Prompt', // ฟ้อนต์สำหรับ Label
        },
      }}
    />
  )}
  sx={{
    width: '80%',
    marginBottom: 2,
  }}
  disableClearable
  componentsProps={{
    popper: {
      sx: {
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'Prompt', // ฟ้อนต์ Prompt สำหรับตัวเลือก
          fontSize: '14px', // ขนาดฟ้อนต์สำหรับตัวเลือก
        },
      },
    },
  }}
/>


<Button
  variant="contained"
  sx={{
    backgroundColor: '#003366',
    color: 'white',
    alignItems: 'center',
    fontFamily: 'Prompt',
    width: '60%',
    '&:hover': { backgroundColor: '#002244' },
    fontSize: '13px',
  }}
  onClick={handleOpenModal} // ตรวจสอบค่าแล้วเรียก Modal ที่เกี่ยวข้อง
>
  {language === 'TH' ? 'ค้นหารายงาน' : 'Check Report'}
</Button>

  {/* Modal to display the report */}
  <Modal
  open={isStatisticsModalOpen} // ควบคุมสถานะการเปิด
  onClose={() => setIsStatisticsModalOpen(false)} // คลิกนอก Box เพื่อปิด
  aria-labelledby="statistics-report-modal-title"
  aria-describedby="statistics-report-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '800px',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 3,
      borderRadius: '8px',
      overflowY: 'auto',
      fontFamily: 'Prompt, sans-serif',
    }}
  >
    {/* ปุ่ม Icon สำหรับปิด Modal */}
    <IconButton
      onClick={() => setIsStatisticsModalOpen(false)} // ฟังก์ชันปิด Modal
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'red', // สีแดงเพื่อให้เด่นชัด
        zIndex: 2, // ลำดับการแสดงเหนือองค์ประกอบอื่น
      }}
    >
      <CloseIcon />
    </IconButton>
    <Typography
      id="statistics-report-modal-title"
      variant="h6"
      align="center"
      sx={{ marginBottom: 2, fontFamily: 'Prompt' }}
    >
      {language === 'TH'
        ? `สรุปจำนวนสมาชิกประเภท ${selectedStatistic?.label || ''} (สถานะ Active)`
        : `Summary of ${selectedStatistic?.label || ''} Members (Active Status)`}
    </Typography>
        {loadingReport ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
                <CircularProgress />
            </Box>
        ) : statisticsData.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลหรือไม่
            <TableContainer component={Paper} sx={{ maxHeight: '500px', width: '100%' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Prompt', backgroundColor: '#003366', color: 'white' }}>
                                ประเภทสมาชิก
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'Prompt', backgroundColor: '#003366', color: 'white' }}>
                                จำนวนสมาชิก
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statisticsData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left" sx={{ fontFamily: 'Prompt' }}>
                                {memberTypeMapping[row.MEMBER_TYPE_CODE] || row.MEMBER_TYPE_CODE}
                                </TableCell>
                                <TableCell align="center" sx={{ fontFamily: 'Prompt', color: 'black', fontWeight: 'bold' }}>
                                    {row.MemberCount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Box sx={{ textAlign: 'center', marginTop: 2, fontFamily: 'Prompt', fontStyle: 'italic' }}>
                ไม่มีข้อมูล
            </Box>
        )}
    </Box>
</Modal>
<Modal
  open={isStatisticsProvinceModalOpen}
  onClose={handleCloseStatisticsProvinceModal}
  aria-labelledby="province-modal-title"
  aria-describedby="province-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '800px',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 3,
      borderRadius: '8px',
      overflowY: 'auto',
      fontFamily: 'Prompt, sans-serif',
      zIndex: 1, // เพื่อไม่ให้ถูกซ้อนทับ
    }}
  >
    {/* ปุ่ม Icon สำหรับปิด Modal */}
    <IconButton
      onClick={handleCloseStatisticsProvinceModal}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'red',
        zIndex: 2,
      }}
    >
      <CloseIcon />
    </IconButton>
    <Typography
      id="province-modal-title"
      variant="h6"
      align="center"
      sx={{ marginBottom: 2, fontFamily: 'Prompt' }}
    >
      {language === 'TH'
        ? 'สรุปจำนวนสมาชิกประเภท กลุ่มจังหวัด (สถานะ Active)'
        : 'Summary of Province Group Members (Active Status)'}
    </Typography>
    {loadingReport ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <CircularProgress />
      </Box>
    ) : statisticsProvinceData.length > 0 ? (
      <TableContainer component={Paper} sx={{ maxHeight: '500px', width: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Prompt',
                  backgroundColor: '#003366',
                  color: 'white',
                }}
              >
                กลุ่มจังหวัด
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Prompt',
                  backgroundColor: '#003366',
                  color: 'white',
                }}
              >
                จำนวนสมาชิก
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statisticsProvinceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left" sx={{ fontFamily: 'Prompt' }}>
                  {provinceGroupMapping[row.MEMBER_TYPE_CODE] || row.MEMBER_TYPE_CODE}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontFamily: 'Prompt', color: 'red', fontWeight: 'bold' }}
                >
                  {row.MemberCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box sx={{ textAlign: 'center', marginTop: 2, fontFamily: 'Prompt', fontStyle: 'italic' }}>
        ไม่มีข้อมูล
      </Box>
    )}
  </Box>
</Modal>

<Modal
  open={isStatisticsIndustryModalOpen}
  onClose={() => setIsStatisticsIndustryModalOpen(false)}
  aria-labelledby="industry-modal-title"
  aria-describedby="indsutry-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '800px',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 3,
      borderRadius: '8px',
      overflowY: 'auto',
      fontFamily: 'Prompt, sans-serif',
    }}
  >
    {/* ปุ่ม Icon สำหรับปิด Modal */}
    <IconButton
      onClick={() => setIsStatisticsIndustryModalOpen(false)} // ปิด Modal
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'red',
      }}
    >
      <CloseIcon />
    </IconButton>
    <Typography
      id="industry-modal-title"
      variant="h6"
      align="center"
      sx={{ marginBottom: 2, fontFamily: 'Prompt' }}
    >
      {language === 'TH'
        ? 'สรุปจำนวนสมาชิกประเภท กลุ่มอุตสาหกรรม (สถานะ Active)'
        : 'Summary of Industry Group Members (Active Status)'}
    </Typography>
    {loadingReport ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <CircularProgress />
      </Box>
    ) : statisticIndustryData.length > 0 ? (
      <TableContainer component={Paper} sx={{ maxHeight: '500px', width: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Prompt',
                  backgroundColor: '#003366',
                  color: 'white',
                }}
              >
                กลุ่มอุตสาหกรรม
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  fontFamily: 'Prompt',
                  backgroundColor: '#003366',
                  color: 'white',
                }}
              >
                จำนวนสมาชิก
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statisticIndustryData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left" sx={{ fontFamily: 'Prompt' }}>
                  {industryGroupMapping[row.MEMBER_TYPE_CODE] || row.MEMBER_TYPE_CODE}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontFamily: 'Prompt', color: 'black', fontWeight: 'bold' }}
                >
                  {row.MemberCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box sx={{ textAlign: 'center', marginTop: 2, fontFamily: 'Prompt', fontStyle: 'italic',fontSize: isMobile ? '0.8rem' : '1rem', }}>
        ไม่มีข้อมูล
      </Box>
    )}
  </Box>
</Modal>
</Box>
      </Drawer>

     {/* Search Results Count */}
     {!initialLoad && !loading && (
  <Grid
    item
    style={{
      display: loading ? 'none' : 'flex',
      alignItems: 'center',
      marginTop: '5px',
      marginRight: '25px',
    }}
  >
    <InfoIcon
      sx={{
        backgroundColor: 'gray',
        color: 'white',
        borderRadius: '50%',
        fontSize: '20px',
        marginRight: '10px',
        padding: '1px',
      }}
    />
    <Typography
      variant="body1"
      style={{
        color: searchResults.length > 0 ? '#003691' : 'red',
        fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Prompt, sans-serif',
        textAlign: 'left',
        fontWeight: searchResults.length > 0 ? 'normal' : 'bold',
        fontSize: isMobile ? '0.8rem' : '1rem',
      }}
    >
      {searchResults.length > 0 ? (
        <>
          {language === 'TH' ? `ผลการค้นหาทั้งหมด ` : `Results Found `}
          <span style={{ marginRight: '10px', marginTop: '20px' }}>
            <span style={{ fontWeight: 'bold', color: 'red' }}>
            {searchResults.length.toLocaleString()} {/* Add comma formatting */}
              
            </span>{' '}
            {language === 'TH' ? `รายการ ` : `Items `}
          </span>
        </>
      ) : (
        language === 'TH'
          ? 'ไม่พบผลลัพธ์ที่ท่านค้นหา'
          : 'No results found'
      )}
    </Typography>
  </Grid>
)}

{!initialLoad && !searching && !loading && searchResults.length > 0 && (
  <Grid
    container
    rowSpacing={1} // Adjust vertical spacing between rows
    columnSpacing={5} // 4 units spacing, equivalent to 2 cm in Material-UI spacing
    style={{ marginTop: '-10px',marginBottom:'50px' }} // Adjust margin to fit better
  >
    {/* Member Type: สน. */}
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
           fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        {`จำนวนสมาชิก สน. `}
        <span style={{
          fontWeight: 'bold', color: 'red', padding: '10px', display: 'inline-block', width: isMobile ?'20px': '50px', textAlign: 'center', fontSize: isMobile ? '0.7rem' : '1rem', // ฟอนต์เล็กลงในหน้าจอเล็ก
        }}>
          {`${memberTypeCounts['11'].toLocaleString()}`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>

    {/* Member Type: สส. */}
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        {`จำนวนสมาชิก สส. `}
        <span style={{
          fontWeight: 'bold', color: 'red', padding: '10px', display: 'inline-block', width: isMobile ?'20px': '50px', textAlign: 'center',fontSize: isMobile ? '0.7rem' : '1rem',
        }}>
          {`${memberTypeCounts['12'].toLocaleString()}`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>

    {/* Member Type: ทน. */}
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        {`จำนวนสมาชิก ทน. `}
        <span style={{
          marginTop: '-10px',fontWeight: 'bold', color: 'red', padding: '10px', display: 'inline-block', width: isMobile ?'20px': '50px', textAlign: 'center',fontSize: isMobile ? '0.7rem' : '1rem',
        }}>
          {`${memberTypeCounts['21'].toLocaleString()}`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>

    {/* Member Type: ทบ. */}
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
      >
        {`จำนวนสมาชิก ทบ. `}
        <span style={{
          marginTop: '-10px',fontWeight: 'bold', color: 'red', padding: '10px', display: 'inline-block', width: isMobile ?'20px': '50px', textAlign: 'center',fontSize: isMobile ? '0.7rem' : '1rem',
        }}>
          {`${memberTypeCounts['22'].toLocaleString()}`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>
  </Grid>
)}

      {/* Search Results */}
      <Grid 
        item 
        sx={{ marginTop: -8 }} // Adjust the negative margin to move it higher
      >
        {searching && <LogoSpinner loading={searching} />}
        {!initialLoad && !searching && Array.isArray(searchResults) && searchResults.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, width: '100%' }}>
  <Typography sx={{ color: '#003366', fontFamily: 'Prompt, sans-serif', marginRight: 1 ,fontSize: isMobile ? '0.8rem' : '1rem'}}>
    {language === 'TH' ? 'แสดง' : 'Show'}
  </Typography>
  <FormControl sx={{ minWidth: 10, backgroundColor: '#ffffff' }}>
    <Select
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value)); // ตั้งค่าจำนวนรายการต่อหน้า
          setCurrentPage(1); // กลับไปหน้าแรก
        }}
        sx={{ fontFamily: 'Prompt, sans-serif', color: '#003366', fontSize: '0.8rem', height: '30px', lineHeight: 'normal' }}
      >
      {[10, 20,30,50].map((num) => (
        <MenuItem 
          key={num} 
          value={num} 
          sx={{ fontFamily: 'Prompt, sans-serif' }}
          disabled={searchResults.length < num} // Disable if remaining items are less than the option
        >
          {num}
        </MenuItem>
      ))}
      </Select>
    </FormControl>
    <Typography 
      sx={{ 
        color: '#003366', 
        fontFamily: 'Prompt, sans-serif',
        fontSize: isMobile ? '0.8rem' : '1rem',
        marginLeft: 1
      }}
    >
      {language === 'TH' ? 'รายการ' : 'items'}
    </Typography>
  </Box>
{!loading && searchResults.length > 0 && (
            <MemberList 
              members={getPaginatedData()} 
              language={language} 
              onMemberClick={handleMemberClick} 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />)}
          </>
        )}
      </Grid>
   
  
 {/* Footer */}
 {/*{showFooter && (
        <Grid item>
          <Footer />
        </Grid>
      )}*/}

      {/* Modal for Member Details */}
      <Modal 
        open={openModal} 
        onClose={handleCloseModal}
        aria-labelledby="member-details-modal"
        aria-describedby="member-details-description"
      >
        <Box>
          {selectedAddress && selectedMember && (
            <MemberDetails
              address={selectedAddress}
              compPersonCode={selectedMember.COMP_PERSON_CODE} 
              language={language} 
              memberCode={selectedMember.MEMBER_CODE}
              onClose={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
    </Grid>
  );
};

export default IndexPage;