const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname)); // Serve static files from the current directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const userName = socket.handshake.query.username || "Anonymous";
  console.log(`${userName} connected`);

  socket.on('disconnect', () => {
    console.log(`${userName} disconnected`);
  });
  socket.on('new user', function (username) {
    // Broadcast the username to all other clients
    socket.broadcast.emit('user joined', username);
});
  socket.on('chat message', (msg) => {
    msg.sender = userName; 
    io.emit('chat message', msg);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running. Open your browser and navigate to http://localhost:${PORT}`);
});