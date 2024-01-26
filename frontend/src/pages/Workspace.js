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
import Avatar from 'react-avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestoreIcon from '@mui/icons-material/Restore';
import PeopleIcon from '@mui/icons-material/People';
import Popover from '@mui/material/Popover';

const Workspace = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const [code, setCode] = useState('console.log("Hello, world!");');
  const [mode, setMode] = useState('javascript');
  const { workspaceId, username } = location.state;
  const [users, setUsers] = useState([]);
  const [codeChanged, setCodeChanged] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const socketIOClient = io('http://localhost:8080');
    setSocket(socketIOClient);

    // Emit 'join' event with username and workspaceId
    socketIOClient.emit('join', { username, workspaceId });
    socketIOClient.on('joined', (username) => {
      setUsers(prevUsers => [...prevUsers, username]);
      toast.success(`${username} joined the workspace`, {
        position: "top-center"
      });
    });
    socketIOClient.on('currentUsers', (currentUsers) => {
      setUsers(currentUsers);
    });
    socketIOClient.on('left', (username) => {
      toast.success(`${username} left the workspace`, {
        position: "top-center"
      });
      setUsers(prevUsers => prevUsers.filter(user => user !== username)); // Remove the user who left
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
    if (!codeChanged) {
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
    }
  }, [mode, codeChanged])

  console.log(code);
  const handleReset = () => {
    let defaultCode;
    switch (mode) {
      case 'javascript':
        defaultCode = 'console.log("Hello, world!");';
        break;
      case 'python':
        defaultCode = 'print("Hello, world!")';
        break;
      case 'java':
        defaultCode = 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}';
        break;
      case 'c++':
        defaultCode = '#include <iostream>\n\nint main() {\n  std::cout << "Hello, world!";\n  return 0;\n}';
        break;
      default:
        defaultCode = '';
    }
    setCode(defaultCode);
    setCodeChanged(false);
    socket.emit('reset', defaultCode); // Emit 'reset' event
  };
  
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
    setCodeChanged(false);
    socket.emit('languageChange', language); // Emit 'languageChange' event
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="workspace">
      <select onChange={handleLanguageChange} value={mode}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c++">C++</option>
      </select>
      <div className="avatars">
        {users.map(user => (
          <Avatar key={user} name={user} size="40" round={true} />
        ))}
      </div>
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
                toast.success('Workspace ID copied to clipboard', {
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
          setCodeChanged(true);
          socket.emit('codeChange', value);
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        style={{ borderColor: 'green', color: 'white',backgroundColor:'green' }}
        onClick={''}
      >
        <IconButton color="primary">
          <PlayArrowIcon style={{ color: 'white' }} />
        </IconButton>
        <Typography variant="button">Run</Typography>
      </Button>
      <Tooltip title="Reset" arrow>
      <IconButton onClick={handleReset}>
        <RestoreIcon style={{ color: 'grey' }}  />
      </IconButton>
    </Tooltip>
    <Button
      variant="contained"
      style={{ backgroundColor: '#8BC34A', color: 'white' }} // Light green color
      startIcon={<PeopleIcon />}
      onClick={handleClick}
    >
     {users.length} {/*  {numberOfCollaborators > 0 && <span>({numberOfCollaborators})</span>} */}
    </Button>
    <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '10px' }}>
          {users.map(user => (
            <div key={user}>
              <Avatar name={user} size="40" round={true} />
              <span>{user}</span>
            </div>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default Workspace;