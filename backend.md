# Custom Chess Game - Server

## Overview
This is the server-side implementation for a custom online chess game using Node.js, Express, Socket.io, and Chess.js. The server handles real-time gameplay, player connections, and game state management.

## Technologies Used
- **Node.js**: JavaScript runtime for backend development
- **Express**: Web framework for handling HTTP requests
- **Socket.io**: Real-time communication between server and clients
- **Chess.js**: Library for chess game logic

## Features
- Supports two players (White & Black)
- Spectator mode for additional clients
- Real-time move validation and updates
- Uses FEN notation to track board state


## Server Implementation

### 1. Import Required Modules
```js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Chess } = require('chess.js');
```

### 2. Initialize Server
```js
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
```

### 3. Setup Game State
```js
const chess = new Chess();
const players = {};
let currentPlayer = 'w';
```

### 4. Configure Express App
```js
app.set('view engine', 'ejs');
app.use(express.static('public'));
```

### 5. Define Routes
```js
app.get('/', (req, res) => {
    res.render('index', { title: 'Custom Chess Game' });
});
```

### 6. Handle Socket Connections
```js
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Assign player roles
    if (!players.white) {
        players.white = socket.id;
        socket.emit('playerRole', 'white');
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit('playerRole', 'black');
    } else {
        socket.emit('spectatorRole');
    }

    // Send initial board state
    socket.emit('boardState', chess.fen());

    // Handle move events
    socket.on('move', (move) => {
        if ((chess.turn() === 'w' && socket.id === players.white) || 
            (chess.turn() === 'b' && socket.id === players.black)) {
            
            if (chess.move(move)) {
                io.emit('move', move);
                io.emit('boardState', chess.fen());
            } else {
                console.log('Invalid move:', move);
            }
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.id === players.white) delete players.white;
        if (socket.id === players.black) delete players.black;
    });
});
```

### 7. Start Server
```js
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## How It Works
1. When a player connects, they are assigned either **White**, **Black**, or **Spectator**.
2. Players can make moves if it's their turn; moves are validated by **chess.js**.
3. The updated board state is broadcast to all clients in **real-time**.
4. When a player disconnects, their role is removed from the game state.

## Future Enhancements
- Add support for game timers
- Implement user authentication
- Improve UI with animations and better chessboard rendering
