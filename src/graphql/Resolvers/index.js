const recruiterResolvers = require('./Recruiter');
const recruitmentResolvers = require('./Recruitment');
const applicantResolvers = require('./Applicant')

module.exports = {
    Query:{
        ...recruiterResolvers.Query,
        ...recruitmentResolvers.Query,
        ...applicantResolvers.Query
    },
    Mutation:{
        ...recruiterResolvers.Mutation,
        ...recruitmentResolvers.Mutation,
        ...applicantResolvers.Mutation
    }
}