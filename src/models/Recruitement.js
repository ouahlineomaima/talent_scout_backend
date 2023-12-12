const mongoose = require("mongoose");
import RecruitementStatus from "../utils/RecruitementStatus";

const RecruitementSchema = new mongoose.Schema({
    email: String,  
    descriptions: [
        technologies: [{type: String}]
    ],
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }], 
    status: { type: String, enum: Object.values(RecruitementStatus)}
})

const Recruitement = mongoose.model('Recruitement', RecruitementSchema);
module.exports = Recruitement;