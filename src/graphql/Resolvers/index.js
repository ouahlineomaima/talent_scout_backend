const recruiterResolvers = require('./Recruiter');

module.exports = {
    Query:{
        ...recruiterResolvers.Query
    },
    Mutation:{
        ...recruiterResolvers.Mutation
    }
}