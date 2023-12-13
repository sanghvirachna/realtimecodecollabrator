const express = require('express');
const cors = require('cors');
const app = express();
const {runCode }= require('./runCode.js');

app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post('/run', async (req,res) => {
    try{
        const {language,code} = req.body;
        const output = await runCode(language,code);
        res.json({language,code,output})
    }catch(error){
        res.json({message:error.message})
    }
})

app.listen(8080,() => {
    console.log("Server started on port 8080")
})