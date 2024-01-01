const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const directoryPath = './codes';
const { exec } = require('child_process');
var compiler = require('compilex');
var compiler = require('compilex');
var options = {stats : true}; 
compiler.init(options);


// async function runCode(language, code) {
//     const uuid = uuidv4();
//     if(!fs.existsSync(directoryPath)){
//         fs.mkdirSync(directoryPath);    
//     }
//     const codeFile = `${uuid}.${language}`;
//     console.log(__dirname)
//     const filePath = path.join(__dirname, directoryPath, codeFile);
//     fs.writeFile(filePath,code,(err) => {
//         if(err) {
//             console.log(err);
//         }else{
//             console.log("File created successfully");
//         }
//     });

//     let run;
//     if (language === 'java') {
//         run = `java "${filePath}"`;
//     } else if (language === 'cpp') {
//         run = `g++ "${filePath}" -o "${filePath}.exe" && "${filePath}.exe"`;
//     } else if(language === 'python'){
//         run = `python "${filePath}"`;
//     }

//     let output = await new Promise((resolve, reject) => {
//         exec(run, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error: ${error.message}`);
//                 reject(error);
//                 return;
//             }
//             // Output of the shell command
//             console.log(`stdout: ${stdout}`);
//             resolve(stdout);
//         });
//     });
    
//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error(`Error deleting file: ${err.message}`);
//         } else {
//             console.log("File deleted successfully");
//         }
//     });

//     if (language === 'cpp') {
//         const exeFilePath = `${filePath}.exe`;
//         fs.unlink(exeFilePath, (err) => {
//             if (err) {
//                 console.error(`Error deleting .exe file: ${err.message}`);
//             } else {
//                 console.log(".exe file deleted successfully");
//             }
//         });
//     }

//     return output;
// }
async function runCode(language,code,input){

    if(language=="cpp"){
        var envData = { OS : "windows" , cmd : "g++"}; // (uses g++ command to compile )
        compiler.compileCPPWithInput(envData , code , input , function (data) {
            res.send(data);
        });
    }else if(language=="java"){
        var envData = { OS : "windows"}; 
        compiler.compileJavaWithInput( envData , code , input ,  function(data){
            res.send(data);
        });
    }else{
        var envData = { OS : "windows"}; 
        compiler.compilePythonWithInput( envData , code , input ,  function(data){
            res.send(data);
        });
    }
    return ""
}
async function runCode(language, code, input) {
    return new Promise((resolve, reject) => {
        var envData = { OS: "windows", cmd: "g++" }; // (uses g++ command to compile )

        if (language == "cpp") {
            compiler.compileCPPWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        } else if (language == "java") {
            envData = { OS: "windows" };
            compiler.compileJavaWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        } else {
            envData = { OS: "windows" };
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        }
    });
}
module.exports = {
    runCode
}