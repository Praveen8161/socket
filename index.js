import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen("5000", () =>
  console.log("Server is running")
);

const io = new Server(expressServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("enterRoom", ({ name, room }) => {
    socket.join(room);
    socket.broadcast
      .to(room)
      .emit("message", "it is a broadCasr message -- someone joined");
    socket.emit("message", "it is a emited message -- you joined");
  });

  socket.on("message", ({ name, text, room }) => {
    socket.broadcast.to(room);
  });
});
