// socket/signaling.js
const jwt = require('jsonwebtoken');

function initSignaling(io) {
  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth || {};
      if (!token) return next(new Error('No token'));
      const data = jwt.verify(token, process.env.JWT_SECRET || 'secret@123');
      socket.user = { id: data.userId, role: data.role };
      next();
    } catch (e) { next(new Error('Unauthorized')); }
  });

  // room state: matchId -> { broadcasterId, viewers:Set }
  const rooms = new Map();

  io.on('connection', (socket) => {
    socket.on('join', ({ matchId, as }) => {
      socket.join(matchId);
      socket.data = { matchId, as };

      if (as === 'broadcaster') {
        if (!['admin','team_owner'].includes(socket.user.role)) {
          socket.emit('error', { message: 'Access denied' });
          return socket.disconnect(true);
        }
        const state = rooms.get(matchId) || { broadcasterId: null, viewers: new Set() };
        if (state.broadcasterId && state.broadcasterId !== socket.id) {
          socket.emit('error', { message: 'Another broadcaster is live' });
          return;
        }
        state.broadcasterId = socket.id;
        rooms.set(matchId, state);
      } else {
        const state = rooms.get(matchId);
        if (state?.broadcasterId) {
          io.to(state.broadcasterId).emit('viewer-joined', { viewerId: socket.id });
          state.viewers.add(socket.id);
        }
      }
    });

    // WebRTC relay
    socket.on('offer', ({ to, sdp }) => io.to(to).emit('offer', { from: socket.id, sdp }));
    socket.on('answer', ({ to, sdp }) => io.to(to).emit('answer', { from: socket.id, sdp }));
    socket.on('ice-candidate', ({ to, candidate }) =>
      io.to(to).emit('ice-candidate', { from: socket.id, candidate })
    );

    socket.on('disconnect', () => {
      const matchId = socket.data?.matchId;
      if (!matchId) return;
      const state = rooms.get(matchId);
      if (!state) return;

      if (socket.id === state.broadcasterId) {
        io.to(matchId).emit('stream-ended');
        rooms.delete(matchId);
      } else {
        state.viewers.delete(socket.id);
      }
    });
  });
}

module.exports = { initSignaling };
