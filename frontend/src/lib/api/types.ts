export interface SurveyQuestion {
  question: string;
  options: { [option: string]: number };
  totalResponses: number;
}

export interface Subject {
  code: string;
  subject: string;
  faculty: string;
  grades: Grades;
  totalEnrolled: number;
}

export interface Grades {
  [grade: string]: number;
}

export interface CourseSection {
  term: string;
  code: string;
  section: string;
  grades: Grades;
  totalEnrolled: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  units: number | null;
  grades: Grades;
  totalEnrolled: number;
  survey: SurveyQuestion[];
  subject: Subject;
}

export interface RateMyProfessorReview {
  link: string;
  rating: number;
  difficulty: number;
  numRatings: number;
  department: string;
}

export interface Professor {
  id: number;
  name: string;
  survey: SurveyQuestion[];
  grades: Grades;
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
  courses: Course[];
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
