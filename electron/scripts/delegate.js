window.$ = window.jQuery = require('jquery');
const io = require('socket.io')(8085);
$(document).ready(()=> {
  // Start a socket sever upon loading
  io.on('connection', (socket)=> {
    socket.on('download_complete', (email)=> {
      alert(email);
    })
  })
})
