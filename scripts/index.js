window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const jsonPath = __dirname + "/data" + "/data.json";

function showFormData() {
  // Obtain values from textboxes
  $sharer_name = $("#sharer_name").val();
  $sharer_email = $("#sharer_email").val();
  // Ensure there are no extra white spaces
  $sharer_email = $sharer_email.trim();
  $sharer_name = $sharer_name.trim();
  sharerObject = { sharerName: $sharer_name, sharerEmail: $sharer_email }
  //writeDataFileToDisk(sharerObject);
  const myStorage = window.localStorage;
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
  $("#upload_file_path").on('change', (e) =>  {
    const $file_list = e.target.files;
    const userData = window.localStorage;
    userData.setItem('file_name', $file_list[0].name);
    userData.setItem('file_path', $file_list[0].path);
    userData.setItem('file_size', $file_list[0].size);
    userData.setItem('file_type', $file_list[0].type);
    console.log(userData);
    
    const $fileSizeElement = createFileSizeP($file_list[0].size);
    $("#file_info").append($fileSizeElement);
    $("#file_info").append(createFilePath($file_list[0].path));
  })
  
  $("#pickFileNextButton").on('click', (e)=> {
    //window.location.href = "chooseshare.html"
    const $file_picker_data = $("#upload_file_path");
    if ($file_picker_data[0].files.length === 0) {
      alert("Please choose a file");
      return;
    }
    window.location.href ="chooseshare.html"
    
  })
});

function increaseInputs() {
  // This increases the Name-Email inputs when the user clicks the plus signs
  $("#sharee_container").append(createShareerInput());
  const $col = $("#sharee_container").find(".each-input-div");
  const cols = [...$("#sharee_container").find(".each-input-div")]

  console.log(cols);
  // Show or hide the minus-button depending on the amount of fields
  turnMinusButtonONOFF(cols.length);
  
  // console.log(cols[0].children[0].value);
  // console.log(cols[0].children[1].value);

  iterateThroughValues(cols)
}

function turnMinusButtonONOFF(count) {
  if (count > 1) {
    $("#minus-button").css("display", "inline-block");
  } else {
    $("#minus-button").css("display", "none");
  }
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
  const $size = $("<p>", {text: `File size: ${Math.floor(sizeData / 1000)}  KB`}).addClass("file_size")
  return $size
}
function createFilePath (pathData) {
  const $fpath = $("<p>", {text: `${pathData}`}).addClass("file_path");
  return $fpath
}