import { ROLES } from "./constants";

export const isATeacher = (user: any): boolean => {
  return user.role === ROLES.TEACHER;
};

export const isAStudent = (user: any): boolean => {
  return user.role === ROLES.STUDENT;
};
