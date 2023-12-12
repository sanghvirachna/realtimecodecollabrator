const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const directoryPath = './codes';

async function generateFile(language, code) {
    const uuid = uuidv4();
    if(!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath);    
    }
    const codeFile = `${uuid}.${language}`;
    const filePath = path.join(__dirname, directoryPath, codeFile);
    fs.writeFile(filePath,code,(err) => {
        if(err) {
            console.log(err);
        }else{
            console.log("File created successfully");
        }
    });
    const run = `g++ ${filePath} && -0 ${filePath}.exe && a.exe`
    return filePath;
}


module.exports = {
    generateFile
}