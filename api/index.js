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
    origin: "http://localhost:3000",
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

io.on('connection', (socket) => {
  const token = socket.handshake.query.token; // Extract the token
  console.log(`User connected with token: ${token}`);

  if (token !== 'valid-token') {
    socket.disconnect(); // Disconnect the client if the token is invalid
    console.log('Invalid token, connection closed');
    return;
  }

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
  });

  socket.on('text change', (text) => {
    io.to(text.roomCode).emit('text change', text);
  });

  socket.on('language change', (language) => {
    io.to(language.roomCode).emit('language change', language);
  });

  socket.on('compile', (data) => {
    const { roomCode, code, language } = data;
    const filename = language === 'cpp' ? 'program.cpp' : 'program.c';
    const output = language === 'cpp' ? 'program.exe' : 'program.exe';

    // Write the code to a file
    fs.writeFileSync(filename, code);

    // Compile the code
    const compileCommand = language === 'cpp' ? `g++ ${filename} -o ${output}` : `gcc ${filename} -o ${output}`;
    exec(compileCommand, (error, stdout, stderr) => {
      if (error) {
        return io.to(data.roomCode).emit('compile result', { output: stderr });
      }

      // Run the compiled program
      const runCommand = process.platform === 'win32' ? `${output}` : `./${output}`;
      exec(runCommand, (runError, runStdout, runStderr) => {
        if (runError) {
          return io.to(data.roomCode).emit('compile result', { output: runStderr });
        }

        io.to(roomCode).emit('compile result', { output: runStdout });
      });
    });
  });

  socket.on('chat message', (message) => {
    io.to(message.roomCode).emit('chat message', message);
  });

});

app.get('/user',(req,res) =>{
  res.send("Hello There! Rudronha");
});

app.get('/create-room', (req, res) => {

  const roomCode = generateRoomCode(); // Implement this function
  console.log(roomCode);
  rooms[roomCode] = []; // Initialize room with empty array for users
  res.json({ roomCode });
});

app.get('/join-room/:code', (req, res) => {
  const code = req.params.code;
  if (rooms[code]) {
      res.status(200).send('Room exists');
  } else {
      res.status(404).send('Room not found');
  }
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
