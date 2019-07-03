window.$ = window.jQuery = require('jquery');
const io = require('socket.io')(8085);
const rootPath = require("electron-root-path").rootPath;
const fs = require('fs');
const path = rootPath + '/static/fileInfo.json';
let currentDownloads = [];

$(document).ready(()=> {
	// Start a socket sever upon loading
	updateChunkProgress();
  io.on('connection', (socket)=> {
    socket.on('download_complete', (email)=> {
      // We need to call a function that
			
			try {
				// Alter the currentDownloads array
				updateJSONFile(email); 
				currentDownloads = currentDownloads.filter((eachItem) => {
					console.log("Evaluating line 19 in a loop each item " + eachItem.downloader_email );
					return eachItem.downloader_email !== email;
				});
				showIndividualDownloadStatus();
        console.log("Line 21 CurrentDownload array. Download complete: ",  currentDownloads);
			} catch (err) {
				console.log("line 17: " + err);
			}
		});
		
		socket.on('download_started', (email, name)=> {
			// A download has started
      console.log(`Line 19: ${name} has downloaded with email ${email}`);
      if (!fileAlreadyDownloaded(email)) {
        currentDownloads.push({downloader_name: name, downloader_email: email});
      } else {
        console.log("Line 37, File Already downloaded");
      }
      
      // Do some kind of slide down to show the download progress
      if ($("#individual-downloads").is(':visible', 'false')) {
        console.log('Line 36 Individual downloads is not visible. Slide it down.')
        $("#individual-downloads").slideDown("slow");
      }
			showIndividualDownloadStatus();
			console.log('Currentdownloader array:', currentDownloads);
			
		});
  });
});

function showIndividualDownloadStatus() {
	$("#individual-downloads").empty(); 
	if (currentDownloads.length > 0) {
		currentDownloads.forEach((downloader)=> {
			const $downloadData = $('<p/>').text(`${downloader.downloader_name} (${downloader.downloader_email}) currently downloading.`);
			console.log("Line 45 get my current progress bar");
			const progressBarContainer = $('<div/>').addClass('progress');

			const $pbdiv = $('<div/>').attr('role', 'progressbar').addClass("progress-bar progress-bar-striped progress-bar-animated").css('width', '50%');
			progressBarContainer.append($pbdiv); 	
      $("#individual-downloads").append($downloadData, progressBarContainer).css('display', 'block');
      
    });
    
    if ($("#individual-downloads").is('visible', 'false')) {
      $("#individual-downloads").slideDown("fast");
    }
	} else {
    $("#individual-downloads").append($('<p/>').text(`No current downloaders.`));
    //console.log("Line 61 - no current downloads, sliding up");
    $("#individual-downloads").slideUp("fast");
    //$("#individual-downloads").css('display', 'none');
	}
}

function fileAlreadyDownloaded(email_data) {
  // opens the JSON and sees if the chunk associated with the e-mail has already been downloaded
  const myJSON = getJSONFileObject();
  const parsedChunkData = myJSON.parsedChunks;

  for (let i = 0; i <= parsedChunkData.length; i++ ) {
    if (parsedChunkData[i].email === email_data) {
      return parsedChunkData[i].done;
    }
  }
  throw new "Delegate.js fileAreadyDownloaded-Unable to find e-mail";
}
function updateJSONFile(email_data) {
	const myJSON = getJSONFileObject(); // this will get the JSON file and a parsed chunk array
  const parsedChunkData = myJSON.parsedChunks; // This should be an array of objects
  
  
  for (let i = 0; i < parsedChunkData.length; i++) {
    if (parsedChunkData[i].email === email_data) {
      parsedChunkData[i].done = true;
    }
  }
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