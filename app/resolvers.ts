import { AuthenticationError } from 'apollo-server'
import { levels, lessons, questions, textContent, answers } from './dataset'
import { isATeacher } from './utils'

const Resolvers = {

  Query: {
    getAllLevels: () => levels,

    getLevel: (_: any, args: any) => {
      console.log(args)
      return levels.find((level) => level.id === args.id)
    },

    getLessonsByLevel: (_: any, args: any, context: any) => {
      return lessons.filter((lesson) => lesson.level === args.level)
    },

    getContentByLesson: (_: any, args: any) => {
      return textContent.filter((textCont) => textCont.lesson === args.lesson)
    },

    getQuestionsForALesson: (_: any, args: any) => {
      return questions.filter((question) => question.lesson === args.lesson)
    }

  },
  Mutation: {
    addLevel: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const newLevel = {
        id: levels.length + 1,
        title: args.title,
        description: args.description
      }
      levels.push(newLevel)
      return newLevel
    },

    addLessonForALevel: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const newLesson = {
        id: levels.length + 1,
        title: args.title,
        description: args.description,
        level: args.level
      }
      lessons.push(newLesson)
      return newLesson
    },

    giveAnswer: (_: any, args: any, context: any) => {
      // We should check if an answer is valid, providing everything here
      const answer = {
        id: levels.length + 1,
        question: args.question,
        answer: args.answer,
        user: context.user.id,
        correct: true,
      }
      answers.push(answer)
      return answer;
    }

  }
}

export default Resolvers
