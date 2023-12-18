const Recruitment = require('../../models/Recruitment');
const { ApolloError } = require('apollo-server-errors');
const Recruiter = require('../../models/Recruiter');
const jwt = require("jsonwebtoken")
require('dotenv').config();

module.exports = {
    Query: {
        recruitments: async () => {
          return await Recruitment.find();
        },
        recruitment: async (_, { id }) => {
          return await Recruitment.findById(id);
        },
        currentRecruiterRecruitments: async (_, { token }) => {
           // Verify the token
           const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
           const recruiter = await Recruiter.findById(decodedToken.recruiter_id);
           if (!recruiter) {
             throw new ApolloError('Recruiter not found', 'RECRUITER_NOT_FOUND');
           }
           const idRecruiter = recruiter._id
          return await Recruitment.find({ idRecruiter });
        },
      },
      Mutation: {
        addRecruitment: async (_, { recruitmentInput }) => {
          try {
            const decodedToken = jwt.verify(recruitmentInput.token, process.env.JWT_SECRET);
    
           // Fetch the recruiter based on the decoded token
           const recruiter = await Recruiter.findById(decodedToken.recruiter_id);
   
           if (!recruiter) {
             throw new ApolloError('Recruiter not found', 'RECRUITER_NOT_FOUND');
           }
           const idRecruiter = recruiter._id
            const recruitmentData = {
              ...recruitmentInput,
              applicants: [],
              idRecruiter: recruiter._id

    
            };
    
            const newRecruitment = new Recruitment(recruitmentData);
    
            const savedRecruitment = await newRecruitment.save();
    
            return savedRecruitment;
          } catch (error) {
            throw new ApolloError('Invalid token', 'INVALID_TOKEN');
          }
        },
      },

}

