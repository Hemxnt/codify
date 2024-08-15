import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Terminal from './components/terminal'
import FileTree from './components/tree'
import socket from './socket'

import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/theme-monokai'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import Navbar from './components/navbar'

function App() {
  const [fileTree, setFileTree]=useState({})
  const [selectedFile, setSelectedFile]=useState('')
  const [selectedFileContent, setSelectedFilecontent]=useState('')
  const [code, setCode] = useState('') 

  const isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const response = await fetch('http://localhost:9000/files')
    const result = await response.json()  
    setFileTree(result.tree)  
  }

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFilecontent(result.content);
  }, [selectedFile]);


  useEffect(() => {
    getFileTree()
  }, [])

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
  
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, [])
    

  return (
    <div className='playground-container'>
      <Navbar/>
      <div className='editor-container'>
        <div className='files'>
          <p>EXPLORER</p>
          <FileTree 
            onSelect={(path) => setSelectedFile(path)}
            tree={fileTree} 
          />
        </div>
        <div className='editor'>

          <p className='editor-header'>EDITOR</p>

          {selectedFile && 
          <p className='terminal-header'>
            {selectedFile.replaceAll('/',' > ')}{" "}
            {isSaved ? "Saved" : "Unsaved"}
          </p>}

          <AceEditor
            mode="html"
            theme="monokai"
            width= "100%"
            fontSize={14}
            value={code}
            onChange={(e) => setCode(e)}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
          />
        </div>
      </div>
      <div className='terminal-container' >
        <p>TERMINAL</p>
        <Terminal/>
      </div>
    </div>
  )
}

export default App
