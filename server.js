const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.static('static'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");


//render app
app.get("/sharerFiles/:fileName", (req, res) => {
	//point to file location
  res.render("/");
});

//to render the files
app.get("/", (req, res) => {
	const download = res.sendFile(fObject, { root: 'static' });
  res.render("files_form", {download});
});


//server will look for file assoiated with email
//set up test
app.post("/sharerFiles/:email", (req, res) => {
	//point to file location
	//req.params
  res.render("/");
});


//TODO
//sharee object will have file name sharee will download-
//'~sharee.filename' will start downloading upon entering email address
// express function to send file- should treat as download
//res.sendFile(sharee.filename, {root: 'static'});
//add package in ejs?


//post to render link on page
app.post("/", (req, res) => {
	console.log("Headers: ", req.headers);
	const fileInfo = require('./static/fileInfo.json');
	const sharees = JSON.parse(fileInfo.sharees);
	const email = req.body.email;
	const sharee = sharees.find((sharee) => {return sharee.email === email });

	if (sharee) {
		//sharee object - add file name sharee will download
		res.redirect(`/${sharee.filename}`)
		res.sendFile(sharee.filename, {root: 'static'});
		//start download
	}
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




