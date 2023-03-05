import { MongoMemoryServer } from 'mongodb-memory-server-core'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import Schema from '../schema'
import Resolvers from '../resolvers'

import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { connectDBForTesting } from '../database/connection'

import Level from "../models/levelSchema"
import Lesson from "../models/lessonSchema"
import Account from '../models/accountSchema'



jest.setTimeout(20000)
jest.retryTimes(3)

let mongod:any;
let server:any;

const mockDBName = 'shop'

beforeAll(async () => {
  let mongoUri = ''
  mongod = await MongoMemoryServer.create()
  mongoUri = mongod.getUri()
  await connectDBForTesting(mongoUri, mockDBName)

  const app = express()
  const httpServer = http.createServer(app)

  server = new ApolloServer({
    typeDefs:  Schema,
    resolvers: Resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: () => ({ user: { id: 1, role: 'teacher', username: 'pepito' } }),
  })
  server.start()
})

async function closeMongoConnection(
  mongod:any,
  mongooseConnection:any,
) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
    try {
      mongod?.stop().then(() => {
        mongooseConnection.close().then(() => {
          resolve()
        })
      })
    } catch (err) {
      console.error(err)
    }
  })
}

afterAll(async () => {
  await closeMongoConnection(mongod, mongoose.connection)
  await server.stop()
})

describe('Tests de integración', () => {
   const mockedLevel = {
     title: 'Basico',
     description:
       'Para estudiantes basicos',
     _id: '62d6b1998fb10a613f67a021',
  }

  const mockedLesson = {
    title: 'Leccion 1',
    description:
      'Aprender a testear',
    level: '62d6b1998fb10a613f67a021',
    _id: '62d6b1998fb10a613f22222',
 }

  const publishedLevel = new Level(mockedLevel)

  it('Debería devolver un nivel tras ser creado.', async ()=> {
    await publishedLevel.save();
    const result = await server.executeOperation({
      query: `
            query {
               getAllLevels {
                 title
                 description
                 id
               }
             }
             `,
    })
    expect(result.data.getAllLevels).toHaveLength(1)
    expect(result.data.getAllLevels[0].title).toBe(mockedLevel.title)
  })
  it('Los niveles han de responder las lecciones que añadamos', async ()=> {
    const result = await server.executeOperation({
      query: `
            mutation AddLesson($level: ID, $title: String, $description: String) {
              addLessonForALevel(level: $level, title: $title, description: $description) {
                 title
                 description
               }
             }
             `,
          variables: { 
            level: publishedLevel.id,
            title: mockedLesson.title,
            description: mockedLesson.description
          },
          context: {
            user: {
              role: "teacher"
            }
          }
    })
    // Verificamos que la llamada anterior tenga las lecciones que hayamos añadido.
    expect(result.data.addLessonForALevel.title).toBe(mockedLesson.title)
    const levelResult = await server.executeOperation({
      query: `
            query {
               getAllLevels {
                 lessons {
                  title
                 }
               }
             }
             `,
    })
    expect(levelResult.data.getAllLevels[0].lessons).toHaveLength(1)
    expect(levelResult.data.getAllLevels[0].lessons[0].title).toBe(mockedLesson.title)
  })
})
