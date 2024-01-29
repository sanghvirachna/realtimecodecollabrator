const fs = require('fs');
const path = require('path');
var compiler = require('compilex');
var compiler = require('compilex');
var options = {stats : true}; 
compiler.init(options);

 const temp = path.join(__dirname, 'temp');


async function runCode(language, code, input) {
    return new Promise((resolve, reject) => {
        var envData = { OS: "windows",options:{timeout:1000}, cmd: "g++" }; // (uses g++ command to compile )

        if (language == "c++" || language == "c") {
            if(input==""){
                input = "0";
            }
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
        } else if (language == "csharp") {
            envData = { OS: "windows" };
            compiler.compileCSWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        } else if (language == "visualbasic") {
            envData = { OS: "windows" };
            compiler.compileVBWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            });
        }else {
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