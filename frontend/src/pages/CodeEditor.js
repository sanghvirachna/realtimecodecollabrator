import React, { useRef, useEffect ,useState} from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/closebrackets.js';

const CodeEditor = ({ language, socket, workspaceId ,connectedClients ,onCodeChange}) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(''); // Add this line
  useEffect(() => {
    // console.log('Connected Clients changed:', connectedClients);
    // // Handle the updated connectedClients as needed
    // For example, you can update the UI or perform other actions
  }, [connectedClients]);
  useEffect(() => {
    // console.log('Socket changed');
    if (socket) {
      socket.on('code-changed', ({ code }) => {
        if (code != null && editorRef.current) {
          // Get CodeMirror instance and setValue directly
          const cmInstance = editorRef.current.getCodeMirror();
          const cursorPos = cmInstance.getCursor();
          cmInstance.setValue(code);
          // Set cursor to the end of the content
          cmInstance.setCursor(cursorPos);
          setCode(code); // Add this line

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
  
  const handleEditorChange = (newCode) => {
    if (socket && socket.connected) {
      // console.log('Emitting code-changed event');
      socket.emit('code-changed', {
        workspaceId,
        code: newCode,
        connectedClients
      });
      setCode(code); // Add this line
      onCodeChange(newCode); // Add this line

    }
  };
  return (
    <div>
      <CodeMirror
        options={{
          mode: getMode(language),
          theme: 'darcula',
          lineNumbers: true,
          autoCloseBrackets: true,
        }}
        value=".." 
        ref={editorRef}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
