import React from 'react';
import { FileText, FolderPlus, FilePlus } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';

const NoFileSelected = () => {
  const { createFile, createFolder } = useFileSystem();

  const handleCreateFile = async () => {
    const name = prompt('Enter file name');
    if (name && name.trim()) {
      await createFile(name.trim(), null, '');
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name');
    if (name && name.trim()) {
      await createFolder(name.trim(), null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <FileText className="h-16 w-16 text-blue-200 mb-4" />
      <h2 className="text-xl font-medium text-gray-700 mb-2">No file selected</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Select a file from the sidebar or create a new file to get started.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleCreateFile}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FilePlus className="h-4 w-4 mr-2" />
          New File
        </button>
        <button
          onClick={handleCreateFolder}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </button>
      </div>
    </div>
  );
};

export default NoFileSelected;