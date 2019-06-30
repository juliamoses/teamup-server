window.$ = window.jQuery = require('jquery');
const internalIp = require('internal-ip');
const sf = require('split-file');
const pathJoiner = require('path');

/* 
When the sharerserver loads, do an immediate ajax request. If successful, show a status panel
else, so an error message. Nothing further happens
*/
$(document).ready(function (){
  updateLocalIP();
  session = window.sessionStorage;
  console.log(sessionStorage);
  $("#team-up-link").text(`http://localhost:3000//${session.id}`);

  // Testdata
  const JSONData = formatDatabaseJSONObject ();
  console.log("JSONDATA", JSONData);
  let extractedChunks = JSON.parse(JSONData.chunks);
  console.log("Line 19 extracted chunk data", extractedChunks);
  doAjaxRequest(JSONData)
  .then((response)=> {
    console.log("Success", response);
    // Success - display the download status
  })
  .catch((err)=> {
    $('#upload-section').append(returnErrorMessage("Unable to communicate with remote server."));
    $('#upload-section').append(returnErrorMessage("Please close the application and try again."));
  });
});

function updateLocalIP() {
  // Using the internalIPAddress, update the local IP
  internalIp.v4()
  .then (result => {
    $("#local-ip-label").text("Your local IP Address: " + result + ":8080");
  });
}

function doAjaxRequest (data) {
  // Post the file chunk data to the remote server
  console.log(data);
  return $.post('http://localhost:8081/',data)
  .then((success)=> {
    console.log(success);
    return success; // Success is a promise
  })
  .catch((err)=> {
    // Show an error message
    throw err; // This will cascade to the calling function
  });
}

function returnErrorMessage(msg) {
  const errMsg = $('<h5/>', {text: msg}).attr( {id: 'connectionError'}).css('color', 'red');
  return errMsg;
}
function formatDatabaseJSONObject() {
  /**
   * This formats the MongoDB JSON object
   */
  session = window.sessionStorage;
  let fObject = {};
  fObject.id = session.id;
	fObject.file_name = session.file_name;
	console.log("line 65 Chunk Info", session)
  const chunkObjects = JSON.parse(session.chunkInfo);
  fObject.chunks = JSON.stringify(chunkObjects);
  fObject.size = session.file_size;

  return fObject;
}

function attemptToDeleteFilesInStaticDirectory() {
	const result = DeleteFilesInStaticDirectory();
	if (result) {
		// Change the caption of the button and disable it
		$("#delete-files-btn").text('File chunks deleted').attr('disabled', true);
	}
}

// List all files in the static folder
function DeleteFilesInStaticDirectory() {
  const directory = rootPath + "/static";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    if (files.length > 0) {
      files.forEach((file) => {
				fs.unlink(pathJoiner.join(directory, file), err => {
					if (err) throw err;
					console.log(`${file} deleted.`);
				});
			});
			// Disable the button and change the caption
			return true;
		

    } else {
			console.log(`no files to delete`);
			return false;
    }
  });
}
