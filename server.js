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
  res.render("files_form",);
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
	console.log("Headers: ", req.headers);
	const fileInfo = require(path);
	const sharees = JSON.parse(fileInfo.chunks);
	const email = req.body.email;
	const sharee = sharees.find((sharee) => {return sharee.email === email });


	if (sharee) {
		console.log("share", sharee.path)
		res.download(sharee.path);
		//start download
	}
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




