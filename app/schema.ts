
import { gql } from 'apollo-server-express'

const Schema = gql`
    type Account {
        id: ID!
        authtoken: String
        role: String
        seenContent: [TextContent]
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
        content: [TextContent]
        questions: [QuestionContent]
    }

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
        user: Account!
        question: QuestionContent!
        answer: [String]
        correct: Boolean
    }

    type Query {
        getAllLevels: [Level]
        getLevel(id: Int): Level
        getStudents: [Account]
        isContentViewed(textContent: Int): Boolean
        canTheStudentGoForward(question: Int): Boolean
        getLessonsByLevel(level: Int): [Lesson]
        getContentByLesson(lesson: Int): [TextContent]
        getQuestionsForALesson(lesson: Int): [QuestionContent]
        getAnswersOfAStudent(student: Int): [Answer]
    }

    type Mutation {
        addLevel(title: String, description: String): Level
        addLessonForALevel(title: String, description: String, level: String): Lesson
        giveAnswer(answer: Int): Answer
    }
`

export default Schema
