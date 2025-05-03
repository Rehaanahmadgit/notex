import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search files..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#666' }} />
          </InputAdornment>
        ),
        sx: { backgroundColor: '#f5f5f5', borderRadius: '4px' }
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;