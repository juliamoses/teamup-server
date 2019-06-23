window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const splitter = require('split-file');
const uuid = require('uuid/v1');

function showFormData() {
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

// User selects a file
$(document).ready(function () {
  console.log("Session Storage status: ", window.sessionStorage)
  $("#upload_file_path").on('change', (e) =>  {
    const $file_list = e.target.files;
    const userData = window.sessionStorage;
    userData.setItem('file_name', $file_list[0].name);
    userData.setItem('file_path', $file_list[0].path);
    userData.setItem('file_size', $file_list[0].size);
    userData.setItem('file_type', $file_list[0].type);
    console.log(userData);
    
    const $fileSizeElement = createFileSizeP($file_list[0].size);
    const $fileNameElement = $('<p>', {text: `File Name: ${$file_list[0].name}`});
    // Delete the first element before appending
    $("#file_info").append($fileNameElement, $fileSizeElement, createFilePath($file_list[0].path));
    
  })
  
  $("#pickFileNextButton").on('click', (e)=> {
    //window.location.href = "chooseshare.html"
    const $file_picker_data = $("#upload_file_path");
    if ($file_picker_data[0].files.length === 0) {
      alert("Please choose a file");
      return;
    }
    // If file chosen, navigate to the sharerSelect page
    window.location.href ="chooseshare.html";
    
  })
});

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
    console.log(session);

    // Here is where we need to chunk the file
    $('#section-status-message').append($('<p>', {text: 'Splitting file...'}));
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
  console.log("uuid", myId);

  // Create a new subdirectory witha UUID
  fs.mkdir(__dirname + "/static" + "/" + myId, (err) => {
    if (err) {
      // Error
      console.log(err);
    }
  })
}

function isValidEmail(emailAddress) {
  const patt = /^([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))$/
  return patt.test(emailAddress);
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

function createFileSizeP (sizeData) {
  const $size = $("<p>", { text: `File size: ${Math.floor(sizeData / 1000)}  KB`}).addClass("file_size")
  return $size;
}

function createFilePath (pathData) {
  const $fpath = $("<p>", { text: `Path: ${pathData}`}).addClass("file_path");
  return $fpath;
}
