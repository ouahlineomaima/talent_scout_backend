const mongoose = require("mongoose");
const ApplicantStatus = require("../utils/ApplicantStatus");
const ApplicationStatus = require( "../utils/ApplicationStatus");

const ApplicantSchema = new mongoose.Schema({
    idRecruitment: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruitment' },
    firstname: String,
    lastname: String,
    email: String,  
    resume: String,
    coverLetter: String,
    score: {type: Number, default: 0},
    applicantStatus: { type: String, enum: Object.values(ApplicantStatus), default: ApplicantStatus.Pending},
    applicationStatus: {type: String, enum: Object.values(ApplicationStatus), default: ApplicationStatus.NotChecked},
    phone: String

})

const Applicant = mongoose.model('Applicant', ApplicantSchema);
module.exports = Applicant;