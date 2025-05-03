import React, { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Description as FileIcon, MoreVert as MoreVerticalIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFileSystem } from '../context/FileSystemContext';

const FileItem = ({ file, selectedFileId, setSelectedFileId }) => {
  const { renameFile, deleteFile } = useFileSystem();
  const [anchorEl, setAnchorEl] = useState(null);
  const isSelected = selectedFileId === file.id;

  const handleClick = () => {
    setSelectedFileId(file.id);
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    handleMenuClose();
    const name = prompt('Enter new file name', file.name);
    if (name && name.trim() && name !== file.name) {
      renameFile(file.id, name.trim());
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (confirm(`Are you sure you want to delete the file '${file.name}'?`)) {
      deleteFile(file.id);
      if (selectedFileId === file.id) {
        setSelectedFileId(null);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        px: 3,
        bgcolor: isSelected ? '#e3f2fd' : 'transparent',
        color: isSelected ? '#1976d2' : '#333',
        '&:hover': {
          bgcolor: isSelected ? '#e3f2fd' : '#f5f5f5',
          cursor: 'pointer'
        }
      }}
      onClick={handleClick}
    >
      <FileIcon sx={{ fontSize: 16, color: isSelected ? '#1976d2' : '#666', mr: 1.5 }} />
      <Typography sx={{ fontSize: '0.875rem', flex: 1, truncate: true }}>
        {file.name}
      </Typography>
      <IconButton
        sx={{
          p: 1,
          color: '#666',
          visibility: 'hidden',
          '&:hover': { bgcolor: '#e0e0e0' },
          '.MuiBox-root:hover &': { visibility: 'visible' }
        }}
        onClick={handleMenuOpen}
      >
        <MoreVerticalIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleRename}>
          <EditIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#d32f2f' }}>
          <DeleteIcon sx={{ fontSize: 16, mr: 1, color: '#d32f2f' }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FileItem;