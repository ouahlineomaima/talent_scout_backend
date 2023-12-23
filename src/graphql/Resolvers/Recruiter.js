const Recruiter = require('../../models/Recruiter');
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
require('dotenv').config();
const { authorize, SCOPE } = require('../../emails/services/googleApiAuthService')


module.exports = {
  Mutation: {
    async registerRecruiter(_, { registerInput: { firstname, lastname, email, password } }) {
      try {
        const oldRecruiter = await Recruiter.findOne({ email });
        console.log("dgh")

        if (oldRecruiter) {
          throw new ApolloError('Recruiter with specified email already exists ' + email, 'RECRUITER_ALREADY_EXISTS');
        }

        var encryptedPassword = await bcrypt.hash(password, 10)

        const newRecruiter = new Recruiter({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: encryptedPassword
        }
        )

        const token = jwt.sign(
          { recruiter_id: newRecruiter._id, email }, process.env.JWT_SECRET,
          { expiresIn: "1d" }
        )
        newRecruiter.token = token;

        const res = await newRecruiter.save();

        return {
          id: res.id,
          ...res._doc
        }


      } catch (err) {
        console.log(err)
      }



    },
    async loginRecruiter(_, { loginInput: { email, password } }) {
      console.log("login")
      const recruiter = await Recruiter.findOne({ email });
      if (recruiter && (await bcrypt.compare(password, recruiter.password))) {
        const token = jwt.sign(
          { recruiter_id: recruiter._id, email }, process.env.JWT_SECRET,
          { expiresIn: "1d" }
        )
        recruiter.token = token;

        return {
          id: recruiter.id,
          ...recruiter._doc
        }

      }
      throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD');

    }
  },
  Query: {
    recruiter: (_, { ID }) => Recruiter.findById(ID),
    currentRecruiter: async (_, { token }) => {
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the recruiter based on the decoded token
        const recruiter = await Recruiter.findById(decodedToken.recruiter_id);

        if (!recruiter) {
          throw new ApolloError('Recruiter not found', 'RECRUITER_NOT_FOUND');
        }

        return {
          id: recruiter.id,
          ...recruiter._doc,
        };
      } catch (error) {
        throw new ApolloError('Invalid token', 'INVALID_TOKEN');
      }
    },
  },
}