const request = require('supertest');
const http = require('http');
const { Server } = require('socket.io');
const Client = require("socket.io-client");
const app = require('../index'); // Adjust this to point to the main file

let server, io, clientSocket, secondClientSocket, activeRooms, rooms;

describe('Server and Socket.IO Tests', () => {
  beforeAll((done) => {
    server = http.createServer(app);
    io = new Server(server);
    server.listen(() => done());
  });

  afterAll((done) => {
    io.close();
    server.close(() => done());
  });

  describe('HTTP API Tests', () => {
    test('GET /user should return a greeting', async () => {
      const response = await request(app).get('/user');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello There! Rudronha');
    });

    test('GET /create-room should return a room code', async () => {
      const response = await request(app).get('/create-room');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('roomCode');
      expect(response.body.roomCode).toHaveLength(6);
    });

    test('GET /join-room/:code should return room status', async () => {
      const roomCode = 'testRoom';
      await request(app).get(`/create-room`); // Ensure the room exists
      const response = await request(app).get(`/join-room/${roomCode}`);
      expect([200, 404]).toContain(response.status);
    });
  });


  describe('Socket.IO Tests', () => {
    beforeAll((done) => {
      activeRooms = new Set();
      rooms = {};
    
      // Setup server
      const httpServer = http.createServer();
      io = new Server(httpServer);
    
      io.on("connection", (socket) => {

        socket.on("create-room", (roomId) => {
          socket.join(roomId); // Add the creator to the room
          activeRooms.add(roomId); // Track the room
          rooms[roomId] = { users: [socket.id] }; // Initialize room with creator's socket ID
          socket.emit("room-created", roomId); // Send room ID to the creator
        });

        // Join-room handler
        socket.on("join-room", (roomId) => {
          if (activeRooms.has(roomId)) {
            socket.join(roomId);
            rooms[roomId].users.push(socket.id);
            socket.emit("room-joined", roomId);
            socket.to(roomId).emit("user-joined", `User ${socket.id} joined!`);
          } else {
            socket.emit("error", "Room does not exist");
          }
        });

        // Text change handler
        socket.on("text change", ({ roomId, text }) => {
          if (activeRooms.has(roomId)) {
            io.to(roomId).emit("text change", text); // Broadcast text change to room
          } else {
            socket.emit("error", "Cannot send message to non-existent room"); // Error if room doesn't exist
          }
        });

      });
    
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = Client(`http://localhost:${port}`);
        clientSocket.on("connect", () => {
          secondClientSocket = Client(`http://localhost:${port}`);
          secondClientSocket.on("connect", done);
        });
      });
    });
    
    afterAll(() => {
      io.close();
      clientSocket.close();
      secondClientSocket.close();
    });
    
    test("should create a room and emit room-created event", async(done) => {
      
      const response = await request(app).get('/create-room');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('roomCode');
      expect(response.body.roomCode).toHaveLength(6);
      const roomId = response.body.roomCode;

      clientSocket.emit("create-room", roomId);
    
      clientSocket.on("room-created", (createdRoomId) => {
        // Assert room ID is emitted
        expect(createdRoomId).toBe(roomId);
    
        // Assert room is added to activeRooms
        expect(activeRooms.has(roomId)).toBe(true);
    
        // Assert room data is correctly initialized
        expect(rooms[roomId]).toEqual({ users: [clientSocket.id] });
    
        done();
      });
    });

    test("should allow a user to join an existing room", async(done) => {
    
      // Step 1: Create the room
      const response = await request(app).get('/create-room');
      const roomId = response.body.roomCode;

      clientSocket.emit("create-room", roomId);
      console.log("hello");
      // Step 2: Join the room
      secondClientSocket.emit("join-room", roomId);
    
      // Verify join-room success
      secondClientSocket.on("room-joined", (joinedRoomId) => {
        expect(joinedRoomId).toBe(roomId);
        expect(rooms[roomId].users).toContain(secondClientSocket.id); // Check users list
        done();
      });
    
      // Verify broadcast to the room
      clientSocket.on("user-joined", (message) => {
        expect(message).toBe(`User ${secondClientSocket.id} joined!`);
      });

    });

    test("should broadcast text change to all users in the room", async(done) => {
      
      const newText = "Hello, world!";
    
      // Step 1: Create the room
      const response = await request(app).get('/create-room');
      const roomId = response.body.roomCode;
      clientSocket.emit("create-room", roomId);
    
      // Step 2: Send a text change event to the room
      clientSocket.emit("text change", { roomId, text: newText });
    
      // Step 3: Verify that the second client receives the text change
      secondClientSocket.on("text change", (receivedText) => {
        expect(receivedText).toBe(newText);
        done();
      });
    });
    
    test("should handle text change in a non-existent room", (done) => {
      const nonExistentRoomId = "non-existent-room";
      const newText = "This room doesn't exist";
    
      // Step 1: Try sending a text change to a non-existent room
      clientSocket.emit("text change", { roomId: nonExistentRoomId, text: newText });
    
      // Step 2: Verify that the client receives the error message
      clientSocket.on("error", (errorMsg) => {
        expect(errorMsg).toBe("Cannot send message to non-existent room");
        done();
      });
    });

  
  });

});
