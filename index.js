
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let drsTime = 15;
let interval;
let isTimerRunning = false;

const startTimer = () => {
  if (isTimerRunning) return; 

  isTimerRunning = true; 
  io.emit('timerStarted'); 

  interval = setInterval(() => {
    if (drsTime > 0) {
      drsTime--; 
    } else {
      clearInterval(interval); 
      isTimerRunning = false;
      drsTime = 15; 
      io.emit('timerFinished'); 
    }
    io.emit('timerUpdate', drsTime); 
  }, 1000);
};

const resetTimer = () => {
  clearInterval(interval); 
  drsTime = 15; 
  isTimerRunning = false; 
  io.emit('timerUpdate', drsTime); 
  io.emit('timerReset'); 
};

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.emit('timerUpdate', drsTime); 

  socket.on('startTimer', () => {
    console.log('Start timer requested');
    startTimer(); 
  });

  socket.on('resetTimer', () => {
    console.log('Reset timer requested');
    resetTimer(); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
