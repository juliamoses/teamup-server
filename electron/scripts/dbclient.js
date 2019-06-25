window.$ = window.jQuery = require('jquery');

function sendAjaxRequestToDB(data) {
  const dataToSend = data.serialize();
  $.ajax({
    type:' POST',
    url : 'localhost:8080',
    data: dataToSend,
    success: function(data) {
    }
  })
}

