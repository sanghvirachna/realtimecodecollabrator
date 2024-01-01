import React,{ useState ,useEffect} from 'react'
import axios from 'axios';
import Avatar from 'react-avatar';
import CodeMirror  from "react-codemirror";
import './Workspace.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for Java and C++
import 'codemirror/addon/edit/closebrackets.js'; 

//react-avatar
//codemirror

const Workspace = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  const [input, setInput] = useState("")
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
        key = {code}
        value={code}
        onChange={(value) => setCode(value)}
        options={{ mode: getMode(language), theme: 'darcula', lineNumbers: true,    autoCloseBrackets: true
      }}
      />
      
      
     <Avatar name="Wim Mostmans" size="150" textSizeRatio={1.75}  round="50%"/>

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
