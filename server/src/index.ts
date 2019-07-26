import "reflect-metadata";
import { connect } from "mongoose";
import { mergeResolvers, mergeTypeDefs, mergeSchemas } from "graphql-toolkit";
import * as express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as cors from "cors";

import { setUpAccounts } from "./modules/user/accounts";
import { PORT, MONGO_URL } from "../config";
import getAPIGraphQLSchema from "./graphQL.schema";
import queriesLogger from "./utils/graphql-queries-logger";
import initializeSocketIO from "./socketIO";
import * as http from "http";

(async () => {
  const mongooseConnection = await connect(
    MONGO_URL,
    { useNewUrlParser: true },
  );

  const { accountsGraphQL } = setUpAccounts(mongooseConnection.connection);

  const accountsSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers]),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  });

  const apolloServer = new ApolloServer(
    {
      schema: mergeSchemas({ schemas: [accountsSchema, await getAPIGraphQLSchema()] }), //
      context: async (...args) => {
        const accCtx = await accountsGraphQL.context(...args);
        queriesLogger(...args);
        return accCtx;
      },
      formatError: error => {
        console.error(error, error.stack);
        return error;
      },
      playground: true,
      introspection: true,
    },
  );

  const app = express();
  apolloServer.applyMiddleware({ app });

  app.use(cors(
    {
      "origin": true, // "http://localhost:3001",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204,
      "credentials": true,
    },
  ));

  app.get("/visualizer", (req, res) => {
    res.sendFile(`${__dirname}/tools/gql-visualizer/index.html`);
  });

  const httpServer = new http.Server(app);

  httpServer.listen(PORT, () => {
    console.log(`🚀 GraphQL + Express ready http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`📖 Check GraphQL visualizer at at http://localhost:${PORT}/visualizer`);
  });

   await initializeSocketIO(httpServer);

})();