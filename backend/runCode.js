const fs = require('fs');
const path = require('path');
var compiler = require('compilex');
var compiler = require('compilex');
var options = {stats : true}; 
compiler.init(options);

 const temp = path.join(__dirname, 'temp');

 const deleteFile = async () => {
    fs.readdir(temp , (err,files) =>{
        if(err) throw err;
        for(const file of files){
                fs.unlink(path.join(temp,file), err =>{
                        if(err) throw err;
                });
        }
 })
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
                    deleteFile();
                }
            });
        } else if (language == "java") {
            envData = { OS: "windows" };
            compiler.compileJavaWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                    deleteFile();
                }
            });
        } else {
            envData = { OS: "windows" };
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                    deleteFile();   
                }
            });
        }
    });
}
module.exports = {
    runCode
}