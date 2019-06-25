
window.$ = window.jQuery = require('jquery');
const internalIp = require('internal-ip');

$(document).ready(function (){
  updateLocalIP();
  session = window.sessionStorage;
  console.log(sessionStorage);
  $("#team-up-link").text(`localhost:3000/${session.id}`);
})

function updateLocalIP() {
  // Using the internalIPAddress, update the local IP
  internalIp.v4()
  .then (result => {
    $("#local-ip-label").text(result);
  })
  
}