

/////////REQUIRES///////////////////////////
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

//allinside a function- refrenct=e funtion in html 
//'on click'of start serverbutton in electron
/////////APP.USE///////////////////////////
app.use(express.static('static'))


/////////APP.SET///////////////////////////
//how directory will be structured
//hosting a directory
//ill have each chunk in folder- assigneed to people
app.set("view engine", "ejs");


/////////HELPER FUNCTIONS//////////////////

//TODO
//have user enter email address, move chunks to unique folder
//we give them a link on page render that belongs to that email (and chunk)

/////////GET REQUESTS/////////////////////(most to least specific)
//render app
app.get("/sharerFiles/:fileName", (req, res) => {
	//point to file location
  res.render("/");
});

//to render the files
app.get("/", (req, res) => {
  res.render("files_form");
});



/////////POST REQUESTS/////////////////////(most to least specific)

//server will look for file assoiated with email
//set up test
app.post("/sharerFiles/:email", (req, res) => {
	//point to file location
	//req.params
  res.render("/");
});

//post to render link on page
app.post("", (req, res) => {

})

// //post to update
// app.post("/order/update", (req, res) => {
//   res.redirect("order");
// });


/////////APP.LISTEN///////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




