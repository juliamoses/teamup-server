window.$ = window.jQuery = require('jquery');
const io = require('socket.io')(8085);
const rootPath = require("electron-root-path").rootPath;
const fs = require('fs');
const path = rootPath + '/static/fileInfo.json';
let currentDownloads = [];

$(document).ready(()=> {
  // Start a socket sever upon loading
  io.on('connection', (socket)=> {
    socket.on('download_complete', (email)=> {
      // We need to call a function that
      console.log("Line 10 socket got a message from Client");
      updateJSONFile(email);
		});
		
		socket.on('download_started', (email, name)=> {
			// A download has started
			console.log(`Line 19: ${name} has downloaded with email ${email}`);
		});
  });
});

function updateJSONFile(email_data) {
  const myJSON = getJSONFileObject(); // this will get the JSON file and a parsed chunk array
  console.log("my JSON line 19 ", myJSON);
  const parsedChunkData = myJSON.parsedChunks; // This should be an array of objects
  
  
  for (let i = 0; i < parsedChunkData.length; i++) {
    if (parsedChunkData[i].email === email_data) {
      parsedChunkData[i].done = true;
    }
  }
  
  console.log("Line 28 AFTER ", parsedChunkData);
  
  // Add it to the object
  myJSON.object.chunks = JSON.stringify(parsedChunkData); //

  // write it to disk
  fs.writeFileSync(path, JSON.stringify(myJSON.object));
  updateChunkProgress();
}

function getJSONFileObject() {
  // Return the JSON object and the parsed chunk as an array {,}
  const returnObject = {};
  
  returnObject.object = require(path);
  returnObject.parsedChunks = JSON.parse(returnObject.object.chunks);
  return returnObject;
}
// Create a function that updates the user
function updateChunkProgress() {
  // This will create a progress bar and some text that will be sent to the DOM
  // let's empty the div
  $("#upload-section").empty();

  // Let's get a current count of total chunks
  const totalChunks = getJSONFileObject().parsedChunks.length;
  const chunksCompleted = getJSONFileObject().parsedChunks.filter(chunk => chunk.done === true).length;
  
  if (chunksCompleted < totalChunks) {
    const $chunkStatusCaption = $('<p/>').text(`${chunksCompleted} of ${totalChunks} chunks downloaded by sharees.`);
    $("#upload-section").append($chunkStatusCaption);
    let progressBarWidth = Math.floor(chunksCompleted / totalChunks * 100);
    
    // Create a new progress bar
    const progressBarContainer = $('<div/>').addClass('progress');
    const progressBar = $('<div/>').attr('role', 'progressbar').addClass('progress-bar progress-bar-striped progress-bar-animated').css('width', progressBarWidth + "%");
    progressBarContainer.append(progressBar);
    $("#upload-section").append(progressBarContainer);

  } else {
    const $chunkStatusCaption = $('<p/>').text(`${chunksCompleted} of ${totalChunks} chunks downloaded by sharees.`);
    $("#upload-section").append($chunkStatusCaption);
    let progressBarWidth = Math.floor(chunksCompleted / totalChunks * 100);
    
    // Create a new progress bar
    const progressBarContainer = $('<div/>').addClass('progress');
    const progressBar = $('<div/>').attr('role', 'progressbar').addClass('progress-bar bg-success').css('width', progressBarWidth + "%");
    
		const checkMarkGlyph = $('<span/>').addClass('glyphicon glyphicon-ok');
		progressBarContainer.append(progressBar, checkMarkGlyph);
    $("#upload-section").append(progressBarContainer);
		
    // Create a confirmation check mark
		// Show the delete button
		$("#delete-files").css('display', 'block'); 
    
  }
}