'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './searchbar'; // Assuming this is the correct path
import MemberList from './memberList'; // Assuming this is the correct path
import { Member } from './type';
import MemberComponent from './member';
import {Address} from './type';
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

const IndexPage: React.FC = () => {
  // State management
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberTypeCode, setMemberTypeCode] = useState<string>('');
  const [tempMemberTypeCode, setTempMemberTypeCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [provinces, setProvinces] = useState<Array<{ ADDR_PROVINCE_NAME: string }>>([]);
  const [provincegroup, setProvinceGroups] = useState<Array<{ MEMBER_GROUP_NAME: string }>>([]);
  const [industrygroup,setIndustryGroups]=useState<Array<{MEMBER_GROUP_NAME: string }>>([]);
  const [tempProvince, setTempProvince] = useState<string>('');
  const itemsPerPage = 6;
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
    fontFamily: 'Prompt',
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
  const performSearch = async (query?: string) => {
    setSearching(true);
    setLoading(true);
  
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (tempMemberTypeCode) params.append('member_type_code', tempMemberTypeCode);
      if (tempProvince) params.append('province', tempProvince);
      if (tempIndustryGroup) params.append('industry_group_name', tempIndustryGroup);
      if (tempProvinceGroup) params.append('province_group_name', tempProvinceGroup);
  
      const response = await axios.get(`/api/search?${params.toString()}`);
      const results: Member[] = response.data;
  
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
    await performSearch(query);
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
  const fetchReportData = async () => {
    try {
      const response = await axios.get('/api/industry-group-counts'); // เรียก API
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  // ฟังก์ชันเปิด Modal และโหลดข้อมูล
  const handleOpenReportModal = async () => {
    await fetchReportData(); // โหลดข้อมูลจาก API
    setIsReportModalOpen(true); // เปิด Modal
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false); // ปิด Modal
  };


  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <Grid container direction="column" alignItems="center" spacing={2} style={{ fontFamily: 'Prompt, sans-serif' }}>
      {/* Background Image */}
      <img
        src="/Background.png"
        alt="Background Image"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Logo */}
      <Grid item>
        <img
          src="/logo-membersearch.png"
          alt="Logo"
          style={{
            width: '400px',
            marginTop: '30px',
            marginBottom:'-20px'
          }}
        />
      </Grid>

      {/* Burger Menu Icon */}
      <IconButton 
        onClick={() => toggleDrawer(true)} 
        style={{ 
          color: 'black',
          backgroundColor: 'gray',
          borderRadius: '50%',
          padding: '10px',
          position: 'absolute', 
          top: '20px', 
          right: '20px' 
        }}
      >
        <MenuIcon style={{ color: 'black' }} />
      </IconButton>

      {/* SearchBar */}
      <Grid item>
        <SearchBar onSearch={handleSearch} />
      </Grid>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '20%',
            backgroundColor: 'white',
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
            style={{ marginBottom: '20px', marginTop: '20px', color: '#003366' }}>
            ตัวกรอง
          </Typography>
          
          <Box sx={{ borderBottom: '2px solid lightgray', margin: '0 20px', width: 'calc(100% - 40px)', marginBottom: '20px' }} />

          {/* Member Type Dropdown */}
          <Typography variant="body1" align="left" fontFamily='Prompt' 
            style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}>
            ประเภทสมาชิก
          </Typography>
          <Autocomplete
            options={memberTypes}
            getOptionLabel={(option) => option.label}
            value={memberTypes.find(type => type.value === tempMemberTypeCode) || null}
            sx={{ width: '80%', marginLeft: '30px', marginBottom: '20px' }}
            renderInput={(params) => <TextField {...params} label="เลือกประเภทสมาชิก" />}
            onChange={handleMemberTypeChange}
          />

          {/* Province Dropdown */}
          <Typography variant="body1" align="left" fontFamily='Prompt' 
            style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}>
            ที่ตั้งสมาชิก
          </Typography>
          <Autocomplete
            options={provinces}
            getOptionLabel={(option) => option.ADDR_PROVINCE_NAME}
            value={provinces.find(p => p.ADDR_PROVINCE_NAME === tempProvince) || null}
            sx={{ width: '80%', marginLeft: '30px', marginBottom: '20px' }}
            renderInput={(params) => <TextField {...params} label="เลือกจังหวัด" />}
            onChange={(event, value) => setTempProvince(value ? value.ADDR_PROVINCE_NAME : '')}
          />
<Typography variant="body1" align="left" fontFamily='Prompt' style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}>
  สมาชิกกลุ่มอุตสาหกรรม
</Typography>
<Autocomplete
  options={industrygroup}  // ใช้ industryGroups state ที่มีอยู่
  getOptionLabel={(option) => option.MEMBER_GROUP_NAME}  // แสดง MEMBER_GROUP_NAME
  value={industrygroup.find((group) => group.MEMBER_GROUP_NAME === tempIndustryGroup) || null}  // ผูกค่ากับ tempIndustryGroup
  sx={{ width: '80%', marginLeft: '30px', marginBottom: '20px' }}
  renderInput={(params) => <TextField {...params} label="เลือกกลุ่มอุตสาหกรรม" />}
  onChange={(event, value) => {
    setTempIndustryGroup(value ? value.MEMBER_GROUP_NAME : '');  // อัพเดต state
  }}
/>

<Grid container direction="column" alignItems="center" spacing={1} sx={{ fontFamily: 'Prompt' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1, width: '100%' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#003366',
            color: 'white',
            fontFamily: 'Prompt',
            width: '60%',
            marginTop: 1,
            '&:hover': { backgroundColor: '#002244' },
          }}
          onClick={handleOpenReportModal}
        >
          รายงานสรุปยอดสมาชิก
        </Button>
      </Box>

      <Modal
        open={isReportModalOpen}
        onClose={handleCloseReportModal}
        aria-labelledby="report-modal-title"
        aria-describedby="report-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleCloseReportModal}
            sx={{ position: 'absolute', right: 10, top: 10 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <Typography
            id="report-modal-title"
            variant="h6"
            align="center"
            sx={{ marginBottom: 1, fontFamily: 'Prompt' }}
          >
            รายงานสรุปยอดสมาชิก
          </Typography>

          {loading ? (
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
                    <TableCell align="center">กลุ่มอุตสาหกรรม</TableCell>
                    <TableCell align="center">สามัญนิติบุคคล (สน.)</TableCell>
                    <TableCell align="center">สามัญสมาคมการค้า (สส.)</TableCell>
                    <TableCell align="center">สบทบนิติบุคคล (ทน.)</TableCell>
                    <TableCell align="center">สมทบบุคคลธรรมดา (ทบ.)</TableCell>
                    <TableCell align="center">รวม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row, index) => (
                    <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                      borderBottom:
                        index === reportData.length - 1
                          ? '3px solid black' // Thicker bottom border for the last row
                          : '1px solid rgba(224, 224, 224, 1)',
                      '& td': {
                        fontWeight: index === reportData.length - 1 ? 'bold' : 'normal', // Apply bold only to the last row
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
    </Grid>
    <Typography variant="body1" align="left" fontFamily='Prompt' style={{ color: '#003366', marginLeft: '30px', marginBottom: '10px' }}>
  สมาชิกกลุ่มจังหวัด
</Typography>
<Autocomplete
  options={provincegroup}  // ใช้ provinceGroups state ที่มีอยู่
  getOptionLabel={(option) => option.MEMBER_GROUP_NAME}  // แสดง MEMBER_GROUP_NAME
  value={provincegroup.find((group) => group.MEMBER_GROUP_NAME === tempProvinceGroup) || null}  // ผูกค่ากับ tempProvinceGroup
  sx={{ width: '80%', marginLeft: '30px', marginBottom: '20px' }}
  renderInput={(params) => <TextField {...params} label="เลือกกลุ่มจังหวัด" />}
  onChange={(event, value) => {
    setTempProvinceGroup(value ? value.MEMBER_GROUP_NAME : '');  // อัพเดต state
  }}
/>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
      }}
    >
      <Button
        variant="contained"
        style={{
          backgroundColor: '#003366',  // พื้นหลังสีกรม
          color: 'white',              // อักษรสีขาว
          fontFamily: 'Prompt',        // ฟอนต์ Prompt
          width: '80%',
        }}
        onClick={() => {
          console.log('Report clicked');
        }}
      >
        รายงานสรุปยอดสมาชิก
      </Button>
    </Box>
          {/* Search and Clear buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 0' }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#003366',
                color: 'white',
                fontFamily: 'Prompt',
                width: '40%',
              }}
              onClick={() => {
                performSearch();
                toggleDrawer(false);
              }}
            >
              ค้นหาข้อมูล
            </Button>

            <Button
              variant="contained"
              style={{
                backgroundColor: '#003366',
                color: 'white',
                fontFamily: 'Prompt',
                width: '40%',
              }}
              onClick={handleClearFilters}
            >
              ล้างตัวกรอง
            </Button>
          </Box>
        </Box>
      </Drawer>

     {/* Search Results Count */}
{!initialLoad && !searching && searchResults.length > 0 && (
  <Grid 
    item 
    style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginRight: '25px' }}
  >
    {/* Icon with gray circle and white 'i' */}
    <InfoIcon
      sx={{
        backgroundColor: 'gray',
        color: 'white',
        borderRadius: '50%',
        fontSize: '20px',
        marginRight: '10px', // Space between icon and text
        padding: '1px',
      }}
    />

    <Typography
      variant="body1"
      style={{
        color: '#003691',
        fontFamily: language === 'TH' ? 'Prompt, sans-serif' : 'Inter, sans-serif',
        textAlign: 'left',
      }}
    >
      {`ผลการค้นหาทั้งหมด `}
      <span style={{ marginRight: '10px' }}>{/* เพิ่มระยะห่างตรงนี้ */}
        <span style={{ fontWeight: 'bold', color: 'red' }}>
          {searchResults.length}
        </span> รายการ
      </span>
    </Typography>
  </Grid>
)}

{/* Member Type Counts with 2 cm spacing */}
{!initialLoad && !searching && (
  <Grid
    container
    rowSpacing={1} // Adjust vertical spacing between rows
    columnSpacing={5} // 4 units spacing, equivalent to 2 cm in Material-UI spacing
    style={{ marginTop: '-1px', marginRight: '5px', marginLeft: '2px' }} // Adjust margin to fit better
  >
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
        }}
      >
        {`จำนวนสมาชิก สน. `}
        <span style={{ fontWeight: 'bold', color: 'red' ,padding:'10px'}}>
          {`"${memberTypeCounts['11']}"`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
        }}
      >
        {`จำนวนสมาชิก สส. `}
        <span style={{ fontWeight: 'bold', color: 'red',padding:'10px' }}>
          {`"${memberTypeCounts['12']}"`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
        }}
      >
        {`จำนวนสมาชิก ทน. `}
        <span style={{ fontWeight: 'bold', color: 'red',padding:'14px' }}>
          {`"${memberTypeCounts['21']}"`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>
    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Typography
        variant="body1"
        style={{
          fontFamily: 'Prompt, sans-serif',
          color: '#003691',
          margin: 0,
          padding: 0,
        }}
      >
        {`จำนวนสมาชิก ทบ. `}
        <span style={{ fontWeight: 'bold', color: 'red',padding:'10px' }}>
          {`"${memberTypeCounts['22']}"`}
        </span>
        {` ราย`}
      </Typography>
    </Grid>
  </Grid>
)}

      {/* Search Results */}
      <Grid item>
        {searching && <LogoSpinner loading={searching} />}
        {!initialLoad && !searching && searchResults.length > 0 && (
          <MemberList 
            members={getPaginatedData()} 
            language={language} 
            onMemberClick={handleMemberClick}
          />
        )}
      </Grid>

      {/* Pagination */}
      <Grid item>
        {!initialLoad && !searching && searchResults.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </Grid>

      {/* Footer */}
      <Grid item>
        <Footer />
      </Grid>

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