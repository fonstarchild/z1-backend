import { ANSWER_TYPES, ROLES } from './constants'
import { questions } from './dataset';

export const isATeacher = (user: any): boolean => {
    return user.role === ROLES.TEACHER;
}

export const isAStudent = (user: any): boolean => {
    return user.role === ROLES.STUDENT;
}

export const isTheAnswerCorrect = (answer: any): boolean => {
   const targetQuestion = questions.find(
    content => content.id === answer.question
   );

   if(targetQuestion){
    switch(targetQuestion.type){
        case ANSWER_TYPES.SIMPLE:
            return targetQuestion.correctAnswer.includes(answer.answer[0]);
        case ANSWER_TYPES.MULTIPLE:
            return targetQuestion.correctAnswer.every(answer.answer);
        case ANSWER_TYPES.FREE:
            // I thought of including a "pending review" status for teachers to approve i guess
            // let´s assume they are all true.
            return true;
        default:
            return false;
       }
   }

   return false;
   
}