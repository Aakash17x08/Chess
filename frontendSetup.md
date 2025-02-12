# Chess Game with Socket.io

This project implements a real-time multiplayer chess game using **Socket.io** and **chess.js**.

## Features
- **WebSocket Connection:** Establishes a WebSocket connection with the server using Socket.io.
- **Chess Game Management:** Uses `chess.js` to handle game logic.
- **Interactive Chessboard:** Implements a drag-and-drop interface for piece movement.
- **Real-time Move Handling:** Updates the board instantly when a move is made.
- **Board Rendering:** Dynamically generates the chessboard based on game state.
- **Unicode Chess Pieces:** Uses Unicode characters for displaying chess pieces.
- **Role Assignment:** Assigns players as White or Black, with spectators also supported.

## Implementation Details

### 1. Socket.io Initialization
```js
const socket = io();
```
Establishes a connection to the WebSocket server.

### 2. Chess Game Initialization
```js
const chess = new Chess();
```
Creates an instance of `chess.js` to manage game logic.

### 3. DOM Elements
```js
const boardElement = document.querySelector("#chessboard");
```
Selects the chessboard container from the HTML.

### 4. Drag and Drop Functionality
- Allows piece movement only if it's the player's turn.
- Listens for `dragstart`, `dragend`, `dragover`, and `drop` events.

### 5. Rendering the Chessboard
- Generates an HTML representation of the board.
- Iterates over the board array and creates square elements.
- Creates piece elements for occupied squares and appends them to square elements.
- Flips the board for the black player's view.

### 6. Handling Moves
- Constructs a move object with source and target squares in algebraic notation.
- Emits a `move` event to the server via Socket.io:
  ```js
  socket.emit("move", { from, to });
  ```

### 7. Unicode Chess Pieces
- Returns Unicode characters representing chess pieces based on their type.

### 8. Socket.io Event Handlers
- Listens for:
  - Player role assignment
  - Spectator assignment
  - Board state updates
  - Opponent moves
- Updates the game state and re-renders the board accordingly.

### 9. Initial Rendering
- Calls the `renderBoard` function initially to render the initial state of the chessboard.


Enjoy playing chess in real-time with this Socket.io-powered game!

