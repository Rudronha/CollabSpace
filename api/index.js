require("dotenv").config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const generateRoomCode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomCode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }
  return roomCode;
};

// In-memory room storage (you can use a database)
let rooms = {};
const activeRooms = new Set();

io.on('connection', (socket) => {
  const token = socket.handshake.query.token; // Extract the token
  console.log('A user connected:', socket.id);

  if (token !== 'valid-token') {
    socket.disconnect(); // Disconnect the client if the token is invalid
    console.log('Invalid token, connection closed');
    return;
  }

  // Create a new room
  socket.on('create-room', (roomId) => {
    socket.join(roomId); // Add the creator to the room
    activeRooms.add(roomId); // Track the room
    rooms[roomId] = { users: [socket.id] }; // Initialize room with creator's socket ID
    console.log(`Room created with ID: ${roomId}`);
    socket.emit('room-created', roomId); // Send room ID to the creator
  });

  // Join an existing room
  socket.on('join-room', (roomId) => {
    if (activeRooms.has(roomId)) {
      socket.join(roomId); // Add the user to the room
      rooms[roomId].users.push(socket.id); // Add the user to room's user list
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
      socket.emit('room-joined', roomId); // Acknowledge the join
      socket.to(roomId).emit('user-joined', `User ${socket.id} joined!`);
    } else {
      socket.emit('error', 'Room does not exist');
      console.log(`Socket ${socket.id} tried to join non-existent room: ${roomId}`);
    }
  });

  // Handle text changes in the room
  socket.on('text change', ({ roomId, text }) => {
    if (activeRooms.has(roomId)) {
      io.to(roomId).emit('text change',text);
    } else {
      socket.emit('error', 'Cannot send message to non-existent room');
    }
  });

  // Handle language changes in the room
  socket.on('language change', ({ roomId, language }) => {
    if (activeRooms.has(roomId)) {
      io.to(roomId).emit('language change', language);
    } else {
      socket.emit('error', 'Cannot change language in non-existent room');
    }
  });

  // Handle code compilation and execution
  socket.on('compile', ({ roomId, code, language }) => {
    
    const filename = language === 'cpp' ? 'program.cpp' : 'program.c';
    const output = language === 'cpp' ? 'program.exe' : 'program.exe';

    // Write the code to a file
    fs.writeFileSync(filename, code);

    // Compile the code
    const compileCommand = language === 'cpp' ? `g++ ${filename} -o ${output}` : `gcc ${filename} -o ${output}`;
    exec(compileCommand, (error, stdout, stderr) => {
      if (error) {
        return io.to(roomId).emit('compile result', { output: stderr });
      }

      // Run the compiled program
      const runCommand = process.platform === 'win32' ? `${output}` : `./${output}`;
      exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError) {
          return io.to(roomId).emit('compile result', { output: runStderr });
        }

        io.to(roomId).emit('compile result', { output: runStdout });
      });
    });
  });

  // Handle sending chat messages in the room
  socket.on('send-chat-message', ({ roomId, message }) => {
    if (activeRooms.has(roomId)) {
      console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
      io.to(roomId).emit('receive-chat-message', { userId: socket.id, message });
    } else {
      socket.emit('error', 'Cannot send message to non-existent room');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove user from rooms
    Object.keys(rooms).forEach(roomId => {
      if (rooms[roomId].users.includes(socket.id)) {
        rooms[roomId].users = rooms[roomId].users.filter(userId => userId !== socket.id);
        if (rooms[roomId].users.length === 0) {
          // Remove the room if no users are left
          delete rooms[roomId];
          activeRooms.delete(roomId);
          console.log(`Room ${roomId} has been deleted`);
        }
      }
    });
  });
});

app.get('/user', (req, res) => {
  res.status(200).send("Hello There! Rudronha");
});

app.get('/create-room', (req, res) => {
  const roomCode = generateRoomCode(); // Generate room code
  rooms[roomCode] = { users: [] }; // Initialize room with empty users
  res.status(200).json({ roomCode });
});

app.get('/join-room/:code', (req, res) => {
  const code = req.params.code;
  if (rooms[code]) {
    res.status(200).send('Room exists');
  } else {
    res.status(404).send('Room not found');
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
