// GraphQL schema
const { gql } = require('apollo-server');

const Recruitment = gql`
  enum RecruitmentStatus {
    Open
    Closed
  }

  type Recruitment {
    id: ID!
    idRecruiter: ID!
    trackedEmail: String!
    emailSubject: String!
    jobTitle: String!
    descriptions: TechnologiesDescription!
    applicants: [ID!]!
    status: RecruitmentStatus!
  }

  type TechnologiesDescription {
    technologies: [String]!
  }

  input RecruitmentInput {
    token: String!
    emailSubject: String!
    jobTitle: String!
    descriptions: TechnologiesDescriptionInput!
  }

  input TechnologiesDescriptionInput {
    technologies: [String]!
  }

  type Query {
    recruitments: [Recruitment!]!
    recruitment(id: ID!): Recruitment
    currentRecruiterRecruitments(token: String!): [Recruitment!]!
  }

  type Mutation {
    addRecruitment(recruitmentInput: RecruitmentInput!): Recruitment
  }
`;

module.exports = Recruitment;
