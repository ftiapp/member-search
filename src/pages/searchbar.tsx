'use client';
import { useState } from 'react';
import axios from 'axios'; // Assuming you use axios for HTTP requests
import styles from './SearchBar.module.css'; 
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px', // ทำให้กรอบกลม
    '& fieldset': {
      borderColor: '#3f51b5', // สีกรอบของ TextField
    },
    '&:hover fieldset': {
      borderColor: '#1e88e5', // สีกรอบเมื่อวางเมาส์
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1e88e5', // สีกรอบเมื่อ TextField ถูกเลือก
    },
  },
});

// สไตล์สำหรับ SearchBar Container
const SearchBarContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%', // ให้ครอบคลุมความกว้างทั้งหมด
  maxWidth: '1500px', // กำหนดความกว้างสูงสุดเป็น 900px
  margin: '20px auto', // กำหนดให้กลางหน้าจอ
  padding: '10px', // เพิ่ม padding
});

interface SearchBarProps {
  onSearch: (query: string) => void;  // Function to handle search queries
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query);  // ส่งค่า query กลับไปยังฟังก์ชันที่รับเข้ามา
      setQuery(''); // เคลียร์ค่าหลังการค้นหา
    } else {
      console.error('Query is empty');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(); // ค้นหาหากกด Enter
    }
  };

  return (
    <SearchBarContainer>
      <StyledTextField
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // อัปเดตค่า query
        onKeyPress={handleKeyPress} // ฟังก์ชันสำหรับกดปุ่ม Enter
        placeholder="ค้นหารายการ..." // คำแนะนำในช่องค้นหา
        variant="outlined" // ใช้ variant แบบ outlined
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth // ทำให้ TextField กว้างเต็มพื้นที่
        style={{ height: '50px', width: '600px' }} // เพิ่มความสูงให้กับ TextField
      />
    </SearchBarContainer>
  );
};

export default SearchBar;