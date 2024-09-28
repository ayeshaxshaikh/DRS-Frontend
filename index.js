const http = require("http");

const app = require("express")();

const cors = require("cors");

app.use(cors());

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/api/test", (req, res) => {
  res.send({ Message: "Working..." });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("startTimer", () => {
    io.emit("startTimer");
  });
});
