
//node server.js > ./server.out. call using exec
//instead ping everyone on electorn that link ready
//get request that starts server

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
//const fileInfo = require('./static/fileInfo.json');



//allinside a function- refrence funtion in html 
//'on click'of start serverbutton in electron

app.use(express.static('static'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//how directory will be structured
//hosting a directory
//ill have each chunk in folder- assigneed to people
app.set("view engine", "ejs");

//js functions that call comd line using child process


//TODO
//have user enter email address, move chunks to unique folder
//we give them a link on page render that belongs to that email (and chunk)

//when uploarer
//loop through chunks for 


//render app
app.get("/sharerFiles/:fileName", (req, res) => {
	//point to file location
  res.render("/");
});

//to render the files
app.get("/", (req, res) => {
  res.render("files_form");
});


//server will look for file assoiated with email
//set up test
app.post("/sharerFiles/:email", (req, res) => {
	//point to file location
	//req.params
  res.render("/");
});

//post to render link on page
app.post("/", (req, res) => {
	console.log(req.body.email);
})

// //post to update
// app.post("/order/update", (req, res) => {
//   res.redirect("order");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




