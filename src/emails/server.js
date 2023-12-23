const http = require('http')
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const {authorize} = require('./services/googleApiAuthService');

const app = express();

app.use(cors());

app.get('/auth', async (req, res) => {
    try {
        let client = await authorize().then()
        
        res.status(200).json({client}) 
        
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during granting permissions." });
    }
  })

const server = http.createServer(app);

const port = process.env.AUTH_PORT || 5001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});