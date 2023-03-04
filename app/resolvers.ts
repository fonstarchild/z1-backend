import { AuthenticationError } from 'apollo-server'
import { levels, questions, answers } from './dataset'
import { isATeacher } from './utils'
import Level from "./models/levelSchema";
import TextContent from "./models/textContentSchema";
import Lesson from "./models/lessonSchema";
import Account from './models/accountSchema';
import Question from './models/questionSchema';
import Answer from './models/answerSchema';


import { ANSWER_TYPES, ROLES } from './constants';

const Resolvers = {
  Query: {
    whoAmI: async (_: any, args: any, context: any) => {
      // We could return the user of the context directly,
      // but here the aim is to return your seen content too
      // so we need to populate.
      const targetUser = await Account.findById(context.user._id).populate('seenContent').exec();
      return targetUser;
    },

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
      const allLevels = await Lesson.find({level: args.level}).populate('content').exec();
      return allLevels;
    },

    getContentByLesson: async (_: any, args: any) => {
      const filteredContent = await TextContent.find({lesson: args.lesson}).exec();
      return filteredContent;
    },

    getQuestionsForALesson: async (_: any, args: any) => {
      const targetQuestions = await Question.find({lesson: args.lesson}).exec();
      return targetQuestions;
    },

    getAnswersOfAStudent: (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      return answers.filter((answer) => answer.student === args.student);
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

    addTextContentForALesson: async (_: any, args: any, context: any) => {
      if (!isATeacher(context.user)) {
        throw new AuthenticationError("The user is not a teacher.")
      }
      const targetLesson = await Lesson.findById(args.lesson).exec();
      if(targetLesson){
        const newTextContent = new TextContent({
          content: args.content,
          hierarchy: targetLesson.content ? targetLesson.content.length + 1 : 1,
          title: args.title,
          image: args.image,
          lesson: args.lesson
        })
        await newTextContent.save()
        targetLesson.content.push(newTextContent._id);
        await targetLesson.save()
        return newTextContent;
      }
      return null;
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
          hierarchy: targetLesson.questions? targetLesson.questions.length + 1 : 1,
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

    // DANGER: This method should be deleted. It´s only to fill
    // a teacher in the database to play with in the test.
    addTeacher: async (_: any, args: any) => {
      const teacher = new Account({
        username: "Admin",
        authtoken: "teacher",
        role: ROLES.TEACHER,
        seenContent: []
      })
      await teacher.save();
      return teacher;
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

    // Doubt here: I wanted to set it on mutation because it is really modifying
    // a model, but still, it is somewhat a query...
    getTextContentDetail: async(_:any, args: any, context: any) => {
      const targetContent = await TextContent.findById(args.content);
      const { user } = context;
      // As we navigate thru text content we register it on the user
      if(user && targetContent){
        if(!user.seenContent.includes(args.content)){
          user.seenContent.push(targetContent._id);
          await user.save();
        }
        return targetContent;
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
