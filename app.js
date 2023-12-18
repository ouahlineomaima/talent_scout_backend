const express = require('express');
const mongoose = require("mongoose");
const http = require('http')
const cors = require('cors');
require('dotenv').config();
const { ApolloServer }  = require('apollo-server');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');


const typeDefsArray = loadFilesSync('./src/graphql/Schemas');

const typeDefs = mergeTypeDefs(typeDefsArray);
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



