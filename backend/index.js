const express = require('express');
const app = express();
const {generateFile}= require('./generateFile.js');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get('/',(req,res) => {
    res.send("Hello World")
})
app.post('/run', async (req,res) => {
    try{
        const {language,code} = req.body;
        const filePath = await generateFile(language,code);
        res.json({language,code,filePath})
    }catch(error){
        res.json({message:error.message})
    
    }
})

app.listen(8080,() => {
    console.log("Server started on port 8080")
})