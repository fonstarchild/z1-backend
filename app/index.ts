import { ApolloServer } from 'apollo-server-express'
import Schema from './schema'
import Resolvers from './resolvers'
import express from 'express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'

async function startApolloServer (schema: any, resolvers: any): Promise<void> {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    // context: ({ req }) => {
    //     const token = req.headers.authorization || 'notoken';
    //     if(token==='notoken') {
    //        throw new AuthenticationError("You need to be logged in to access the courses")
    //     }
    // Filtrar la lista del dataset de usuarios aqui y definir si un contenido es apto para un rol, por contexto.
    //   },
  })

  await server.start()

  server.applyMiddleware({ app })

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
}

void startApolloServer(Schema, Resolvers)
