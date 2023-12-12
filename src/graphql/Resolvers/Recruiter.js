const Recruiter = require('../../models/Recruiter');
const {ApolloError} = require('apollo-server-errors')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
require('dotenv').config();

module.exports = {
    Mutation: {
        async registerRecruiter(_, {registerInput: {firstname, lastname, email, password}}){
            const oldRecruiter = await Recruiter.findOne({email});

            if(oldRecruiter){
                throw new ApolloError('Recruiter with specified email already exists ' + email, 'RECRUITER_ALREADY_EXISTS');
            }

            var encryptedPassword = await bcrypt.hash(password, 10)

            const newRecruiter = new Recruiter(
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: encryptedPassword
            )

            const token = jwt.sign(
                {recruiter_id: newRecruiter._id, email},process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )
            newRecruiter.token = token;

            const res = await newRecruiter.save();

            return {
                id: res.id,
                ...res._doc
            }


        },
        async loginRecruiter(_, {loginInput: {email, password}}){
            const recruiter = await Recruiter.findOne({email});
            if(recruiter && (await bcrypt.compare(password, recruiter.password))){
                const token = jwt.sign(
                    {recruiter_id: recruiter._id, email},process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                )
                recruiter.token = token;
                
                return {
                    id = recruiter.id,
                    ...recruiter._doc
                }

            }
            throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD');

        }
    },
    Query: {
        recruiter: (_, {ID}) => Recruiter.findById(ID)
    }
}