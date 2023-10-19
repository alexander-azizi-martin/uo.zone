export interface Survey {
  question: string;
  options: { [option: string]: number };
  total_responses: number;
}

export interface CourseSection {
  term: string;
  code: string;
  grades: { [grade: string]: number };
  total_enrolled: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  units: number;
  grades: { [grade: string]: number };
  total_enrolled: number;
  surveys: Survey[];
}

export interface Professor {
  id: number;
  name: string;
  surveys: Survey[];
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

export interface Subject {
  code: string;
  subject: string;
  faculty: string;
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
