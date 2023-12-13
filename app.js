const express = require('express');
const mongoose = require("mongoose");
const http = require('http')
const cors = require('cors');
require('dotenv').config();
const { ApolloServer }  = require('apollo-server');

const typeDefs = require('./src/graphql/Schemas/Recruiter');
const resolvers = require('./src/graphql/Resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
  .then(() => {
      console.log("MongoDB Connected");
      return server.listen({port: process.env.PORT});
  })
  .then((res) => {
      console.log(`Server running at ${res.url}`)
  });



