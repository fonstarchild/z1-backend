import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import Schema from "../schema";
import Resolvers from "../resolvers";

import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { connectDBForTesting } from "../database/connection";

jest.setTimeout(20000);
jest.retryTimes(3);

let mongod: any;
let server: any;

const mockDBName = "shop";

beforeAll(async () => {
  let mongoUri = "";
  mongod = await MongoMemoryServer.create();
  mongoUri = mongod.getUri();
  await connectDBForTesting(mongoUri, mockDBName);

  const app = express();
  const httpServer = http.createServer(app);

  server = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: () => ({ user: { id: 1, role: "student", username: "juanito" } }),
  });
  server.start();
});

async function closeMongoConnection(mongod: any, mongooseConnection: any) {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
    try {
      mongod?.stop().then(() => {
        mongooseConnection.close().then(() => {
          resolve();
        });
      });
    } catch (err) {
      console.error(err);
    }
  });
}

afterAll(async () => {
  await closeMongoConnection(mongod, mongoose.connection);
  await server.stop();
});

describe("Tests de integración - Estudiante", () => {
  it("La creación de niveles ha de estar prohibida para un alumno", async () => {
    const result = await server.executeOperation({
      query: `
      mutation {
        addLevel( title: "Basico", description: "Para estudiantes recién iniciados"){
            title
            description
        }
      }
             `,
    });
    expect(result.errors[0].message).toBe("The user is not a teacher.");
  });

  it("La creación de lecciones ha de estar prohibida para un alumno", async () => {
    const result = await server.executeOperation({
      query: `
      mutation {
        addLessonForALevel(level: "640204b00a7e1e477b57d6e2", title: "Curso de Java", description: "Aprende java desde cero"){
            title
            description
        }
      }
             `,
    });
    expect(result.errors[0].message).toBe("The user is not a teacher.");
  });

  it("La creación de contenido de texto ha de estar prohibida para un alumno", async () => {
    const result = await server.executeOperation({
      query: `
      mutation {
        addTextContentForALesson(
            lesson: "640204e00a7e1e477b57d6e7", 
            title: "Lección 1: Sintaxis"
            content: "Bienvenido al curso de iniciado de Python. Aquí aprenderás blablablabla",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png"
            ){
            title
            content
        }
      }
             `,
    });
    expect(result.errors[0].message).toBe("The user is not a teacher.");
  });

  it("La creación de preguntas ha de estar prohibida para un alumno", async () => {
    const result = await server.executeOperation({
      query: `
      mutation {
        addQuestionForALesson(
            lesson: "640204e00a7e1e477b57d6e7", 
            type: "multiple",
            question: "De las siguientes opciones marca cuales son los nombres de los posibles bucles",
            correctAnswer: ["for", "while"]
            ){
            question
            correctAnswer
        }
      }
             `,
    });
    expect(result.errors[0].message).toBe("The user is not a teacher.");
  });
});
