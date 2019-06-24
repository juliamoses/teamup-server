window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const splitter = require('split-file');
const uuid = require('uuid/v1');

function getSharerInfo() {
  // Obtain values from textboxes
  $sharer_name = $("#sharer_name").val();
  $sharer_email = $("#sharer_email").val();

  // Ensure there are no extra white spaces
  $sharer_email = $sharer_email.trim();
  $sharer_name = $sharer_name.trim();
  sharerObject = { sharerName: $sharer_name, sharerEmail: $sharer_email }

  //writeDataFileToDisk(sharerObject);
  const myStorage = window.sessionStorage;
  myStorage.clear();
  myStorage.setItem('sharer_name', $sharer_name)
  myStorage.setItem('sharer_email', $sharer_email)
  
  if ($sharer_email === "" ||  $sharer_name === "") {
    alert('Enter name and e-mail');
    return;
  }
  window.location.href = "pickfile.html"
}

