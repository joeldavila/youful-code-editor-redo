
// This is for the chat component.
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
});

// This is for the Python

// const express = require('express');
// const bodyParser = require('body-parser');
// const { exec } = require('child_process');

// const chatApp = express(); // Use a different Express app for the chat component
// const pythonApp = express(); // Create a separate Express app for Python execution
// const chatPort = 3000; // Port for chat component
// const pythonPort = 3001; // Port for Python execution

// chatApp.use(bodyParser.json());
// pythonApp.use(bodyParser.json());

// // Define routes for the chat component here (if any)

// pythonApp.post('/executePython', (req, res) => {
//   const { code } = req.body;

//   // Execute Python code
//   exec(`python -c "${code}"`, (error, stdout, stderr) => {
//     if (error) {
//       res.status(500).json({ error: error.message });
//       return;
//     }

//     res.json({ output: stdout, error: stderr });
//   });
// });

// chatApp.listen(chatPort, () => {
//   console.log(`Chat component is running on port ${chatPort}`);
// });

// pythonApp.listen(pythonPort, () => {
//   console.log(`Python execution is running on port ${pythonPort}`);
// });
