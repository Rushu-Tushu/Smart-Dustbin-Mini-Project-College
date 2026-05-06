const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Verify JWT on every WebSocket handshake
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`WS connected: user ${socket.user?.id}`);
  socket.on('disconnect', () => console.log(`WS disconnected: user ${socket.user?.id}`));
});

// Make io available to controllers via req.app.get('io')
app.set('io', io);

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/worker', require('./routes/worker'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'IoT Garbage Monitor API is running' });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
