
import { gql } from "apollo-server-express"; 

const Schema = gql`
    type Account {
        id: ID!
        authtoken: String
        role: String
        seenContent: [Lesson]
    }

    type Level {
        id: ID!
        title: String!
        description: String!
        lessons: [Lesson] 
    }

    type Lesson {
        id: ID!
        title: String!
        description: String!
        level: Level!
        content: [Content]
    }

    union Content = TextContent | QuestionContent

    type TextContent {
        id: ID! 
        content: String
        image: String
        lesson: Lesson!
    }

    type QuestionContent {
        id: ID!
        question: String
        type: String
        lesson: Lesson!
        correctAnswer: [String]
        registeredAnswer: Answer
    }

    type Answer {
        id: ID!
        question: QuestionContent!
        answer: [String]
    }

    type Query {
        getAllLevels: [Level]
        getLevel(id: Int): Level
        getLessonsByLevel(level: Int): [Lesson]
        getContentByLesson(lesson: Int): [Content]
        getQuestionsForALesson(lesson: Int): [Content]
    }

    type Mutation {
        addLevel(title: String, description: String): Level
        addLessonForALevel(title: String, description: String, level: String): Lesson
    }
`

export default Schema;