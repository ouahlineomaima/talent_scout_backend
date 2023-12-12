const mongoose = require("mongoose");

const RecruiterSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,  
    password: String,
})

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);
module.exports = Recruiter;