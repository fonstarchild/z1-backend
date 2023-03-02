import { ANSWER_TYPES } from "./constants"

export const isAQuestion = (questionType:any) => {
    return Object.values(ANSWER_TYPES).includes(questionType);
}