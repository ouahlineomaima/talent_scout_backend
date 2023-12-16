const mongoose = require("mongoose");
import ApplicantStatus from "../utils/ApplicantStatus";

const ApplicantSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,  
    resume: String,
    coverLetter: String,
    score: {type: Number, default: 0}
    status: { type: String, enum: Object.values(ApplicantStatus)}
})

const Applicant = mongoose.model('Applicant', ApplicantSchema);
module.exports = Applicant;