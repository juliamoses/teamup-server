
window.$ = window.jQuery = require('jquery');
const internalIp = require('internal-ip');
const sf = require('split-file');
const fs = require('fs');
const rootPath =require('electron-root-path').rootPath;

$(document).ready(function (){
  updateLocalIP();
  session = window.sessionStorage;
  console.log(sessionStorage);
  $("#team-up-link").text(`localhost:3000/${session.id}`);

  // Send a request to the database to give it the file info
  const JSONData = formatDatabaseJSONObject ();
  doAjaxRequest(JSONData)

  // Write the JSON file to static folder
  

})


function updateLocalIP() {
  // Using the internalIPAddress, update the local IP
  internalIp.v4()
  .then (result => {
    $("#local-ip-label").text(result);
  })
}

function doAjaxRequest (data) {
  //const stringifiedData = JSON.stringify(data);
  //console.log('Line 28 stringified', stringifiedData)
  $.post('http://localhost:8081/',data)
  .then((success)=> {
    console.log(success);
  });
}

function formatDatabaseJSONObject() {
  /**
   * This formats the MongoDB JSON object
   */
  session = window.sessionStorage;
  let fObject = {}
  fObject.id = session.id;
  fObject.file_name = session.file_name;
  const chunkObjects = JSON.parse(session.chunkInfo);
  fObject.chunks = JSON.stringify(chunkObjects);
  fObject.size = session.file_size;
  fObject.done = false;

  return fObject;
}