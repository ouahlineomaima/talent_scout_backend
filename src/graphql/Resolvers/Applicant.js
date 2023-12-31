// Example resolver
const Recruitment = require('../../models/Recruitment');
const Applicant = require('../../models/Applicant')
const { ApolloError } = require('apollo-server-errors');
const ApplicationStatus = require( "../../utils/ApplicationStatus");

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
        applicants: async () => {
            return await Applicant.find();
        },
        recruitmentApplicants: async (_, { idRecruitment }) => {
            try {
                const recruitment = await Recruitment.findById(idRecruitment).populate('applicants');

                if (!recruitment) {
                    throw new ApolloError('Recruitment not found', 'RECRUITMENT_NOT_FOUND');
                }


                return recruitment.applicants;
            } catch (error) {
                console.error(error);
                throw new ApolloError('Error fetching recruitment applicants', 'FETCH_RECRUITMENT_APPLICANTS_ERROR');
            }
        },
        checkedRecruitmentApplicants: async (_, { idRecruitment }) => {
            try {
                const applicants = await Applicant.find({
                    idRecruitment,
                    applicationStatus: ApplicationStatus.Checked,
                  }).sort({ score: -1 }); 
              return applicants;
            } catch (error) {
              console.error('Error fetching checked recruitment applicants:', error);
              throw new Error('Error fetching checked recruitment applicants');
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
