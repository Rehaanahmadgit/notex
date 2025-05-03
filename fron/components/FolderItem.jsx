import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, MoreVertical, Edit, Trash, FilePlus, FolderPlus } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';
import FileItem from './FileItem';

const FolderItem = ({ folder, selectedFileId, setSelectedFileId }) => {
  const { fileSystem, deleteFolder, createFile, createFolder, renameFolder } = useFileSystem();
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const childFolders = Object.values(fileSystem.folders)
    .filter(f => f.parentId === folder.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  const childFiles = Object.values(fileSystem.files)
    .filter(f => f.parentId === folder.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCreateFile = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const name = prompt('Enter file name');
    if (name && name.trim()) {
      const fileId = await createFile(name.trim(), folder.id, '');
      setSelectedFileId(fileId);
    }
  };

  const handleCreateFolder = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const name = prompt('Enter folder name');
    if (name && name.trim()) {
      await createFolder(name.trim(), folder.id);
      setExpanded(true);
    }
  };

  const handleRename = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    const name = prompt('Enter new folder name');
    if (name && name.trim() && name !== folder.name) {
      await renameFolder(folder.id, name.trim());
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (confirm(`Are you sure you want to delete the folder '${folder.name}' and all its contents?`)) {
      await deleteFolder(folder.id);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <div
        className="flex items-center py-1 px-3 hover:bg-gray-100 cursor-pointer relative group"
        onClick={toggleExpanded}
      >
        <div className="mr-1">
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
          )}
        </div>
        <Folder className="h-4 w-4 text-blue-500 mr-1.5" />
        <span className="text-sm text-gray-700 truncate flex-1">{folder.name}</span>
        <button
          className="p-1 text-gray-400 hover:text-gray-600 hidden group-hover:block"
          onClick={toggleMenu}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48">
            <button
              className="flex items-center w-full px-4 py-1.5 text-sm text-left hover:bg-gray-100"
              onClick={handleCreateFile}
            >
              <FilePlus className="h-3.5 w-3.5 mr-2 text-gray-500" />
              New File
            </button>
            <button
              className="flex items-center w-full px-4 py-1.5 text-sm text-left hover:bg-gray-100"
              onClick={handleCreateFolder}
            >
              <FolderPlus className="h-3.5 w-3.5 mr-2 text-gray-500" />
              New Folder
            </button>
            <button
              className="flex items-center w-full px-4 py-1.5 text-sm text-left hover:bg-gray-100"
              onClick={handleRename}
            >
              <Edit className="h-3.5 w-3.5 mr-2 text-gray-500" />
              Rename
            </button>
            <button
              className="flex items-center w-full px-4 py-1.5 text-sm text-left hover:bg-gray-100 text-red-600"
              onClick={handleDelete}
            >
              <Trash className="h-3.5 w-3.5 mr-2 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
      {expanded && (
        <div className="ml-4 pl-2 border-l border-gray-200">
          {childFolders.map(childFolder => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              selectedFileId={selectedFileId}
              setSelectedFileId={setSelectedFileId}
            />
          ))}
          {childFiles.map(file => (
            <FileItem
              key={file.id}
              file={file}
              selectedFileId={selectedFileId}
              setSelectedFileId={setSelectedFileId}
            />
          ))}
          {childFolders.length === 0 && childFiles.length === 0 && (
            <div className="py-1 px-3">
              <span className="text-xs text-gray-400 italic">Empty folder</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderItem;