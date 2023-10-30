const { ApolloServer } = require('apollo-server');
require('./src/models/index')
require('./src/database/sequelize');
const typeDefs = require('./schema');
const resolvers = require('./src/graphql/resolvers');

const logRequest = (req) => {
  console.log(`Received request: ${req.operationName}`);
};

const logError = (error) => {
  console.error('Error:', error);
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    logRequest(req);

    return {
    };
  },
  formatError: (error) => {
    logError(error);
    return error;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`);
});