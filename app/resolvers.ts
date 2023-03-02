import { AuthenticationError } from 'apollo-server'
import { levels, lessons, questions, textContent, answers, users } from './dataset'
import { isATeacher } from './utils'
import Level from "./models/levelSchema";
import Lesson from "./models/lessonSchema";
import Account from './models/accountSchema';
import Question from './models/questionSchema';
import Answer from './models/answerSchema';


import { ANSWER_TYPES, ROLES } from './constants';

const Resolvers = {
  Query: {
    getAllLevels: async () => {
     const allLevels = await Level.find({}).populate('lessons').exec();
     return allLevels;
    },

    getLevel: (_: any, args: any) => {
      return levels.find((level) => level.id === args.id)
    },

    getStudents: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const allStudents = await Account.find({role: ROLES.STUDENT}).exec();
      return allStudents;
    },

    isContentViewed: (_: any, args: any, context: any) => {
      return context.user.seenContent.includes(args.textContent);
    },

    canTheStudentGoForward: (_: any, args: any, context: any) => {
      const targetAnswer = answers.find(answer=>answer.student === context.user.id && answer.question === args.question);
      if(targetAnswer){
        return targetAnswer.correct;
      }
      return false;    
    },

    getLessonsByLevel: async (_: any, args: any, context: any) => {
      const allLevels = await Lesson.find({level: args.level}).populate('questions').exec();
      return allLevels;
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

    addQuestionForALesson: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const targetLesson = await Lesson.findById(args.lesson).exec();
      if(targetLesson){
        const newQuestion = new Question({
          question: args.question,
          type: args.type,
          hierarchy: targetLesson.hierarchy === 1 ? targetLesson.hierarchy++ : 1,
          correctAnswer: args.correctAnswer,
          lesson: targetLesson._id,
        })
        await newQuestion.save()
        targetLesson.questions.push(newQuestion._id);
        await targetLesson.save()
        return newQuestion
      }
      return null;
    },

    addTestStudent: async (_: any, args: any, context: any) => {
      const newStudent = new Account({
        username: args.username,
        authtoken: args.authtoken,
        role: ROLES.STUDENT,
        seenContent: []
      })
      await newStudent.save();
      return newStudent;
    },

    addLessonForALevel: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const targetLevel = await Level.findById(args.level).exec();
      
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

    giveAnswer: async(_: any, args: any, context: any) => {
      // First we retrieve the question that the answer made was
      const targetQuestion = await Question.findById(args.question).exec();
      // Then, depending on the type, we do some verifications:
      let isCorrect: boolean = false;
      if(targetQuestion){
        switch(targetQuestion.type){
          case ANSWER_TYPES.SIMPLE:
            isCorrect = targetQuestion.correctAnswer.includes(args.answer[0])
            break;
          case ANSWER_TYPES.MULTIPLE:
            isCorrect = targetQuestion.correctAnswer.every(
              answer=>{
                args.answer.includes(answer);
              }
            )
            break;
          case ANSWER_TYPES.FREE:
            isCorrect = true;
            break;
          default:
            break;
        }
        const answer = new Answer({
          answer: args.answer,
          correct: isCorrect,
          student: context.user._id,
          question: targetQuestion._id 
        })
        await answer.save();
        return answer;
      }
      return null;
    }

  }
}

export default Resolvers
