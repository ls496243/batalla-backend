const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let battleState = {
  scoreA: 500,
  scoreB: 500
};

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.emit('update_scores', battleState);

  socket.on('send_gift', (data) => {
    const { team, amount } = data;
    if (team === 'A') battleState.scoreA += amount;
    if (team === 'B') battleState.scoreB += amount;

    io.emit('update_scores', battleState);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor de batalla corriendo en el puerto ${PORT}`);
});
