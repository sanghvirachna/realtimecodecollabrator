const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const {runCode }= require('./runCode.js');
const { connected } = require('process');

const app = express();
const server = http.createServer(app);
const io  = new Server(server);

const userMap ={}
var clients ;

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
         console.log(clients)
         clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined',{
                clients,username,socketId:socket.id
            })
         })
         
        })

        socket.on('code-changed',({workspaceId,code,connectedClients}) => {
            console.log(code)
           connectedClients.forEach(({socketId}) => {
                if(socketId !== socket.id){
                     io.to(socketId).emit('code-changed',{code})
                }
              
           })
            
          })
        socket.on('code-sync',({autoCode,id,connectedClients}) => {
            connectedClients.forEach(({socketId})=> {
                if( id != socketId){
                    io.to(socketId).emit('code-changed',{autoCode})
                }
            })
        })
        socket.on('leave',({socketId,connectedClients}) => {
            console.log(connectedClients)
            connectedClients.forEach(({socketId: clientSocketId}) => {
                if(socketId !== clientSocketId){
                const disconnectedUser = connectedClients.find(user => user.socketId === socketId);

                io.to(clientSocketId).emit('disconnected',{socketId,username:disconnectedUser.username})
                }
            })
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