const {AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer')[1];
        if(token){
            try{
                const recruiter = jwt.verify(token, process.env.JWT_SECRET);
                return recruiter;
            }catch(error){
                throw new AuthenticationError("Invalid/Expired token");
            }
        }
        throw new AuthenticationError("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
}