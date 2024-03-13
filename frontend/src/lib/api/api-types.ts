import { type Letter } from "~/lib/letterGrade";

export interface SurveyQuestion {
  question: string;
  options: { [option: string]: number };
  totalResponses: number;
}

// prettier-ignore
export interface GradeInfo {
  mean?: number;
  median: Letter;
  mode: Letter;
  total: number;
  grades: {
    'A+': number;
    'A': number;
    'A-': number;
    'B+': number;
    'B': number;
    'C+': number;
    'C': number;
    'D+': number;
    'D': number;
    'E': number;
    'F': number;
    'EIN': number;
    'NS': number;
    'NC': number;
    'ABS': number;
    'P': number;
    'S': number;
  };
}

export interface Subject {
  code: string;
  subject: string;
  faculty: string;
  gradeInfo?: GradeInfo;
  totalEnrolled: number;
}

export interface CourseSection {
  term: string;
  code: string;
  section: string;
  gradeInfo?: GradeInfo;
  totalEnrolled: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  components: string[];
  languages: string[];
  requirements?: string;
  units: number | null;
  gradeInfo?: GradeInfo;
  totalEnrolled: number;
  survey: SurveyQuestion[];
  subject: Subject;
}

export interface RateMyProfessorReview {
  link: string;
  rating: number;
  difficulty: number;
  numRatings: number;
  department?: string;
}

export interface Professor {
  id: number;
  name: string;
  survey: SurveyQuestion[];
  gradeInfo: GradeInfo;
  totalEnrolled: number;
  rmpReview?: RateMyProfessorReview;
}

export interface CourseWithSections extends Course {
  sections: CourseSection[];
}

export interface ProfessorWithCourses extends Professor {
  courses: CourseWithSections[];
}

export interface ProfessorWithSections extends Professor {
  sections: CourseSection[];
}

export interface CourseWithProfessors extends Course {
  professors: ProfessorWithSections[];
}

export interface SubjectWithCourses extends Subject {
  // courses: Course[];
  coursesCount: number;
}

export interface CourseResult {
  code: string;
  title: string;
}

export interface ProfessorResult {
  id: number;
  name: string;
}

export interface SubjectResult {
  code: string;
  subject: string;
}

export interface SearchResults {
  courses: CourseResult[];
  professors: ProfessorResult[];
  subjects: SubjectResult[];
}
