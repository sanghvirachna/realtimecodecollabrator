import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike'; // for Java and C++
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import 'codemirror/theme/blackboard.css';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import './Workspace.css';
import io from 'socket.io-client';
import toast from 'react-hot-toast'


const Workspace = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const [code, setCode] = useState('console.log("Hello, world!");');
  const [mode, setMode] = useState('javascript');
  const { workspaceId, username } = location.state;


  useEffect(() => {
    const socketIOClient = io('http://localhost:8080'); // Replace with your server URL
    setSocket(socketIOClient);

    // Emit 'join' event with username and workspaceId
    socketIOClient.emit('join', { username, workspaceId });
    socketIOClient.on('joined', (username) => {
      toast(`${username} joined the workspace`, {
        position: "top-center"
      });
    });
    socketIOClient.on('left', (username) => {
      toast(`${username} left the workspace`, {
        position: "top-center"
      });
    });
    socketIOClient.on('codeChange', newCode => {
      setCode(newCode);
    });
    socketIOClient.on('languageChange', newLanguage => {
      setMode(newLanguage);
    });
    // Clean up function to disconnect when the component is unmounted
    return () => {
      socketIOClient.disconnect();
    };

  }, [])
 useEffect(() => {
  switch (mode) {
    case 'javascript':
      setCode('console.log("Hello, world!");');
      break;
    case 'python':
      setCode('print("Hello, world!")');
      break;
    case 'java':
      setCode('public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}');
      break;
    case 'c++':
      setCode('#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!";\n  return 0;\n}');
      break;
    default:
      setCode('');
  }
 },[mode])
  console.log(code);
  const handleLanguageChange = (event) => {
    const language = event.target.value;
    let code;
    switch (language) {
      case 'javascript':
        code = 'console.log("Hello, world!");';
        break;
      case 'python':
        code = 'print("Hello, world!")';
        break;
      case 'java':
        code = 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}';
        break;
      case 'c++':
        code = '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!";\n  return 0;\n}';
        break;
      default:
        code = '';
    }
    setMode(language);
    setCode(code);
    socket.emit('languageChange', language); // Emit 'languageChange' event
  };
  return (
    <div className="workspace">
      <select onChange={handleLanguageChange}  value={mode}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c++">C++</option>
      </select>

      <Button
        variant="contained"
        style={{ backgroundColor: 'red', color: 'white' }}
        onClick={() => {
          socket.emit('leave', { username, workspaceId });
          navigate('/')
        }}
      >
        Leave Workspace
      </Button>

      <Tooltip title="Copy Workspace ID" arrow>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FileCopyIcon />}
          onClick={() => {
            navigator.clipboard.writeText(workspaceId)
              .then(() => {
                toast('Workspace ID copied to clipboard', {
                  position: "top-center"
                });
              })
              .catch(err => console.error('Could not copy text: ', err));
          }}
          className="copy-button"
        >
          Copy Workspace Id
        </Button>
      </Tooltip>
      <CodeMirror
        value={code}
        options={{
          lineNumbers: true,
          theme: 'blackboard',
          mode: mode === 'java' ? 'text/x-java' : mode === 'c++' ? 'text/x-c++src' : mode,
          extraKeys: { 'Ctrl-Space': 'autocomplete' },
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        }}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
          socket.emit('codeChange', value);
        }}
      />
    </div>
  );
};

export default Workspace;