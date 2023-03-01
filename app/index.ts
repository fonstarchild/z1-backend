import { ApolloServer } from "apollo-server-express";
import Schema from "./schema";
import Resolvers from "./resolvers";
import express from "express";
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from "apollo-server-core";
import http from "http";

async function startApolloServer(schema: any, resolvers: any) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
        const token = req.headers.authorization || 'notoken';
        if(token==='notoken') {
           throw new AuthenticationError("You need to be logged in to access the courses")
        }
      },
  }) as any;

  await server.start(); 

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve) 
  );
  
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(Schema, Resolvers);