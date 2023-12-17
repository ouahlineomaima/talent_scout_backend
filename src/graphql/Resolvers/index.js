const recruiterResolvers = require('./Recruiter');
const recruitmentResolvers = require('./Recruitment')

module.exports = {
    Query:{
        ...recruiterResolvers.Query,
        ...recruitmentResolvers.Query
    },
    Mutation:{
        ...recruiterResolvers.Mutation,
        ...recruitmentResolvers.Mutation
    }
}