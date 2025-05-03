import React, { createContext, useContext, useState, useEffect } from 'react';
import httpClient from '../http-common';

// Types (using JSDoc for JavaScript type hints)

/** @typedef {{ id: string, name: string, content: string, parentId: string | null }} File */

/** @typedef {{ id: string, name: string, parentId: string | null }} Folder */

/** @typedef {{ files: { [key: string]: File }, folders: { [key: string]: Folder } }} FileSystem */

/**
 * @typedef FileSystemContextType
 * @property {FileSystem} fileSystem
 * @property {(name: string, parentId: string | null, content: string) => Promise<string>} createFile
 * @property {(name: string, parentId: string | null) => Promise<string>} createFolder
 * @property {(id: string, name: string) => Promise<void>} renameFile
 * @property {(id: string, name: string) => Promise<void>} renameFolder
 * @property {(id: string) => Promise<void>} deleteFile
 * @property {(id: string) => Promise<void>} deleteFolder
 * @property {(id: string, content: string) => Promise<void>} updateFileContent
 * @property {(id: string) => Promise<File | null>} getFile
 * @property {(id: string) => Promise<Folder | null>} getFolder
 * @property {(fileId: string) => Promise<{ id: string, name: string }[]>} getFilePath
 * @property {(term: string) => Promise<File[]>} searchFiles
 */

// Create context
const FileSystemContext = createContext(undefined);

// Provider component
export const FileSystemProvider = ({ children }) => {
  const [fileSystem, setFileSystem] = useState({ files: {}, folders: {} });

  // Fetch initial file system
  useEffect(() => {
    const fetchFileSystem = async () => {
      try {
        const response = await httpClient.get('');
        const { files, folders } = response.data;
        setFileSystem({
          files: files.reduce((acc, file) => ({ ...acc, [file.id]: file }), {}),
          folders: folders.reduce((acc, folder) => ({ ...acc, [folder.id]: folder }), {})
        });
      } catch (error) {
        console.error('Failed to fetch file system:', error);
      }
    };
    fetchFileSystem();
  }, []);

  const createFile = async (name, parentId, content) => {
    try {
      const response = await httpClient.post('/file', { name, parentId, content });
      const file = response.data;
      setFileSystem(prev => ({
        ...prev,
        files: { ...prev.files, [file.id]: file }
      }));
      return file.id;
    } catch (error) {
      console.error('Failed to create file:', error);
      throw error;
    }
  };

  const createFolder = async (name, parentId) => {
    try {
      const response = await httpClient.post('/folder', { name, parentId });
      const folder = response.data;
      setFileSystem(prev => ({
        ...prev,
        folders: { ...prev.folders, [folder.id]: folder }
      }));
      return folder.id;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  };

  const renameFile = async (id, name) => {
    try {
      await httpClient.put(`/file/${id}/rename`, { name });
      setFileSystem(prev => ({
        ...prev,
        files: { ...prev.files, [id]: { ...prev.files[id], name } }
      }));
    } catch (error) {
      console.error('Failed to rename file:', error);
      throw error;
    }
  };

  const renameFolder = async (id, name) => {
    try {
      await httpClient.put(`/folder/${id}/rename`, { name });
      setFileSystem(prev => ({
        ...prev,
        folders: { ...prev.folders, [id]: { ...prev.folders[id], name } }
      }));
    } catch (error) {
      console.error('Failed to rename folder:', error);
      throw error;
    }
  };

  const deleteFile = async (id) => {
    try {
      await httpClient.delete(`/file/${id}`);
      setFileSystem(prev => {
        const newFiles = { ...prev.files };
        delete newFiles[id];
        return { ...prev, files: newFiles };
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  };

  const deleteFolder = async (id) => {
    try {
      await httpClient.delete(`/folder/${id}`);
      setFileSystem(prev => {
        const newFolders = { ...prev.folders };
        const newFiles = { ...prev.files };
        delete newFolders[id];
        Object.keys(newFiles)
          .filter(fileId => newFiles[fileId].parentId === id)
          .forEach(fileId => delete newFiles[fileId]);
        return { folders: newFolders, files: newFiles };
      });
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw error;
    }
  };

  const updateFileContent = async (id, content) => {
    try {
      await httpClient.put(`/file/${id}/content`, { content });
      setFileSystem(prev => ({
        ...prev,
        files: { ...prev.files, [id]: { ...prev.files[id], content } }
      }));
    } catch (error) {
      console.error('Failed to update file content:', error);
      throw error;
    }
  };

  const getFile = async (id) => {
    if (!id) return null;
    if (fileSystem.files[id]) return fileSystem.files[id];
    try {
      const response = await httpClient.get(`/file/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get file:', error);
      return null;
    }
  };

  const getFolder = async (id) => {
    if (!id) return null;
    if (fileSystem.folders[id]) return fileSystem.folders[id];
    try {
      const response = await httpClient.get(`/folder/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get folder:', error);
      return null;
    }
  };

  const getFilePath = async (fileId) => {
    if (!fileId) return [];
    try {
      const response = await httpClient.get(`/file/${fileId}/path`);
      return response.data;
    } catch (error) {
      console.error('Failed to get file path:', error);
      return [];
    }
  };

  const searchFiles = async (term) => {
    try {
      const response = await httpClient.get(`/search?term=${encodeURIComponent(term)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search files:', error);
      return [];
    }
  };

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        createFile,
        createFolder,
        renameFile,
        renameFolder,
        deleteFile,
        deleteFolder,
        updateFileContent,
        getFile,
        getFolder,
        getFilePath,
        searchFiles
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

/**
 * Custom hook for using the file system context
 * @returns {FileSystemContextType}
 */
export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};