const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const rootPath = require("electron-root-path").rootPath;

console.log("Line 7 server, ", delegate);
app.use(express.static('public'))

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
  res.render("files_form",);
});


//for final download page
app.get("/download/:email", (req, res) => {
	console.log("param", req.params.email)
	const email = req.params.email;
	const path = rootPath + '/static/fileInfo.json';
	const fileInfo = require(path);
	const sharees = JSON.parse(fileInfo.chunks);
	const sharee = sharees.find((sharee) => {

		console.log('bah', sharee)
		return sharee.email === email });

	res.render("download");

	//res.download(sharee.path);
});

//server will look for file assoiated with email
//set up test
app.post("/sharerFiles/:email", (req, res) => {
	//point to file location
  res.render("/");
});



//post to render link on page
app.post("/", (req, res) => {
	const path = rootPath + '/static/fileInfo.json';
	const fileInfo = require(path);
	const sharees = JSON.parse(fileInfo.chunks);
	const email = req.body.email;
	const sharee = sharees.find((sharee) => {
		return sharee.email === email
	});

	//getting chunks
	//is array of objects- mark correct chunk as downloaded
	//sharee is now object
	//mark its done property as true
	//created new object
	//change info
	//save back to disk



	if (sharee) {
		res.download(sharee.path, (err) =>{
			//
		});
	}
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




