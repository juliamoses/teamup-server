window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const splitter = require('split-file');
const uuid = require('uuid/v1');
const path = require('path');
const rootPath =require('electron-root-path').rootPath;
const fsExtra = require('fs-extra');

function increaseInputs() {
  // This increases the Name-Email inputs when the user clicks the plus signs
  $("#sharee_container").append(createShareerInput());
  
  const cols = [...$("#sharee_container").find(".each-input-div")]

  console.log(cols);
  // Show or hide the minus-button depending on the amount of fields
  turnMinusButtonONOFF(cols.length);
  
  // console.log(cols[0].children[0].value);
  // console.log(cols[0].children[1].value);
  $("#sharee-count-label").text(`(${cols.length}) chunks`);
}

function decreaseInputs() {
  // Deletes the last name-email input. First get the count of each-input-div.
  // Will only remove if the count is greater than 2
  
  if (getShareeDivs().length > 2) {
    $("#sharee_container div:last-child").remove();
    $("#sharee-count-label").text(`(${getShareeDivs().length}) chunks`);
  }
  turnMinusButtonONOFF(getShareeDivs().length);
}

// Returns the sharee name-email divs as an array
function getShareeDivs() {
  let cols = [...$("#sharee_container").find(".each-input-div")];
  return cols;
}

// The minus button disappears when there are two shareeDivs (so user cannot subtract)
// Any more sharee input boxes - there must be at least two
function turnMinusButtonONOFF(count) {
  if (count > 2) {
    $("#minus-button").css("display", "inline-block");
  } else {
    
    $("#minus-button").css("display", "none");
  }
}

// Called by the chooseshare.html
function getValidSharers() {
  const p_cols = getShareeDivs();
  let sharerArray = []
  let foundGap = false; // if this is true, this function returns an empty array
  let foundInvalidEmail = false;

  p_cols.forEach((element, count) => {
    const nameValue = element.children[0].value = element.children[0].value.trim();
    const emailValue = element.children[1].value = element.children[1].value.trim();
    
    if (!isValidEmail(emailValue)) {
      foundInvalidEmail = true;
    }
    if (nameValue !== "" && emailValue !== "") {
      sharerArray.push({ name: nameValue, email: emailValue});
    } else {
      foundGap = true;
    }
  })

  if (foundInvalidEmail) {
    alert("Invalid or empty email address detected");
    return;
  }
  const finalVal = foundGap ? null : sharerArray;
  if (finalVal) {
    // Store in session storage
    const session = window.sessionStorage;
    session.setItem('sharees', JSON.stringify(finalVal));
   
    // Here is where we need to chunk the file
    $('#status-message').text('Status: Splitting file...(this could take several minutes depending on file size');
    $('#progressSpinner').css('display', 'flex');
    // Splitting is about to happen - disable the 'next' button
    $('#buttonStartSplit').attr('disabled', true);
    splitFile(session.getItem('file_path'));
  } else {
    alert("Ensure all fields of all rows are filled out, or decrease the amount of rows");
  }
}

function splitFile (filePath) {
  // File path should be a full qualified path
  // We need number of sharees
  const session = window.sessionStorage;
  shareeArray = JSON.parse(session.getItem('sharees'));
  const numChunks = shareeArray.length; // chunk file into parts according to sharee count 
  let myId = uuid();
  const outputPath = path.join(rootPath, "/static/")
  session.setItem('id', myId);

  
  let chunkArray = []; // Going to contain an array of chunk info objects that will
  // be written to sessionStorage
  splitter.splitFile(filePath, numChunks)
  .then ((names) => {
      names.forEach((originalFilePath, index) => {
      const parsedFileNameObject = path.parse(originalFilePath);
      
      const finalDestinationPath = outputPath + parsedFileNameObject.name + parsedFileNameObject.ext;
      console.log("Line 114 originalFilePath", originalFilePath)
      const stats = fs.statSync(originalFilePath)
      chunkArray.push({path: finalDestinationPath, amount_uploaded: 0, size: stats.size, name: shareeArray[index].name, email: shareeArray[index].email, done: false })
      fsExtra.move(originalFilePath, finalDestinationPath)
      .then(()=> {

        
        session.setItem('chunkInfo', JSON.stringify(chunkArray));
      })
      .catch((err) => {
        console.log("Line 120 ERROR", err)
      })
    })
  })
  .then (()=> {
    $('#status-message').text('Status: Splitting completed');
    $('#progressSpinner').css('display', 'none');
    writeJSONDataFile();
    //window.location.href ="../public/sharerserver.html";
  })
}

function writeJSONDataFile() {
  const outputPath = path.join(rootPath, "/static/fileInfo.json");
  
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  const JSONData = formatDatabaseJSONObject();
  fs.writeFile(outputPath, JSON.stringify(JSONData), (err) => {
    if (err) throw err;
    console.log("JSON Data written to file succesfully")
  })
}
function formatDatabaseJSONObject() {
  /**
   * This formats the MongoDB JSON object
   */
  session = window.sessionStorage;
  let fObject = {}
  fObject.id = session.id;
  fObject.file_name = session.file_name;
  console.log("chunk", session.chunkInfo);
  const chunkObjects = JSON.parse(session.chunkInfo);
  fObject.chunks = JSON.stringify(chunkObjects);
  fObject.size = session.file_size;
  fObject.done = false;

  return fObject;
}

function isValidEmail(emailAddress) {
  const patt = /^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$/
  //return patt.test(emailAddress);
  return true; // Testing
}

function iterateThroughValues(p_cols) {
  p_cols.forEach((divElement, counter) => {
    console.log(`sharer: ${counter} name: ${divElement.children[0].value} email: ${divElement.children[1].value}`)
  })
}

function createShareerInput () {
  const $inputDiv = $("<div/>").addClass("each-input-div");
  const $nameBox = $('<input/>', {type: 'text', placeholder:'Name'}).addClass('sharee_name form-control-sm');

  const $emailBox = $('<input/>', {type: 'email', placeholder: 'Email'}).addClass("sharee_email form-control-sm");
  $inputDiv.append($nameBox, $emailBox);
  return $inputDiv;
}


