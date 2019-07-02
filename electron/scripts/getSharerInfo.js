window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const splitter = require('split-file');
const uuid = require('uuid/v1');
const path = require('path');
const rootPath = require('electron-root-path').rootPath;
const pathJoiner = require('path');

$(document).ready(()=> {
	// Delete any files
	DeleteFilesInStaticDirectory();
});

function getSharerInfo() {
  // Obtain values from textboxes
  $sharer_name = $("#sharer_name").val();
  $sharer_email = $("#sharer_email").val();

  // Ensure there are no extra white spaces
  $sharer_email = $sharer_email.trim();
  $sharer_name = $sharer_name.trim();
  sharerObject = { sharerName: $sharer_name, sharerEmail: $sharer_email };

  //writeDataFileToDisk(sharerObject);
  const myStorage = window.sessionStorage;
  myStorage.clear();
  myStorage.setItem('sharer_name', $sharer_name);
  myStorage.setItem('sharer_email', $sharer_email);
  
  if ($sharer_email === "" ||  $sharer_name === "") {
    alert('Enter name and e-mail');
    return;
  }
  window.location.href = "pickfile.html";
}

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
