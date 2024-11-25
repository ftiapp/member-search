
import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ArrowBack, ArrowForward, FirstPage, LastPage } from '@mui/icons-material'; // นำเข้าไอคอน
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isSmallScreen = useMediaQuery('(max-width:576px)');
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null;
  }

  const theme = createTheme({
    typography: {
      fontFamily: 'Prompt, sans-serif',
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <nav
        style={{
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid #d1d1d1',
          display: 'inline-block',
        }}
      >
        <MuiPagination
          page={currentPage}
          count={totalPages}
          onChange={handlePageChange}
          variant="text"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
          showFirstButton={false}
          showLastButton={false}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              components={{
                previous: () => (
                  <span
                    style={{
                      color: currentPage === 1 ? '#d3d3d3' : '#043494',
                      pointerEvents: currentPage === 1 ? 'none' : 'auto',
                    }}
                  >
                    ก่อนหน้า
                  </span>
                ),
                next: () => (
                  <span
                    style={{
                      color: currentPage === totalPages ? '#d3d3d3' : '#043494',
                      pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                    }}
                  >
                    ถัดไป
                  </span>
                ),
              }}
              sx={{
                minWidth:  isSmallScreen ?'16p':'32px',
                height: isSmallScreen ?'16p':'32px',
                fontSize: isSmallScreen ? '0.6rem' : '0.875rem',
                fontFamily: 'Prompt, sans-serif',
                borderRadius: '4px',
                color: '#043494',
                border: '1px solid #d1d1d1',
                '&.Mui-selected': {
                  backgroundColor: '#043494',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#043494',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            />
          )}
        />
      </nav>
    </ThemeProvider>
  );
};

export default Pagination;