const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const {runCode }= require('./runCode.js');

const app = express();
const server = http.createServer(app);
const io  = new Server(server);

const userMap ={}
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());


io.on('connection', (socket) => {
    console.log(socket.id + " connected");  
    socket.on('join',({workspaceId,username}) => {
        console.log(username + " joined " + workspaceId);
        userMap[socket.id] = username;
        console.log(userMap);
    })
})
app.post('/run', async (req, res) => {
    try {
        const { language, code, input } = req.body;
        const output = await runCode(language, code, input);
        res.json({ language, code, output });
    } catch (error) {
        res.json({ message: error.message });
        console.log(error);
    }
});
server.listen(8080,() => {
    console.log("Server started on port 8080")
})