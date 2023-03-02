import { ANSWER_TYPES, ROLES } from './constants'

export const users: Array<{ id: number, authToken: string, role: string, name: string }> = [
  { id: 1, authToken: 'teacher', role: ROLES.TEACHER, name: 'Godofrasio' },
  { id: 2, authToken: 'student', role: ROLES.STUDENT, name: 'Teovigildo' }
]

export const levels: Array<{ id: number, title: string, description: string }> = [
  { id: 1, title: 'Basic', description: 'Beginner level' },
  { id: 2, title: 'Intermediate', description: 'Intermediate level' },
  { id: 3, title: 'Advanced', description: 'Advanced level' }
]

export const lessons: Array<{ id: number, title: string, description: string, level: number }> = [
  { id: 1, title: 'Basic Ethics', description: 'Lorem Ipsum', level: 1 },
  { id: 2, title: 'Basic Physics', description: 'Lorem ipsum basic', level: 1 },
  { id: 3, title: 'Advanced Physics', description: 'Advanced level', level: 3 }
]

export const content: Array<{
  id: number
  question?: string
  type?: string
  lesson: number
  content?: string
  image?: string
  correctAnswer?: string[]
}> = [
  { id: 1, question: 'Who was the king of Spain?', type: ANSWER_TYPES.SIMPLE, correctAnswer: ['Melchor'], lesson: 1 },
  { id: 2, question: 'Select the two kings between the options', type: ANSWER_TYPES.MULTIPLE, correctAnswer: ['Melchor', 'JuanCarlos1'], lesson: 1 },
  { id: 3, question: 'Tell me what you know about the sky', type: ANSWER_TYPES.FREE, lesson: 1 },
  { id: 4, content: 'Some Lorem Ipsum about it', image: 'srcwhatever', lesson: 1 }

]
