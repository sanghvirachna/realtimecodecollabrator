const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const {runCode }= require('./runCode.js');

const app = express();
const server = http.createServer(app);
const io  = new Server(server);
const connectedClients = {};

const userMap ={}
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

function getAllConnectedClients(workspaceId){
    return Array.from(io.sockets.adapter.rooms.get(workspaceId) || []).map((socketId) => {
        return {
            socketId,
            username: userMap[socketId]
        }
    })
}

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('join', ({ workspaceId, username }) => {
        // Check if the client is already connected to the workspace
        if (Object.values(userMap).includes(username)) {
            // console.log(`User ${username} is already connected`);
            return;
          }
          // Log the joining and add the user to the userMap
         userMap[socket.id] = username;
         socket.join(workspaceId);
        
         const clients = getAllConnectedClients(workspaceId);
         if (!connectedClients[workspaceId]) {
            connectedClients[workspaceId] = [];
        }
        connectedClients[workspaceId].push({
            socketId: socket.id,
        });
         console.log(clients)
         clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined',{
                clients,username,socketId:socket.id
            })
         })
         
        })

        socket.on('code-changed',({workspaceId,code}) => {
            io.emit('code-changed',
                {code}
            )
          })

        socket.on('disconnecting' ,() => {
            const rooms = [...socket.rooms]
            rooms.forEach((roomId) => {
              socket.in(roomId).emit('disconnected',{
                socketId:socket.id,
                username:userMap[socket.id]
              })
            })
            delete userMap[socket.id];
            socket.leave()
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