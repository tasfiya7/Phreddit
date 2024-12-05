// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

// Commands
// Start DB ($mkdir data): $ mongod --dbpath data
// Connect to DB: $ mongosh
// Initialized DB: $ node server/initializeDB.js mongodb://127.0.0.1:27017/phreddit
// Start Server: $ nodemon server/server.js
// Start Client (From client folder): $ npm start

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

const mongoose = require('mongoose');

// Routes
app.use(require('./routes/posts'));
app.use(require('./routes/communities'));
app.use(require('./routes/linkFlairs'));
app.use(require('./routes/comments'));
app.use(require('./routes/incrementViews'));


// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/phreddit', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(8000, () => {console.log("Server listening on port 8000...");});
