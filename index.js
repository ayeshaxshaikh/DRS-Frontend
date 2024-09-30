
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// let drsTime = 15;
// let interval;
// let isTimerRunning = false;

// const startTimer = () => {
//   if (isTimerRunning) return; 

//   isTimerRunning = true; 
//   interval = setInterval(() => {
//     if (drsTime > 0) {
//       drsTime--; 
//     } else {
//       clearInterval(interval); 
//       isTimerRunning = false; 
//       drsTime = 15; 
//       io.emit('timerFinished');
//     }
//     io.emit('timerUpdate', drsTime); 
//   }, 1000);
// };

// const resetTimer = () => {
//   clearInterval(interval); 
//   drsTime = 15; 
//   isTimerRunning = false; 
//   io.emit('timerUpdate', drsTime);
// };

// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.emit('timerUpdate', drsTime); 

//   socket.on('startTimer', () => {
//     console.log('Start timer requested');
//     startTimer(); 
//   });

//   socket.on('resetTimer', () => {
//     console.log('Reset timer requested');
//     resetTimer(); 
//     io.emit('timerReset');
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });


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
  if (isTimerRunning) return; // Prevent starting the timer if already running

  isTimerRunning = true; // Set the flag to true to mark timer as running
  io.emit('timerStarted'); // Emit event to show the timer on the frontend

  interval = setInterval(() => {
    if (drsTime > 0) {
      drsTime--; // Decrease the timer by 1 second
    } else {
      clearInterval(interval); // Stop the timer when it reaches 0
      isTimerRunning = false; // Reset the running state
      drsTime = 15; // Reset the timer back to 15 seconds
      io.emit('timerFinished'); // Emit an event to indicate the timer finished
    }
    io.emit('timerUpdate', drsTime); // Send updated timer to all clients
  }, 1000);
};

const resetTimer = () => {
  clearInterval(interval); // Clear any running interval
  drsTime = 15; // Reset the timer to 15 seconds
  isTimerRunning = false; // Stop the timer from running
  io.emit('timerUpdate', drsTime); // Send updated timer to clients
  io.emit('timerReset'); // Notify clients to hide the timer and video
};

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.emit('timerUpdate', drsTime); // Send current timer state to the new connection

  socket.on('startTimer', () => {
    console.log('Start timer requested');
    startTimer(); // Start the timer
  });

  socket.on('resetTimer', () => {
    console.log('Reset timer requested');
    resetTimer(); // Reset the timer
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
