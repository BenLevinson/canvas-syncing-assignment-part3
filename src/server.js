const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

const io = socketio(app);


app.listen(PORT);

io.on('connection', (socket) => {
  socket.join('room1');
  
  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('draw', {user: data.user, square: data.square});
  });

  socket.on('leave', (data) => {
    io.sockets.in('room1').emit('clearCanvas', {user: data.user, square: data.square});  
      console.log("emitted leave");
  });
    
  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

