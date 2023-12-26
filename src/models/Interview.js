const mongoose = require("mongoose");
import InterviewStatus from "../utils/InterviewStatus";

const InterviewSchema = new mongoose.Schema({
    applicant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
    time: Date,
    status: { type: String, enum: Object.values(InterviewStatus)}
})

const Interview = mongoose.model('Interview', InterviewSchema);
module.exports = Interview;