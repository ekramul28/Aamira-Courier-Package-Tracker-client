import type { ICourse } from "./course";
import type { TStudent } from "./student";

/**
 * @description The grade of a course
 * @author Sp-y-d-e-r
 */
export type TGrade = "A" | "B" | "C" | "D" | "F" | "NA";

/**
 * @description The marks of a course
 * @author Sp-y-d-e-r
 */
export type TEnrolledCourseMarks = {
  classTest1: number;
  classTest2: number;
  classTest3: number;
  classTest4: number;
  finalExam: number;
};

/**
 * @description The subject type
 * @author Sp-y-d-e-r
 */
export type TSubject = {
  name: string;
  credits: number;
  isDeleted?: boolean;
  isDefault?: boolean;
};

/**
 * @description The marks of a subject
 * @author Sp-y-d-e-r
 */
export type TSubjectMarks = {
  subjectName: string;
  marks: TEnrolledCourseMarks;
};

/**
 * @description The enrolled course
 * @author Sp-y-d-e-r
 * @param _id - The id of the enrolled course
 * @param semesterRegistration - The id of the semester registration
 * @param academicSemester - The id of the academic semester
 * @param academicFaculty - The id of the academic faculty
 * @param academicDepartment - The id of the academic department
 * @param offeredCourse - The id of the offered course
 * @param course - The course object
 * @param student - The student object
 * @param faculty - The id of the faculty
 * @param isEnrolled - Whether the student is enrolled in the course
 * @param courseMarks - The marks of the course
 * @param subjectMarks - The marks of the subjects
 * @param grade - The grade of the course
 * @param gradePoints - The grade points of the course
 * @param isPassed - Whether the student passed the course
 * @param selectedSubjects - The selected subjects of the course
 * @param defaultSubjects - The default subjects of the course
 */
export type TEnrolledCourse = {
  _id: string;
  semesterRegistration: string;
  academicSemester: string;
  academicFaculty: string;
  academicDepartment: string;
  offeredCourse: string;
  course: ICourse;
  student: TStudent;
  faculty: string;
  isEnrolled: boolean;
  courseMarks: TEnrolledCourseMarks;
  subjectMarks?: TSubjectMarks[];
  grade: TGrade;
  gradePoints: number;
  isPassed: boolean;
  selectedSubjects?: string[];
  defaultSubjects?: TSubject[];
  isExamDone: boolean;
  isNextSemesterRegistrationDone: boolean;
};
