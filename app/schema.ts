import { gql } from "apollo-server-express";

const Schema = gql`
  type Account {
    id: ID!
    authtoken: String
    role: String
    username: String
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
    title: String
    hierarchy: Int
    content: String
    image: String
    lesson: Lesson!
  }

  type QuestionContent {
    id: ID!
    question: String
    type: String
    hierarchy: Int
    lesson: Lesson!
    correctAnswer: [String]
  }

  type Answer {
    id: ID!
    student: Account!
    question: QuestionContent!
    answer: [String]
    correct: Boolean
  }

  type Query {
    whoAmI: Account
    getAllLevels: [Level]
    getLevel(id: ID): Level
    getStudents: [Account]
    isContentViewed(textContent: ID): Boolean
    canTheStudentGoForward(question: ID): Boolean
    getLessonsByLevel(level: ID): [Lesson]
    getQuestionForStudentInALesson(lesson: ID): QuestionContent
    getContentByLesson(lesson: ID): [TextContent]
    getQuestionsForALesson(lesson: ID): [QuestionContent]
    getAnswersOfAStudent(student: ID): [Answer]
  }

  type Mutation {
    addLevel(title: String, description: String): Level
    getTextContentDetail(content: ID): TextContent
    addTeacher: Account
    addTestStudent(username: String, authtoken: String): Account
    addTextContentForALesson(
      lesson: ID
      content: String
      image: String
      title: String
    ): TextContent
    addLessonForALevel(title: String, description: String, level: ID): Lesson
    addQuestionForALesson(
      lesson: ID
      question: String
      type: String
      correctAnswer: [String]
    ): QuestionContent
    giveAnswer(question: ID, answer: [String]): Answer
    updateLevel(title: String, level: ID, description: String): Level
    updateLesson(title: String, lesson: ID, description: String): Lesson
    updateContent(
      targetContent: ID
      title: String
      hierarchy: Int
      content: String
      image: String
    ): TextContent
    updateQuestion(
      targetQuestion: ID
      question: String
      type: String
      hierarchy: Int
    ): QuestionContent
    deleteLevel(level: ID): Level
    deleteLesson(lesson: ID): Lesson
    deleteContent(content: ID): TextContent
    deleteQuestion(question: ID): QuestionContent
    deleteAnswer(answer: ID): Answer
  }
`;

export default Schema;
