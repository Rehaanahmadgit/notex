import React, { useState } from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import NoFileSelected from './components/NoFileSelected';
import './App.css';
import 'antd/dist/reset.css';
import  "./index.css";
const App = () => {
  const [selectedFileId, setSelectedFileId] = useState(null);

  return (
    <FileSystemProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar selectedFileId={selectedFileId} setSelectedFileId={setSelectedFileId} />
          <main className="flex-1 bg-gray-50">
            {selectedFileId ? (
              <Editor fileId={selectedFileId} setSelectedFileId={setSelectedFileId} />
            ) : (
              <NoFileSelected />
            )}
          </main>
        </div>
      </div>
    </FileSystemProvider>
  );
};

export default App;