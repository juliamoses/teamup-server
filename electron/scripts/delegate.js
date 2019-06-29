window.$ = window.jQuery = require('jquery');
const io = require('socket.io')(8085);
const rootPath = require("electron-root-path").rootPath;
const fs = require('fs');
$(document).ready(()=> {
  // Start a socket sever upon loading
  io.on('connection', (socket)=> {
    socket.on('download_complete', (email)=> {
      // We need to call a function that
      console.log("Line 10 socket got a message from Client")
      updateJSONFile(email);
    })
  })
})

function updateJSONFile(email_data) {
  // Retrieve the JSON file chunks
  const path = rootPath + '/static/fileInfo.json';
  const fileInfo = require(path);
  let myObject = fileInfo;
  console.log("Line 18", myObject);
  const parsedChunkData = JSON.parse(fileInfo.chunks);
  console.log("Line 21 BEFORE ", parsedChunkData);

  for (let i = 0; i < parsedChunkData.length; i++) {
    if (parsedChunkData[i].email === email_data) {
      parsedChunkData[i].done = true;
    }
  }
  // parsedChunkData.forEach((item, index)=> {
  //   if (item.email === email_data) {
  //     parsedChunkData[index].done = true;
  //   }
  // })
  // We should have an object now
  console.log("Line 28 AFTER ", parsedChunkData);

  // Add it to the object
  myObject.chunks = JSON.stringify(parsedChunkData); //

  // write it to disk
  fs.writeFileSync(path, JSON.stringify(myObject));
}