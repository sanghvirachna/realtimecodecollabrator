import React, { useRef, useEffect,useState } from 'react'
import CodeMirror from "react-codemirror";
import './Workspace.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for Java and C++
import 'codemirror/addon/edit/closebrackets.js';


const CodeEditor = ({ language,socket ,workspaceId }) => {
  const [code, setCode] = useState("..");
  const editorRef = useRef(null);
  //   useEffect(() => {
  //     switch (language) {
  //       case 'python':
  //         setCode("print('Hello, world!')");
  //         break;
  //       case 'java':
  //         setCode(
  //           `public class Main {
  //       public static void main(String[] args) {
  //               // Your code goes here
  //       }
  // }`
  //         );
  //         break;
  //       case 'cpp':
  //         setCode(
  //           `#include <iostream>
  // using namespace std;
  // int main() {
  //    // Your code goes here
  //    return 0;
  // }`
  //         );
  //         break;
  //       default:
  //         setCode("");
  //     }
  //   }, [language]);
  useEffect(() => {
    console.log('Socket changed');
    if (socket) {
      socket.on('code-changed', ({code}) => {
        if(code != null){
          console.log(code)
          if(editorRef.current){
            editorRef.current.getCodeMirror().setValue(code)
          }
          setCode(code)
        }
       
      });
    }
  }, [socket]);

  const getMode = (language) => {
    switch (language) {
      case 'python':
        return 'python';
      case 'java':
        return 'text/x-java';
      case 'cpp':
        return 'text/x-c++src';
      default:
        return 'python';
    }
  };
  const handleEditorChange = (code) => {
    if (socket) {
      console.log('Socket is initialized');
      if (socket.connected) {
        console.log('Socket is connected');
        console.log('Emitting code-changed event');
        socket.emit('code-changed', {
          workspaceId,code,
        });
      } else {
        console.log('Socket is not connected');
      }
    } else {
      console.log('Socket is not initialized');
    }
  };
  return (
    <div>
      <CodeMirror
        options={{
          mode: getMode(language), theme: 'darcula', lineNumbers: true, autoCloseBrackets: true
        }} ref={editorRef}   value={code}  onChange={handleEditorChange} 
      />

    </div>
  )
}

export default CodeEditor