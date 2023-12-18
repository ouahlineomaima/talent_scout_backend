const mongoose = require("mongoose");
const RecruitmentStatus = require("../utils/RecruitmentStatus");

const RecruitmentSchema = new mongoose.Schema({
    idRecruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
    trackedEmail: String,
    emailSubject: String,
    jobTitle: String,
    descriptions: {
        technologies: [{ type: String }]
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
    status: { type: String, enum: Object.values(RecruitmentStatus), default: RecruitmentStatus.RecruitmentStatus.Open }
})

const Recruitment = mongoose.model('Recruitment', RecruitmentSchema);
module.exports = Recruitment;