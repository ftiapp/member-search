
import React, { useState, useRef, useEffect } from 'react';
import { Home, Globe } from 'lucide-react';
import SearchBar from './searchbar';
import { Member } from './type';
import axios from 'axios';
import { AppBar, Toolbar, Button, Grid, IconButton, InputBase } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import { Search as SearchIcon } from 'lucide-react';
import { Menu as MenuIcon } from '@mui/icons-material';
interface HeaderProps {
  onMenuClick: () => void;
}

interface HeaderProps {
  onMenuClick: () => void; // ฟังก์ชันที่ส่งเข้ามาเพื่อเปิดเมนู
}


