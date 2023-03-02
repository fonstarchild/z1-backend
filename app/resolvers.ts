import { levels, lessons, content } from './dataset'
import { isAQuestion } from './utils'

const Resolvers = {

  Query: {
    getAllLevels: () => levels,

    getLevel: (_: any, args: any) => {
      console.log(args)
      return levels.find((level) => level.id === args.id)
    },

    getLessonsByLevel: (_: any, args: any) => {
      return lessons.filter((lesson) => lesson.level === args.level)
    },

    getContentByLesson: (_: any, args: any) => {
      return content.filter((cont) => cont.lesson === args.lesson)
    },

    getQuestionsForALesson: (_: any, args: any) => {
      return content.filter((cont) => cont.lesson === args.lesson).filter(filteredCont => isAQuestion(filteredCont.type))
    }

  },
  Mutation: {
    addLevel: (_: any, args: any) => {
      const newLevel = {
        id: levels.length + 1,
        title: args.title,
        description: args.description
      }
      levels.push(newLevel)
      return newLevel
    },
    addLessonForALevel: (_: any, args: any) => {
      const newLesson = {
        id: levels.length + 1,
        title: args.title,
        description: args.description,
        level: args.level
      }
      lessons.push(newLesson)
      return newLesson
    }

  }
}

export default Resolvers
