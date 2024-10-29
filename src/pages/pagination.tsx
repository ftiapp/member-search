
import React from 'react';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ArrowBack, ArrowForward, FirstPage, LastPage } from '@mui/icons-material'; // นำเข้าไอคอน
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
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null; // ไม่แสดงหากมีเพียง 1 หน้า
  }

  return (
    <nav
      style={{
        backgroundColor: '#bebebe',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)', // จัดกึ่งกลางแนวนอน
        zIndex: 1000,
      }}
    >
      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        boundaryCount={2}
        siblingCount={2}
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{
              first: FirstPage, // กำหนดไอคอนหน้าแรก
              last: LastPage,   // กำหนดไอคอนหน้าสุดท้าย
              previous: ArrowBack, // ไอคอนย้อนกลับ
              next: ArrowForward,  // ไอคอนถัดไป
            }}
            sx={{
              borderRadius: '10px',
              padding: '10px',
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1565c0',
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
  );
};

export default Pagination;