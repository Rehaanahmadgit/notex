import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../context/FileSystemContext';
import { Save } from 'lucide-react';

import Breadcrumbs from './Breadcrumbs';
const Editor = ({ fileId, setSelectedFileId }) => {
  const { getFile, updateFileContent, getFilePath } = useFileSystem();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState([]);

  useEffect(() => {
    const loadFile = async () => {
      const loadedFile = await getFile(fileId);
      if (loadedFile) {
        setFile(loadedFile);
        setContent(loadedFile.content);
        const path = await getFilePath(fileId);
        setFilePath(path);
      }
    };
    loadFile();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [fileId, getFile, getFilePath]);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave(e.target.value);
    }, 1000);
  };

  const handleSave = async (contentToSave = content) => {
    if (!file) return;
    setIsSaving(true);
    await updateFileContent(fileId, contentToSave);
    setLastSaved(new Date());
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  if (!file) {
    return <div className="p-6 text-gray-500">File not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-4 py-2 flex items-center justify-between">
        <Breadcrumbs path={filePath} setSelectedFileId={setSelectedFileId} />
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {lastSaved && (
            <span>Last saved {lastSaved.toLocaleTimeString()}</span>
          )}
          <button
            className={`p-1.5 rounded-md ${isSaving ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'}`}
            onClick={() => handleSave()}
            title="Save"
          >
            <Save className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        className="flex-1 p-4 resize-none outline-none font-mono text-gray-800 bg-white"
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default Editor;