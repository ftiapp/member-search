'use client';
import { useState } from 'react';
import axios from 'axios'; // Assuming you use axios for HTTP requests
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import {TextField,Select,MenuItem,InputAdornment, FormControl,} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onSearch: (query: string, filter: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  language: 'TH' | 'EN';
}

const SearchBarContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '100%',
  marginLeft: '20px',
  padding: '10px',
  gap: '16px',
  marginTop: '15px',
  '@media (max-width: 480px)': {
    gap: '8px',
  },
});

const StyledTextField = styled(TextField)({
  flexGrow: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    fontSize: '0.9rem',
    '& fieldset': {
      borderColor: '#3f51b5',
    },
    '&:hover fieldset': {
      borderColor: '#1e88e5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1e88e5',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontFamily: 'Prompt, sans-serif',
  },
  '@media (max-width: 480px)': {
    fontSize: '0.8rem',
  },
});

const StyledMenuProps = {
  PaperProps: {
    style: {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '0.9rem',
    },
  },
};

const StyledSelect = styled(Select)({
  minWidth: '100px',
  borderRadius: '25px',
  fontSize: '0.9rem',
  fontFamily: 'Prompt, sans-serif',
  background: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3f51b5',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1e88e5',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1e88e5',
  },
  '@media (max-width: 480px)': {
    minWidth: '60px',
    fontSize: '0.8rem',
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontFamily: 'Prompt, sans-serif !important',
  fontSize: '0.9rem',
  '@media (max-width: 480px)': {
    fontSize: '0.8rem',
  },
});

const placeholderText: Record<string, { TH: string; EN: string }> = {
  all: { TH: 'ค้นหาทั้งหมด', EN: 'All' },
  member_code: { TH: 'รหัสสมาชิก', EN: 'Member Code' },
  company_name: { TH: 'ชื่อบริษัท', EN: 'Company Name' },
  product: { TH: 'ผลิตภัณฑ์', EN: 'Product' },
  location: { TH: 'ที่ตั้งบริษัท', EN: 'Location' },
  province_group: { TH: 'สภาจังหวัด', EN: 'Province Group' },
  industry_group: { TH: 'กลุ่มอุตสาหกรรม', EN: 'Industry Group' },
};

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  selectedFilter,
  setSelectedFilter,
  language,
}) => {
  const isSmallScreen = useMediaQuery('(max-width:576px)');
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, selectedFilter);
    } else {
      console.error('Query is empty');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSearch();
  };

  const handleClear = () => onQueryChange('');

  return (
    <SearchBarContainer>
      <FormControl>
        <StyledSelect
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as string)}
          displayEmpty
          MenuProps={StyledMenuProps}
        >
          {Object.keys(placeholderText).map((key) => (
            <StyledMenuItem key={key} value={key}>
              {placeholderText[key][language]}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>

      <StyledTextField
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={`ค้นหาด้วย${placeholderText[selectedFilter]?.[language] || ''}`}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {query && (
                <CloseIcon
                  style={{ cursor: 'pointer', marginRight: '8px' }}
                  onClick={handleClear}
                />
              )}
              <SearchIcon style={{ cursor: 'pointer' }} onClick={handleSearch} />
            </InputAdornment>
          ),
        }}
      />
    </SearchBarContainer>
  );
};


export default SearchBar;