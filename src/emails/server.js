const http = require('http');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const { authorize } = require('./services/googleApiAuthService');
const { startCronJob } = require('./cronJob');
const mongoose = require("mongoose");

const app = express();

app.use(cors());

app.get('/auth', async (req, res) => {
    try {
        let client = await authorize().then();

        res.status(200).json({ client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during granting permissions." });
    }
});

mongoose.connect("mongodb+srv://talentscout559:o4Ucq5WLgrkKRW1m@cluster0.nb2bd7a.mongodb.net/TalentScout?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
        // Start the cron job when the MongoDB connection is established
        startCronJob();

        const port = process.env.AUTH_PORT || 5001;
        const server = http.createServer(app);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });
