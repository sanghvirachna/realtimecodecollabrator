import React,{useEffect, useState} from 'react'
import axios from 'axios';
//react-avatar
//codemirror

const Workspace = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");
  


  const handleSubmit = async () => {
    console.log(code)
    const payload = {
      language: `${language}`,
      code
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
      <textarea rows="20" cols="75" value={code} onChange={(e) => setCode(e.target.value)}></textarea>

      <select value={language} onChange={handleLanguageChange}>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <br></br>
      <button onClick={handleSubmit}>Run Code</button>
      <p>{output}</p>
    </>
  );
}

export default Workspace;
