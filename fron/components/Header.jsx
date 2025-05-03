import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: 'none' }}>
      <Toolbar>
        <DescriptionIcon sx={{ mr: 2, color: '#1976d2' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
          NotepadX
        </Typography>
        <Button color="inherit" sx={{ color: '#666', '&:hover': { backgroundColor: '#f0f0f0' } }}>
          Help
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;