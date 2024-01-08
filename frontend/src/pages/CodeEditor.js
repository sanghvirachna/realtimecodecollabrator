import React from 'react'
import CodeMirror from "react-codemirror";
import './Workspace.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/darcula.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for Java and C++
import 'codemirror/addon/edit/closebrackets.js';


const CodeEditor = ({language}) => {
  
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
  return (
    <div>
      <CodeMirror
        options={{
          mode: getMode(language), theme: 'darcula', lineNumbers: true, autoCloseBrackets: true
        }}
      />
      
    </div>
  )
}

export default CodeEditor
