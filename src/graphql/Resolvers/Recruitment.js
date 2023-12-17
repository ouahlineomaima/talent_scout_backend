const Recruitment = require('../../models/Recruitment');
const { ApolloError } = require('apollo-server-errors');

module.exports = {
    Query: {
        recruitments: async () => {
          return await Recruitment.find();
        },
        recruitment: async (_, { id }) => {
          return await Recruitment.findById(id);
        },
        currentRecruiterRecruitments: async (_, { idRecruiter }) => {
          return await Recruitment.find({ idRecruiter });
        },
      },
      Mutation: {
        addRecruitment: async (_, { recruitmentInput }) => {
          try {
            const recruitmentData = {
              ...recruitmentInput,
              applicants: [],

    
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

