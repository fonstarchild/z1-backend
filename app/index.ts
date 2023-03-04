import { ApolloServer } from 'apollo-server-express'
import Schema from './schema'
import Resolvers from './resolvers'
import express from 'express'
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core'
import http from 'http'
import Account from './models/accountSchema'
import { connectToDb } from './database/connection'

async function startApolloServer (schema: any, resolvers: any): Promise<void> {
  const app = express()
  const httpServer = http.createServer(app)
  await connectToDb()
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
        const token = req.headers.tokenauth || 'notoken';
        if( token==='notoken' ) {
           throw new AuthenticationError("You need an user token to be able to work.")
        }
        const user = await Account.findOne({ authtoken: token}).exec();
        if(!user){
          throw new AuthenticationError("Provided token is invalid")
        }
        return { user };
      },
  })
  await server.start()

  server.applyMiddleware({ app })

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
}

void startApolloServer(Schema, Resolvers)
