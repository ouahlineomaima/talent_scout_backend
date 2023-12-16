const mongoose = require("mongoose");

const RecruiterSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},  
    password: String,
    profilePicture: {type:String, default: "http://drive.google.com/uc?export=view&id=1jxNmA_6u5GEKvRPJQJit1jW3T4jEylst"},
    token: String
})

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);
module.exports = Recruiter;