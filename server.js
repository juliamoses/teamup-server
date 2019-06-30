const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const rootPath = require("electron-root-path").rootPath;
const io = require('socket.io-client');

app.use(express.static('public'));

app.use(express.static('static'));
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
  res.render("files_form");
});


//for final download page
app.get("/download/:email", (req, res) => {
	console.log("param", req.params.email);
	const email = req.params.email;
	const path = rootPath + '/static/fileInfo.json';
	const fileInfo = require(path);
	const sharees = JSON.parse(fileInfo.chunks);

	const sharee = sharees.find((sharee) => {
		return sharee.email === email; 
	});

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
		return sharee.email === email;
	});

	if (sharee) {
		// Send a signal message before starting the download
		const downloadSocket = io.connect('http://localhost:8085');
		downloadSocket.on('connect', ()=> {
			downloadSocket.emit('download_started', sharee.email, sharee.name, (data)=> {
				downloadSocket.close();
			});
		});

		res.download(sharee.path, (err) =>{
      //call back
      
      const socket = io.connect('http://localhost:8085');
      socket.on('connect', ()=> {
        socket.emit('download_complete', sharee.email, (data)=> {
          socket.close();
        });
      });
		});
	}
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




