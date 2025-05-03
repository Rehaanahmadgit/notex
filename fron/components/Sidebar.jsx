import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import { Search as SearchIcon, NoteAdd as FilePlusIcon, CreateNewFolder as FolderPlusIcon } from '@mui/icons-material';
import { useFileSystem } from '../context/FileSystemContext';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import SearchBar from './SearchBar';

const Sidebar = ({ selectedFileId, setSelectedFileId }) => {
  const { fileSystem, createFolder, createFile, searchFiles } = useFileSystem();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm) {
        const results = await searchFiles(searchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    performSearch();
  }, [searchTerm, searchFiles]);

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name');
    if (name && name.trim()) {
      createFolder(name.trim(), null);
    }
  };

  const handleCreateFile = () => {
    const name = prompt('Enter file name');
    if (name && name.trim()) {
      createFile(name.trim(), null, '').then(fileId => {
        setSelectedFileId(fileId);
      });
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  const renderItems = () => {
    if (showSearch && searchTerm) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#666', px: 3, mb: 1, display: 'block' }}>
            Search Results
          </Typography>
          <Box sx={{ pl: 3 }}>
            {searchResults.length > 0 ? (
              searchResults.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  selectedFileId={selectedFileId}
                  setSelectedFileId={setSelectedFileId}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#666', px: 3 }}>
                No results found
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    const rootItems = Object.values(fileSystem.folders)
      .filter(folder => folder.parentId === null)
      .sort((a, b) => a.name.localeCompare(b.name));

    const rootFiles = Object.values(fileSystem.files)
      .filter(file => file.parentId === null)
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <>
        {rootItems.map(folder => (
          <FolderItem
            key={folder.id}
            folder={folder}
            selectedFileId={selectedFileId}
            setSelectedFileId={setSelectedFileId}
          />
        ))}
        {rootFiles.map(file => (
          <FileItem
            key={file.id}
            file={file}
            selectedFileId={selectedFileId}
            setSelectedFileId={setSelectedFileId}
          />
        ))}
      </>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 256,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 256,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solidrgb(151, 13, 13)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#333' }}>
            Files
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={toggleSearch}
              sx={{
                p: 1,
                color: showSearch ? '#1976d2' : '#666',
                backgroundColor: showSearch ? '#e3f2fd' : 'transparent',
                '&:hover': { backgroundColor: showSearch ? '#bbdefb' : '#f0f0f0' },
              }}
              title="Search files"
            >
              <SearchIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={handleCreateFile}
              sx={{ p: 1, color: '#666', '&:hover': { backgroundColor: '#f0f0f0' } }}
              title="New file"
            >
              <FilePlusIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={handleCreateFolder}
              sx={{ p: 1, color: '#666', '&:hover': { backgroundColor: '#f0f0f0' } }}
              title="New folder"
            >
              <FolderPlusIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
        {showSearch && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {renderItems()}
      </Box>
    </Drawer>
  );
};

export default Sidebar;