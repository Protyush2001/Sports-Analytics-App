



///////////////////////////////////////////////////////////////////////////////////////////


const http = require("http");
const { Server } = require("socket.io");
const express = require('express');
// ADD THESE IMPORTS at the top with your existing imports
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// ... (keep your existing imports and middleware)
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./app/models/user-model');
const customMatch = require('./app/models/customMatch-model');
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
// In your main server file (app.js or server.js)
const predictionRoutes = require('./app/routes/prediction');


// ADD NEW RECORDING ROUTES IMPORT
// const recordingRoutes = require('./app/routes/recordingRoutes');

const teamCtlr = require("./app/controllers/team-controller");
connectDB();
app.use(express.json());
app.use(cors());

// ... (keep your existing routes and middleware setup)
// ADD DIRECTORY CREATION after your existing middleware setup
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads/Recordings/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads/recordings directory');
}

// ADD MULTER CONFIGURATION for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueName = `recording_${Date.now()}_${uuidv4()}.webm`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});


app.use('/api/payment', payment);

// ADD RECORDING ROUTES
// app.use('/api', recordingRoutes);

app.post('/register', userController.register);
app.post('/login',userController.login);
app.post('/matches',authenticateUser, customMatchController.createMatches);
app.get('/getAllMatches',customMatchController.getAllMatches)
app.patch('/matches/:id/ball',customMatchController.updateBall);
app.use('/api/predictions', predictionRoutes);

// ADD NEW RECORDING STATUS ROUTE
app.patch('/matches/:matchId/recording-status', authenticateUser, customMatchController.updateRecordingStatus);

app.use('/api/players/unassigned',  playerRoutes);
app.use('/api/players',  playerRoutes);

// ENHANCED STATIC FILES MIDDLEWARE FOR VIDEO STREAMING
// app.use('/uploads', express.static('uploads', {
//   setHeaders: (res, path) => {
//     if (path.endsWith('.webm')) {
//       res.setHeader('Content-Type', 'video/webm');
//     } else if (path.endsWith('.mp4')) {
//       res.setHeader('Content-Type', 'video/mp4');
//     }
//     // Enable range requests for video streaming
//     res.setHeader('Accept-Ranges', 'bytes');
//     // Enable CORS for video files
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   }
// }));
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    // Enable range requests for video streaming
    res.setHeader('Accept-Ranges', 'bytes');
    // Enable CORS for video files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
  }
}));

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
app.get("/api/teams/:id",authenticateUser,teamCtlr.getTeamsById);
app.delete("/api/teams/:id", authenticateUser, teamCtlr.deleteTeam);
app.patch("/api/teams/:teamId/remove-player/:playerId", authenticateUser, teamCtlr.patchTeam);
app.get('/api/points-table',authenticateUser,teamCtlr.getPointsTable)

// match routes ---
// ADD THE MISSING UPLOAD RECORDING ENDPOINT that your StreamBroadcaster calls
app.post('/api/matches/:matchId/uploadRecording', 
  authenticateUser, 
  upload.single('recording'), 
  customMatchController.uploadRecording
);

// ADD MISSING START/STOP STREAM ENDPOINTS
app.post('/api/matches/:matchId/start-stream', authenticateUser, customMatchController.startStream);
app.post('/api/matches/:matchId/stop-stream', authenticateUser, customMatchController.stopStream);
app.post('/api/matches/:matchId/matchResult',authenticateUser,customMatchController.updateMatchResult)

app.get('/api/matches/:matchId/commentary', async (req, res) => {
  try {
    const match = await customMatch.findById(req.params.matchId)
      .select('commentary')
      .sort({ 'commentary.timestamp': -1 })
      .limit(100); // Last 100 balls
    
    if (!match) {
      return res.status(404).json({ msg: 'Match not found' });
    }
    
    res.json(match.commentary || []);
  } catch (error) {
    console.error('Error fetching commentary:', error);
    res.status(500).json({ msg: 'Error fetching commentary' });
  }
});


// ADD ERROR HANDLING MIDDLEWARE for multer errors (add this AFTER all your routes)
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File size too large. Maximum 500MB allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ msg: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only video files are allowed!') {
    return res.status(400).json({ msg: 'Only video files are allowed!' });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({ msg: 'Upload failed', error: error.message });
});


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

// Enhanced Socket.IO connection handling with recording support
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

  // RECORDING-SPECIFIC SOCKET EVENTS
  
  // Handle recording status updates
  socket.on('recording_started', (data) => {
    console.log(`Recording started for match ${data.matchId} by ${socket.id}`);
    socket.to(`match_${data.matchId}`).emit('recording_status_update', {
      status: 'recording',
      matchId: data.matchId,
      recordingId: data.recordingId,
      message: 'Recording started'
    });
  });

  socket.on('recording_stopped', (data) => {
    console.log(`Recording stopped for match ${data.matchId} by ${socket.id}`);
    socket.to(`match_${data.matchId}`).emit('recording_status_update', {
      status: 'processing',
      matchId: data.matchId,
      recordingId: data.recordingId,
      message: 'Recording stopped, processing...'
    });
  });

  socket.on('recording_uploaded', (data) => {
    console.log(`Recording uploaded for match ${data.matchId}`);
    socket.to(`match_${data.matchId}`).emit('recording_status_update', {
      status: 'completed',
      matchId: data.matchId,
      recordingId: data.recordingId,
      recordingUrl: data.recordingUrl,
      message: 'Recording available'
    });
  });

  // Handle match room joining for real-time updates
  socket.on('join_match', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`Socket ${socket.id} joined match room: match_${matchId}`);
  });

  socket.on('leave_match', (matchId) => {
    socket.leave(`match_${matchId}`);
    console.log(`Socket ${socket.id} left match room: match_${matchId}`);
  });

  // Handle recording progress updates
  socket.on('recording_progress', (data) => {
    socket.to(`match_${data.matchId}`).emit('recording_progress_update', {
      matchId: data.matchId,
      recordingId: data.recordingId,
      progress: data.progress,
      message: `Upload progress: ${data.progress}%`
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

  socket.on('join', ({ matchId, as }) => {
  const roomId = `match_${matchId}`;
  socket.join(roomId);
  socket.matchId = matchId;
  socket.userType = as; // 'broadcaster' or 'viewer'
  
  console.log(`Socket ${socket.id} joined ${roomId} as ${as}`);
  
  if (as === 'broadcaster') {
    socket.to(roomId).emit('broadcaster-joined', { broadcasterId: socket.id });
  } else if (as === 'viewer') {
    socket.to(roomId).emit('viewer-joined', { viewerId: socket.id });
  }
});

socket.on('offer', ({ to, sdp }) => {
  console.log(`Offer from ${socket.id} to ${to}`);
  socket.to(to).emit('offer', { from: socket.id, sdp });
});

socket.on('answer', ({ to, sdp }) => {
  console.log(`Answer from ${socket.id} to ${to}`);
  socket.to(to).emit('answer', { from: socket.id, sdp });
});

socket.on('ice-candidate', ({ to, candidate }) => {
  console.log(`ICE candidate from ${socket.id} to ${to}`);
  socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
});

socket.on('stream-ended', (data) => {
  console.log(`Stream ended by ${socket.id} for match ${data.matchId}`);
  socket.to(`match_${data.matchId}`).emit('stream-ended', data);
});
socket.on('recording_upload_progress', (data) => {
  console.log(`Recording upload ${data.progress}% for match ${data.matchId}`);
  socket.to(`match_${data.matchId}`).emit('recording_upload_progress', data);
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
  console.log(` Recording upload at http://localhost:${port}/api/upload-recording`);
  console.log(` Recording health at http://localhost:${port}/api/recording-health`);
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
