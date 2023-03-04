import { AuthenticationError } from 'apollo-server'
import { answers } from './dataset'
import { isAStudent, isATeacher } from './utils'
import Level from './models/levelSchema'
import TextContent from './models/textContentSchema'
import Lesson from './models/lessonSchema'
import Account from './models/accountSchema'
import Question from './models/questionSchema'
import Answer from './models/answerSchema'

import { ANSWER_TYPES, ROLES } from './constants'
import { Error } from 'mongoose'

const Resolvers = {
  Query: {
    whoAmI: async (_: any, args: any, context: any) => {
      // We could return the user of the context directly,
      // but here the aim is to return your seen content too
      // so we need to populate.
      const targetUser = await Account.findById(context.user._id).populate('seenContent').exec()
      return targetUser
    },

    getAllLevels: async () => {
      const allLevels = await Level.find({}).populate('lessons').exec()
      return allLevels
    },

    getLevel: async (_: any, args: any) => {
      const targetLevel = await Level.findById(args.level).exec()
      return targetLevel
    },

    getStudents: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const allStudents = await Account.find({ role: ROLES.STUDENT }).exec()
      return allStudents
    },

    isContentViewed: (_: any, args: any, context: any) => {
      return context.user.seenContent.includes(args.textContent)
    },

    canTheStudentGoForward: (_: any, args: any, context: any) => {
      const targetAnswer = answers.find(answer => answer.student === context.user.id && answer.question === args.question)
      if (targetAnswer != null) {
        return targetAnswer.correct
      }
      return false
    },

    getLessonsByLevel: async (_: any, args: any, context: any) => {
      const allLevels = await Lesson.find({ level: args.level }).populate('content').exec()
      return allLevels
    },

    getQuestionForStudentInALesson: async (_: any, args: any, context: any) => {
      // Assumptions: we try to answer an existing question in a existing lesson.
      // Only students should be able to answer. Teachers already know the answer
      // an their correct answers can be seen on Question model.
      if (!isAStudent(context.user)) {
        throw new AuthenticationError('The user is not a student.')
      }
      // We retrieve the existing questions.
      const questions = await Question.find({ lesson: args.lesson }).exec()
      const orderedQuestions = questions.sort((a, b) => (a.hierarchy < b.hierarchy ? -1 : 1))
      if (orderedQuestions.length > 0) {
        // Try to retrieve the answers.
        const givenCorrectAnswers = await Answer.find({
          question: { $in: orderedQuestions.map(question => question.id) },
          correct: true
        })
        if (givenCorrectAnswers.length === 0) {
        // If there´s no correct answers we just give the first one in hierarchy,
          return orderedQuestions[0]
        }
        const listOfCorrectQuestionsId = givenCorrectAnswers.map(answer => answer.question.toHexString())
        // If not, we make an inverse intersection of the orderedQuestions
        const unansweredQuestions = orderedQuestions.filter(question => !listOfCorrectQuestionsId.includes(question.id))
        // If there´s an empty list we can return null and infer, as there´s no more questions, the course has completed.
        if (unansweredQuestions.length === 0) {
          return null
        }
        return unansweredQuestions[0]
      }
      throw new Error('The given lesson has not any questions')
    },

    getContentByLesson: async (_: any, args: any) => {
      const filteredContent = await TextContent.find({ lesson: args.lesson }).exec()
      return filteredContent
    },

    getQuestionsForALesson: async (_: any, args: any) => {
      const targetQuestions = await Question.find({ lesson: args.lesson }).exec()
      return targetQuestions
    },

    getAnswersOfAStudent: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      return answers.filter((answer) => answer.student === args.student)
    }
  },
  Mutation: {
    addLevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const newLevel = new Level({
        title: args.title,
        description: args.description
      })
      await newLevel.save()
      return newLevel
    },

    addTextContentForALesson: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const targetLesson = await Lesson.findById(args.lesson).exec()
      if (targetLesson != null) {
        const newTextContent = new TextContent({
          content: args.content,
          hierarchy: targetLesson.content ? targetLesson.content.length + 1 : 1,
          title: args.title,
          image: args.image,
          lesson: args.lesson
        })
        await newTextContent.save()
        targetLesson.content.push(newTextContent._id)
        await targetLesson.save()
        return newTextContent
      }
      return null
    },

    addQuestionForALesson: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const targetLesson = await Lesson.findById(args.lesson).exec()
      if (targetLesson != null) {
        const newQuestion = new Question({
          question: args.question,
          type: args.type,
          hierarchy: targetLesson.questions ? targetLesson.questions.length + 1 : 1,
          correctAnswer: args.correctAnswer,
          lesson: targetLesson._id
        })
        await newQuestion.save()
        targetLesson.questions.push(newQuestion._id)
        await targetLesson.save()
        return newQuestion
      }
      return null
    },

    // DANGER: This method should be deleted. It´s only to fill
    // a teacher in the database to play with in the test.
    addTeacher: async (_: any, args: any) => {
      const teacher = new Account({
        username: 'Admin',
        authtoken: 'teacher',
        role: ROLES.TEACHER,
        seenContent: []
      })
      await teacher.save()
      return teacher
    },

    addTestStudent: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const newStudent = new Account({
        username: args.username,
        authtoken: args.authtoken,
        role: ROLES.STUDENT,
        seenContent: []
      })
      await newStudent.save()
      return newStudent
    },

    addLessonForALevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      const targetLevel = await Level.findById(args.level).exec()

      if (targetLevel != null) {
        const newLesson = new Lesson({
          title: args.title,
          description: args.description,
          level: targetLevel._id
        })
        await newLesson.save()
        targetLevel.lessons.push(newLesson._id)
        await targetLevel.save()
        return newLesson
      }
      return null
    },

    // Doubt here: I wanted to set it on mutation because it is really modifying
    // a model, but still, it is somewhat a query...
    getTextContentDetail: async (_: any, args: any, context: any) => {
      const targetContent = await TextContent.findById(args.content)
      const { user } = context
      // As we navigate thru text content we register it on the user
      if (user && (targetContent != null)) {
        if (!user.seenContent.includes(args.content)) {
          user.seenContent.push(targetContent._id)
          await user.save()
        }
        return targetContent
      }
      return null
    },

    deleteLevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      await Level.deleteOne({ _id: args.level });
      return null;
    },
    deleteLesson: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      await Lesson.deleteOne({ _id: args.lesson });
      return null;
    },
    deleteContent: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      await TextContent.deleteOne({ _id: args.content });
      return null;
    },
    deleteQuestion: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      await Question.deleteOne({ _id: args.question });
      return null;
    },
    deleteAnswer: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError('The user is not a teacher.')
      }
      await Answer.deleteOne({ _id: args.answer });
      return null;
    },
    giveAnswer: async (_: any, args: any, context: any) => {
      // First we retrieve the question that the answer made was
      const targetQuestion = await Question.findById(args.question).exec()
      // Then, depending on the type, we do some verifications:
      let isCorrect = false
      if (targetQuestion != null) {
        const hasTheQuestionBeenAnswered = await Answer.find({
          question: targetQuestion.id,
          correct: true
        })
        if (!(hasTheQuestionBeenAnswered.length === 0)) {
          // If the questions has been answered we should not be able to answer again.
          return null
        }
        switch (targetQuestion.type) {
          case ANSWER_TYPES.SIMPLE:
            isCorrect = targetQuestion.correctAnswer.includes(args.answer[0])
            break
          case ANSWER_TYPES.MULTIPLE:
            isCorrect = targetQuestion.correctAnswer.every(
              (answer: string) => args.answer.includes(answer)
            )
            break
          case ANSWER_TYPES.FREE:
            // We assume that is correct is free because isCorrect is used to advance
            // to the next question in hierarchy
            isCorrect = true
            break
          default:
            break
        }
        const answer = new Answer({
          answer: args.answer,
          correct: isCorrect,
          student: context.user._id,
          question: targetQuestion._id
        })
        await answer.save()
        return answer
      }
      return null
    }

  }
}

export default Resolvers
