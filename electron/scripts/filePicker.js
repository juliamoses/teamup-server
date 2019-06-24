window.$ = window.jQuery = require('jquery');

const fs = require('fs');
const splitter = require('split-file');
const uuid = require('uuid/v1');


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


function createFileSizeP (sizeData) {
  const $size = $("<p>", { text: `File size: ${Math.floor(sizeData / 1000)}  KB`}).addClass("file_size")
  return $size;
};

function createFilePath (pathData) {
  const $fpath = $("<p>", { text: `Path: ${pathData}`}).addClass("file_path");
  return $fpath;
};