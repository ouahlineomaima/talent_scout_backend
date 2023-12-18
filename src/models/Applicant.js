const mongoose = require("mongoose");
import ApplicantStatus from "../utils/ApplicantStatus";
import ApplicantionStatus from "../utils/ApplicationStatus";

const ApplicantSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,  
    resume: String,
    coverLetter: String,
    score: {type: Number, default: 0}
    applicantStatus: { type: String, enum: Object.values(ApplicantStatus)},
    applicationStatus: {type: String, enum: Object.values(ApplicantionStatus), default: ApplicantionStatus.NotChecked}

})

const Applicant = mongoose.model('Applicant', ApplicantSchema);
module.exports = Applicant;