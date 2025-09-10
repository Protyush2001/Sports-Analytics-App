// const http = require("http");
// const { Server } = require("socket.io");


// const express = require('express');
// // require("dotenv").config();
// const Joi = require('joi');
// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const User = require('./app/models/user-model');
// const Match = require('./app/models/match-model');
// const matchRoutes = require('./app/routes/matchRoutes.js'); 
// const cors = require('cors');
// const authorizeRoles = require("./app/middlewares/checkRole");
// const connectDB = require('./config/db.js'); 
// const authenticateUser = require('./app/middlewares/authenticateUser')
// const app = express();
// const port = 3026;
// const userController = require('./app/controllers/user-controller'); 
// const matchController = require('./app/controllers/match-controller');
// const customMatchController = require('./app/controllers/customMatch-controller');
// const playerRoutes = require('./app/routes/playerRoutes');
// const matchStreamRoutes = require('./app/routes/matchStreamRoutes');
// const adminRoutes = require('./app/routes/adminRoutes');
// const payment = require('./app/routes/payment');
// const registerChatbotHandlers = require("./app/chatbot/chatbotSocket");






// const teamCtlr = require("./app/controllers/team-controller");
// connectDB();
// app.use(express.json());
// app.use(cors());


// app.use('/api/payment', payment);


// app.post('/register', userController.register);
// app.post('/login',userController.login);
// app.post('/matches',authenticateUser, customMatchController.createMatches);
// app.patch('/matches/:id/ball',customMatchController.updateBall);

// app.use('/api/players/unassigned',  playerRoutes);
// app.use('/api/players',  playerRoutes);
// app.use('/uploads', express.static( 'uploads'));

// app.use('/api/matches',authenticateUser,  matchRoutes); // changes made
// app.use('/api/matches', matchStreamRoutes);

// // only players, team owners, admins can access
// app.get("/players", authenticateUser, authorizeRoles("player", "teamOwner", "admin"), (req, res) => {
//     res.send("Welcome to Players page 🚀");
// });

// app.patch("/api/teams/:teamId/add-players", authenticateUser, teamCtlr.addPlayersToTeam);

// // only admin can access
// app.use("/admin", authenticateUser, authorizeRoles("admin"), adminRoutes);


// // ✅ GET /admin/users → list all users
// app.use("/admin/users", authenticateUser, authorizeRoles("admin"), adminRoutes);

// // ✅ DELETE /admin/user/:id → remove user
// app.use("/admin/user/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

// // ✅ PATCH /admin/user/:id → update role or status
// app.use("/admin/user/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

// // ✅ GET /admin/matches → monitor match activity
// app.use("/admin/matches", authenticateUser, authorizeRoles("admin"), adminRoutes);

// // DELETE /admin/matches/:id -> delete match
// app.use("/admin/matches/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

// //team routes ---
// app.post("/api/teams", authenticateUser, teamCtlr.createTeam);
// app.get("/api/teams", authenticateUser, teamCtlr.getTeams);
// app.delete("/api/teams/:id", authenticateUser, teamCtlr.deleteTeam);
// app.patch("/api/teams/:teamId/remove-player/:playerId", authenticateUser, teamCtlr.patchTeam);






// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin:"http://localhost:5173", 
//       "http://localhost:3000", 
//       "http://127.0.0.1:5173", // your frontend
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//   },
//   transports: ["websocket","polling"],
//   allowEIO3: true, // Support older clients if needed
//   pingTimeout: 60000,
//   pingInterval: 25000,
// });

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });
// registerChatbotHandlers(io);

// // Export io so controllers can emit events
// module.exports.io = io;

// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const { pollLiveMatches } = require("./app/services/matchPoller");

// setInterval(() => pollLiveMatches(io), 5000); // every 1000 seconds


// Updated server.js - Focus on the Socket.IO configuration part

//////////////////////////////////////////////////////////////////////////

const http = require("http");
const { Server } = require("socket.io");
const express = require('express');

// ... (keep your existing imports and middleware)
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./app/models/user-model');
const Match = require('./app/models/match-model');
const matchRoutes = require('./app/routes/matchRoutes.js'); 
const cors = require('cors');
const authorizeRoles = require("./app/middlewares/checkRole");
const connectDB = require('./config/db.js'); 
const authenticateUser = require('./app/middlewares/authenticateUser')
const app = express();
const port = 3026;
const userController = require('./app/controllers/user-controller'); 
const matchController = require('./app/controllers/match-controller');
const customMatchController = require('./app/controllers/customMatch-controller');
const playerRoutes = require('./app/routes/playerRoutes');
const matchStreamRoutes = require('./app/routes/matchStreamRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const payment = require('./app/routes/payment');
const registerChatbotHandlers = require("./app/chatbot/chatbotSocket");

const teamCtlr = require("./app/controllers/team-controller");
connectDB();
app.use(express.json());
app.use(cors());

// ... (keep your existing routes and middleware setup)

app.use('/api/payment', payment);


app.post('/register', userController.register);
app.post('/login',userController.login);
app.post('/matches',authenticateUser, customMatchController.createMatches);
app.patch('/matches/:id/ball',customMatchController.updateBall);

app.use('/api/players/unassigned',  playerRoutes);
app.use('/api/players',  playerRoutes);
app.use('/uploads', express.static( 'uploads'));

app.use('/api/matches',authenticateUser,  matchRoutes); // changes made
app.use('/api/matches', matchStreamRoutes);

// only players, team owners, admins can access
app.get("/players", authenticateUser, authorizeRoles("player", "teamOwner", "admin"), (req, res) => {
    res.send("Welcome to Players page ");
});

app.patch("/api/teams/:teamId/add-players", authenticateUser, teamCtlr.addPlayersToTeam);

// only admin can access
app.use("/admin", authenticateUser, authorizeRoles("admin"), adminRoutes);


//  GET /admin/users → list all users
app.use("/admin/users", authenticateUser, authorizeRoles("admin"), adminRoutes);

//  DELETE /admin/user/:id → remove user
app.use("/admin/user/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

//  PATCH /admin/user/:id → update role or status
app.use("/admin/user/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

//  GET /admin/matches → monitor match activity
app.use("/admin/matches", authenticateUser, authorizeRoles("admin"), adminRoutes);

// DELETE /admin/matches/:id -> delete match
app.use("/admin/matches/:id", authenticateUser, authorizeRoles("admin"), adminRoutes);

//team routes ---
app.post("/api/teams", authenticateUser, teamCtlr.createTeam);
app.get("/api/teams", authenticateUser, teamCtlr.getTeams);
app.delete("/api/teams/:id", authenticateUser, teamCtlr.deleteTeam);
app.patch("/api/teams/:teamId/remove-player/:playerId", authenticateUser, teamCtlr.patchTeam);



// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration optimized for development
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "http://localhost:3000", 
      "http://127.0.0.1:5173",
      "http://localhost:5174" // Common Vite alternative port
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: false // Set to false unless you need credentials
  },
  
  // Transport configuration - start with polling for stability
  transports: ["polling", "websocket"],
  allowUpgrades: true,
  
  // Engine.IO settings
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6, // 1MB
  
  // Additional settings for development
  allowEIO3: true,
  serveClient: false, // Don't serve the client files
  
  // Connection state recovery (if needed)
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

// Add a simple route to test if server is responding
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount 
  });
});

// Add Socket.IO health check route
app.get('/socket-health', (req, res) => {
  res.json({
    status: 'OK',
    connectedClients: io.engine.clientsCount,
    transports: ['polling', 'websocket'],
    timestamp: new Date().toISOString()
  });
});

// Enhanced Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(` Socket connected: ${socket.id}`);
  console.log(` Total connections: ${io.engine.clientsCount}`);
  console.log(` Transport: ${socket.conn.transport.name}`);

  // Log transport upgrades
  socket.conn.on('upgrade', () => {
    console.log(`⬆ Socket ${socket.id} upgraded to: ${socket.conn.transport.name}`);
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    console.log(` Ping from ${socket.id}`);
    socket.emit('pong');
  });

  // Test message handler
  socket.on('chat_message', (message) => {
    console.log(` Message from ${socket.id}: ${message}`);

    // Echo back to sender
    socket.emit('chat_response', {
      message: `Echo: ${message}`,
      timestamp: new Date().toISOString(),
      socketId: socket.id
    });
    
    // Broadcast to all other clients
    socket.broadcast.emit('chat_broadcast', {
      message: message,
      from: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(` Socket error for ${socket.id}:`, error);
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(` Socket disconnected: ${socket.id}, reason: ${reason}`);
    console.log(` Remaining connections: ${io.engine.clientsCount}`);
  });

  // Send a welcome message
  socket.emit('welcome', {
    message: 'Connected to server successfully!',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });
});

// Engine-level connection monitoring
io.engine.on("connection_error", (err) => {
  console.error(" Engine connection error:", err.req);
  console.error(" Error code:", err.code);
  console.error(" Error message:", err.message);
  console.error(" Error context:", err.context);
});

// Register your chatbot handlers
try {
  const registerChatbotHandlers = require("./app/chatbot/chatbotSocket");
  registerChatbotHandlers(io);
  console.log(' Chatbot handlers registered');
} catch (error) {
  console.error('Failed to register chatbot handlers:', error);
}

// Export io for use in controllers
module.exports.io = io;

// Start server with enhanced error handling
server.listen(port, '0.0.0.0', () => {
  console.log(` Server running at http://localhost:${port}`);
  console.log(` Socket.IO available at http://localhost:${port}/socket.io/`);
  console.log(` Health check at http://localhost:${port}/health`);
  console.log(` Started at: ${new Date().toISOString()}`);

  // Log available transports
  console.log(`Available transports: polling, websocket`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(` Port ${port} is already in use`);
    console.log(` Try killing the process using this port:`);
    console.log(`   lsof -ti:${port} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error(` Server error:`, err);
  }
});

// Graceful shutdown handling
const gracefulShutdown = () => {
  console.log(' Shutting down gracefully...');
  
  // Close all socket connections
  io.close(() => {
    console.log(' All socket connections closed');
  });
  
  // Close HTTP server
  server.close(() => {
    console.log(' HTTP server closed');
    process.exit(0);
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.log(' Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Optional: Add process monitoring
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
});

// Match polling setup (fixed the interval)
const { pollLiveMatches } = require("./app/services/matchPoller");

const startMatchPolling = () => {
  console.log(' Starting match polling service...');
  
  const pollInterval = setInterval(() => {
    try {
      pollLiveMatches(io);
    } catch (error) {
      console.error(' Error in match polling:', error);
    }
  }, 10000); // Poll every 10 seconds
  
  // Clear interval on shutdown
  process.on('SIGTERM', () => {
    clearInterval(pollInterval);
  });
  process.on('SIGINT', () => {
    clearInterval(pollInterval);
  });
};

// Start polling after server is ready
setTimeout(startMatchPolling, 5000000);

