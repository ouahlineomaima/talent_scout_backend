const { gql } = require('apollo-server');

const Recruiter = gql`
  type Recruiter {
    firstname: String
    lastname: String
    email: String
    password: String
    profilePicture: String
    token: String
  }

  input RegisterInput {
    firstname: String
    lastname: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    recruiter(id: ID!): Recruiter
  }

  type Mutation {
    registerRecruiter(registerInput: RegisterInput): Recruiter
    loginRecruiter(loginInput: LoginInput): Recruiter
  }
`;

module.exports = Recruiter;
