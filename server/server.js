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
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/phreddit', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sessions
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/phreddit',
        collection: 'sessions',
    }),
    cookie: { 
        secure: false,
        httpOnly: false,
        maxAge: 1000*60*60,
    }
}));


// Default Route
app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

// Routes
app.use(require('./routes/users'));
app.use(require('./routes/communities'));
app.use(require('./routes/posts'));
app.use(require('./routes/comments'));
app.use(require('./routes/linkFlairs'));
app.use(require('./routes/incrementViews'));
app.use(require('./routes/vote'));
app.use(require('./routes/login'));


// Start Server
app.listen(8000, () => {console.log("Server listening on port 8000...");});
