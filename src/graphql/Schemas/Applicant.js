const { gql } = require('apollo-server');

const Applicant = gql`
  enum ApplicantStatus{
    Contacted
    InterviewPassed
    Accepted
    Rejected
    Hired
    Pending
  }

  enum ApplicationStatus{
    Checked
    NotChecked
  }

  type Applicant{
    id: ID!
    idRecruitment: ID!
    firstname: String
    lastname: String
    email: String
    resume: String
    coverLetter: String
    score: Float
    applicantStatus: ApplicantStatus
    applicationStatus: ApplicationStatus
    phone: String
  }

  input ApplicantInput{
    idRecruitment: ID!
    resume: String
    coverLetter: String
    applicationStatus: ApplicationStatus
  }

  input UpdateInput{
    id: ID!
    idRecruitment: ID!
    firstname: String
    lastname: String
    email: String
    resume: String
    coverLetter: String
    score: Float
    applicantStatus: ApplicantStatus
    applicationStatus: ApplicationStatus
  }

  type Query {
    applicant(id: ID!): Applicant
    applicants: [Applicant!]
    recruitmentApplicants(idRecruitment: ID!): [Applicant]
    checkedRecruitmentApplicants(idRecruitment: ID!): [Applicant]
  }

  type Mutation {
    addApplicant(applicantInput: ApplicantInput): Applicant
    updateApplicant(applicant: UpdateInput): Applicant
  }
`;

module.exports = Applicant;
