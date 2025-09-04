// === server.js ===
// Node.js + Express + Socket.io server for Infinite Minecraft Miner

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Game state (simple example)
let gameState = {
  progress: 0,
  inventory: {
    iron: 0,
    gold: 0,
    redstone: 0,
    emerald: 0,
    diamond: 0,
  },
  speed: 1,
};

// Mining simulation loop
setInterval(() => {
  gameState.progress += 1 * gameState.speed;
  if (Math.random() < 0.1) gameState.inventory.iron++;
  if (Math.random() < 0.05) gameState.inventory.gold++;
  if (Math.random() < 0.03) gameState.inventory.redstone++;
  if (Math.random() < 0.01) gameState.inventory.emerald++;
  if (Math.random() < 0.02) gameState.inventory.diamond++;

  io.emit('gameUpdate', gameState);
}, 1000);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.emit('gameUpdate', gameState);

  socket.on('command', (cmd) => {
    console.log('Command received:', cmd);
    if (cmd === 'FAST') gameState.speed = 2;
    else if (cmd === 'SLOW') gameState.speed = 0.5;
    else if (cmd === 'TNT') {
      gameState.progress += 10;
    } else if (cmd === 'GOLDEN') {
      gameState.inventory.gold += 5;
    }
    io.emit('gameUpdate', gameState);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
