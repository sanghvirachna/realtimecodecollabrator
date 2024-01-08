import React, { useState, useEffect ,useRef } from 'react'
import { useLocation , useNavigate ,useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from 'react-avatar';
import  toast  from 'react-hot-toast'
import CodeMirror from "react-codemirror";
import './Workspace.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for Java and C++
import 'codemirror/addon/edit/closebrackets.js';
import { initSocket } from './socket';

//react-avatar
//codemirror

const Workspace = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("")
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const workspaceId = useParams().id;
  const [connectedClients,setConnectedClients] = useState([]);

  useEffect(() => {
    
    const init = async () => {
      const handleErrors = (err) => {
        console.log(err)
        toast.error(err);
        navigate('/')
       }
       socketRef.current = await initSocket();
       socketRef.current.on('connect_error',(err) => handleErrors(err))
       socketRef.current.on('connect_failed',(err) => handleErrors(err))
       

       
       socketRef.current.emit('join', {
         workspaceId,
         username: location.state.username
       })
        socketRef.current.on('joined' ,({clients,username,socketId}) => {
         if(username !== location.state.username){
           toast.success(`${username} joined workspace`, {
             position: "top-center"
           })
         }
         setConnectedClients(clients)
         
        })
       socketRef.current.on('disconnected',({socketId,username}) => {
        toast.success(`${username} left workspace`, {
          position: "top-center"
        })
        setConnectedClients((prevClients) => {
          return prevClients.filter((client) => client.socketId !== socketId)
        })
       })
    }
    init()
 },[])

  useEffect(() => {
    switch (language) {
      case 'python':
        setCode("print('Hello, world!')");
        break;
      case 'java':
        setCode(
          `public class Main {
      public static void main(String[] args) {
              // Your code goes here
      }
}`
        );
        break;
      case 'cpp':
        setCode(
          `#include <iostream>
using namespace std;
int main() {
   // Your code goes here
   return 0;
}`
        );
        break;
      default:
        setCode("");
    }
  }, [language]);

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
  console.log(language)

  return (
    <>
      <CodeMirror
        key={code}
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          mode: getMode(language), theme: 'darcula', lineNumbers: true, autoCloseBrackets: true
        }}
      />


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
