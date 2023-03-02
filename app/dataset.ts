import { ANSWER_TYPES, ROLES } from './constants'

export const users: Array<{ id: number, authToken: string, role: string, name: string, seenContent: number[] }> = [
  { id: 1, authToken: 'teacher', role: ROLES.TEACHER, name: 'Godofrasio', seenContent: [] },
  { id: 2, authToken: 'student', role: ROLES.STUDENT, name: 'Teovigildo', seenContent: [1, 2] }
]

export const levels: Array<{ id: number, title: string, description: string, lessons: number[] }> = [
  { id: 1, title: 'Basic', description: 'Beginner level', lessons: [1, 2] },
  { id: 2, title: 'Intermediate', description: 'Intermediate level', lessons: [] },
  { id: 3, title: 'Advanced', description: 'Advanced level', lessons: [3] }
]

export const lessons: Array<{ id: number, title: string, description: string, level: number }> = [
  { id: 1, title: 'Basic Ethics', description: 'Ethic for trainees', level: 1 },
  { id: 2, title: 'Basic Physics', description: 'Lorem ipsum basic', level: 1 },
  { id: 3, title: 'Advanced Physics', description: 'Advanced level', level: 3 }
]

export const textContent: Array<{
    id: number
    content: string,
    image: string,
    lesson: number
  }> = [
    { id: 1, content: "Ethic basics 1", image: "src whatever", lesson: 1 },
    { id: 1, content: "Ethic basics 2", image: "src whatever", lesson: 1 },
  ]

export const questions: Array<{
    id: number
    question: string
    type: string
    lesson: number
    correctAnswer: string[]
  }> = [
    { id: 1, 
      question: 'Who was the king of Spain?', 
      type: ANSWER_TYPES.SIMPLE, 
      correctAnswer: ['Melchor'], 
      lesson: 1 
    },
  ]
  
export const answers: Array<{
    id: number,
    student: number,
    question: number,
    answer: string[],
    correct: boolean,
}> = [
    { id: 1, student: 1, question: 1, answer: ["Melchor"], correct: true}
]
