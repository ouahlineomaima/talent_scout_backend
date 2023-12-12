const express = require('express');
const mongoose = require("mongoose");
const http = require('http')
const cors = require('cors');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
});

const db = mongoose.connection;
app.use(cors({
    exposedHeaders: ['Authorization'], 
  }));
db.on("error", console.error.bind(console, "Failed to connect to the database."));
db.once("open", function(){
    console.log("Database connected successfully");
});


app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const server = http.createServer(app);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
