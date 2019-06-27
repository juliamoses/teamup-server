const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const rootPath = require("electron-root-path").rootPath;


app.use(express.static('static'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.set("view engine", "ejs");


//render app
app.get("/sharerFiles/:fileName", (req, res) => {
	//point to file location
  res.render("/");
});

//to render the files
app.get("/", (req, res) => {
	// const path = rootPath + '/static/fileInfo.json';
	// console.log("path", path);
	// const fileInfo = require(path);
	// const sharees = JSON.parse(fileInfo.chunks);
	// console.log("share", sharees);

//sharees.find((sharee) => {return sharee.email === email });

	// const download = res.sendFile(sharees.path, {root: 'static'});
	// {download}
  res.render("files_form",);
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
	const path = rootPath + '/static/fileInfo.json';

	// const fileInfo = require(path);
	// const sharees = JSON.parse(fileInfo.chunks);



	console.log("Headers: ", req.headers);
	const fileInfo = require(path);
	const sharees = JSON.parse(fileInfo.chunks);
	const email = req.body.email;
	const sharee = sharees.find((sharee) => {return sharee.email === email });


	if (sharee) {
			console.log("share", sharee.path)
		//sharee object - add file name sharee will download
		//res.redirect(`/${sharee.path}`)
		//res.sendFile(sharee.path, {root: 'static'});
		res.download(sharee.path);
		//start download
	}
})
// console.log("body", req.body)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




