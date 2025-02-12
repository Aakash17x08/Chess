const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", (uniqueSocket) => {
  console.log("connected to the io server");

  if (!players.white) {
    players.white = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "b");
  } else {
    uniqueSocket.emit("spectatorRole");
  }

  uniqueSocket.on("move", (move) => {
    try {
      const result = chess.move(move);
      if (result) {
        io.emit("move", move);
        io.emit("boardState", chess.fen());
        io.emit("turnUpdate", chess.turn());
      }
    } catch (err) {
      console.log(err);
    }
  });

  uniqueSocket.on("disconnect", () => {
    let role = null;
    if (uniqueSocket.id === players.white) {
      role = "White";
      delete players.white;
    } else if (uniqueSocket.id === players.black) {
      role = "Black";
      delete players.black;
    }
  
    if (role) {
      io.emit("userDisconnected", `${role} Player Disconnected`);
    }
  });
  
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
