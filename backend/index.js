const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const { runCode } = require('./runCode.js');
const path = require('path');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://realtimecodecollabarator.onrender.com/"], 
    methods: ["GET", "POST"],
  },
});

let roomClients = {}; // Object to store clients in each room
function getClientsInRoom(room) {
  return roomClients[room] || [];
}
function getWorkspaceIdForSocket(socketId) {
  for (let workspaceId in roomClients) {
    if (roomClients[workspaceId].some(client => client.socketId === socketId)) {
      return workspaceId;
    }
  }
  return null;
}
let workspaces = {}; // Object to store the current code and language for each workspace

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')));

io.on('connection', (socket) => {

  console.log("Connection established");
  console.log(socket.id);
  socket.on('join', ({ username, workspaceId }) => {

    socket.join(workspaceId);
    console.log(`${username} joined ${workspaceId}`);
    if (!roomClients[workspaceId]) {
      roomClients[workspaceId] = [];
    }
    if (!roomClients[workspaceId].some(client => client.username === username)) {
      roomClients[workspaceId].push({ socketId: socket.id, username });
      console.log(getClientsInRoom(workspaceId));
      io.to(workspaceId).emit('joined', username);
    }
    socket.emit('currentUsers', getClientsInRoom(workspaceId).map(client => client.username));
    if (!workspaces[workspaceId]) {
      workspaces[workspaceId] = {
        code: 'console.log("Hello, world!");',
        language: 'javascript'
      };
    }
    socket.emit('codeChange', workspaces[workspaceId].code);
    socket.emit('languageChange', workspaces[workspaceId].language);

  });
  socket.on('languageChange', (newLanguage) => {
    const workspaceId = getWorkspaceIdForSocket(socket.id);
    console.log('New language:', newLanguage, 'Workspace ID:', workspaceId); // Add this line
    if (workspaces[workspaceId]) {
      workspaces[workspaceId].language = newLanguage;
    };
    socket.to(workspaceId).emit('languageChange', newLanguage);
  });
  socket.on('leave', ({ username, workspaceId }) => {
    socket.leave(workspaceId);
    console.log(`${username} left ${workspaceId}`);
    roomClients[workspaceId] = roomClients[workspaceId].filter(client => client.socketId !== socket.id);
    console.log(getClientsInRoom(workspaceId));
    io.to(workspaceId).emit('left', username);
  });
  socket.on('codeChange', (newCode) => {
    const workspaceId = getWorkspaceIdForSocket(socket.id);
    currentCode = newCode;
    socket.to(workspaceId).emit('codeChange', newCode);
  });

  // Listen for the 'reset' event
  socket.on('reset', (defaultCode) => {
    const workspaceId = getWorkspaceIdForSocket(socket.id);
    if (workspaces[workspaceId]) {
      workspaces[workspaceId].code = defaultCode;
    }
    socket.to(workspaceId).emit('codeChange', defaultCode);
  });
})


app.get('*', (req, res) =>
 res.sendFile(path.join(__dirname, './client/build/index.html')));
app.post('/run', async (req, res) => {
  try {
    const { language, code, input } = req.body;
    console.log(language)
    const output = await runCode(language, code, input);
    console.log(output);
    res.json({ language, code, output });
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
server.listen(8080, () => {
  console.log("Server started on port 8080")
})