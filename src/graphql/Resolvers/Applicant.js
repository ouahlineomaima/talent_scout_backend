// Example resolver
const Recruitment = require('../../models/Recruitment');
const Applicant = require('../../models/Applicant')
const { ApolloError } = require('apollo-server-errors');

module.exports = {
    Query: {
        applicant: async (_, { id }) => {
            try {
              const foundApplicant = await Applicant.findById(id);
      
              if (!foundApplicant) {
                throw new ApolloError('Applicant not found', 'APPLICANT_NOT_FOUND');
              }
      
              return foundApplicant;
            } catch (error) {
              console.error(error);
              throw new ApolloError('Error fetching applicant', 'FETCH_APPLICANT_ERROR');
            }
          },
    },
    Mutation: {
        async addApplicant(_, { applicantInput }) {
            try {
                const recruitment = await Recruitment.findById(applicantInput.idRecruitment);

                if (!recruitment) {
                    throw new ApolloError('Recruiter not found', 'RECRUITER_NOT_FOUND');
                }

                // Add the applicant to the recruiter's list of applicants
                const newApplicantData = {
                    ...applicantInput
                };
                const newApplicant = new Applicant(newApplicantData);
                const savedApplicant = await newApplicant.save()

                recruitment.applicants.push(savedApplicant._id);
                await recruitment.save();

                return savedApplicant;
            } catch (error) {
                console.error(error);
                throw new ApolloError('Error adding applicant', 'ADD_APPLICANT_ERROR');
            }
        },
        async updateApplicant(_, { applicant }) {
            try {
                const updatedApplicant = await Applicant.findOneAndUpdate(
                    { _id: applicant.id },
                    { $set: applicant },
                    { new: true }
                );

                if (!updatedApplicant) {
                    throw new ApolloError('Applicant not found', 'APPLICANT_NOT_FOUND');
                }
                const updatedRecruitment = await Recruitment.findOneAndUpdate(
                    { _id: updatedApplicant.idRecruitment },
                    { $set: { 'applicants.$': updatedApplicant._id } },
                    { new: true }
                );

                return updatedApplicant;
            } catch (error) {
                console.error(error);
                throw new ApolloError('Error updating applicant', 'UPDATE_APPLICANT_ERROR');
            }
        }


    },
};
