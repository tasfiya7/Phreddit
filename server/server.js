// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');

const app = express();
port = 8000;

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

app.listen(port, () => {console.log("Server listening on port 8000...");});
