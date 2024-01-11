import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import axios from 'axios';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast'
import { initSocket } from './socket';


const Workspace = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("")
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const workspaceId = useParams().id;
  const [connectedClients, setConnectedClients] = useState([]);
  const [socket, setSocket] = useState(null);  // Add this line

  useEffect(() => {

    const init = async () => {
      const handleErrors = (err) => {
        console.log(err)
        toast.error(err);
        navigate('/')
      }
      socketRef.current = await initSocket();
      setSocket(socketRef.current)
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))



      socketRef.current.emit('join', {
        workspaceId,
        username: location.state.username
      })
      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        if (username !== location.state.username) {
          toast.success(`${username} joined workspace`, {
            position: "top-center"
          })
        }
        setConnectedClients(clients)
        console.log(clients)

      })
      socketRef.current.on('disconnected', ({ socketId, username }) => {
        toast.success(`${username} left workspace`, {
          position: "top-center"
        })
        setConnectedClients((prevClients) => {
          return prevClients.filter((client) => client.socketId !== socketId)
        })
      })
    }
    init()
    // return () => {
    //   socketRef.current.off('joined')
    //   socketRef.current.off('disconnected')
    //   socketRef.current.disconnect()
    // }
  }, [])
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleSubmit = async () => {
    console.log(code)
    const payload = {
      language: `${language}`,
      code,
      input
    }
    const { data } = await axios.post('http://localhost:8080/run', payload)
    if (data.output === undefined) {
      setOutput(data.message)
    } else {
      setOutput(data.output)
    }

    console.log(output)
  }
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }
  // console.log(language)
  // console.log(connectedClients)

  return (
    <>

      <CodeEditor language={language} socket={socket} workspaceId={workspaceId} connectedClients={connectedClients} onCodeChange={handleCodeChange} />
      {
        connectedClients.length > 0 && (
          connectedClients.map((client) => {
            return <Avatar name={client.username} size="100" textSizeRatio={1.75} round="50%" />
          })
        )
      }
      <select value={language} onChange={handleLanguageChange}>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <br></br>
      <input type="text" value={input} placeholder="Input" onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Run Code</button>
      <p>{output.output}</p>
    </>
  );
}

export default Workspace;
