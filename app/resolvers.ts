import { AuthenticationError } from 'apollo-server'
import { levels, lessons, questions, textContent, answers, users } from './dataset'
import { isAStudent, isATeacher } from './utils'
import Level from "./models/levelSchema";
import Lesson from "./models/lessonSchema";

const Resolvers = {

  Query: {
    getAllLevels: async () => {
     const allLevels = await Level.find({}).populate('lessons').exec();;
     return allLevels;
    },

    getLevel: (_: any, args: any) => {
      return levels.find((level) => level.id === args.id)
    },

    getStudents: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      return users.filter(user=>isAStudent(user))
    },

    isContentViewed: (_: any, args: any, context: any) => {
      return context.user.seenContent.includes(args.textContent);
    },

    canTheStudentGoForward: (_: any, args: any, context: any) => {
      const targetAnswer = answers.find(answer=>answer.student === context.user.id && answer.question === args.question);
      if(targetAnswer){
        return targetAnswer.correct;
      }
      return false;    },

    getLessonsByLevel: (_: any, args: any, context: any) => {
      return lessons.filter((lesson) => lesson.level === args.level)
    },

    getContentByLesson: (_: any, args: any) => {
      return textContent.filter((textCont) => textCont.lesson === args.lesson)
    },

    getQuestionsForALesson: (_: any, args: any) => {
      return questions.filter((question) => question.lesson === args.lesson)
    },

    getAnswersOfAStudent: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      return answers.filter((answer) => answer.student === args.student)
    },
  },
  Mutation: {
    addLevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const newLevel = new Level({
        title: args.title,
        description: args.description
      })
      await newLevel.save();
      return newLevel
    },

    addLessonForALevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const targetLevel = await Level.findOne({ title: args.level }).exec();
      
      if(targetLevel){
        const newLesson = new Lesson({
          title: args.title,
          description: args.description,
          level: targetLevel._id
        })
        await newLesson.save();
        targetLevel.lessons.push(newLesson._id)
        await targetLevel.save();
        return newLesson
      }
      return null;
    },

    giveAnswer: (_: any, args: any, context: any) => {
      // We should check if an answer is valid here
      const answer = {
        id: levels.length + 1,
        question: args.question,
        answer: args.answer,
        student: context.user.id,
        correct: true,
      }
      answers.push(answer)
      return answer;
    }

  }
}

export default Resolvers
