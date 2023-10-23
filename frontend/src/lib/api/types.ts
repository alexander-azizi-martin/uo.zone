export interface Survey {
  question: string;
  options: { [option: string]: number };
  total_responses: number;
}

export interface Subject {
  code: string;
  subject: string;
  faculty: string;
  grades: Grades;
  total_enrolled: number;
}

export interface Grades {
  [grade: string]: number;
}

export interface CourseSection {
  term: string;
  code: string;
  section: string;
  grades: Grades;
  total_enrolled: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  units: number | null;
  grades: Grades;
  total_enrolled: number;
  surveys: Survey[];
  subject: Subject;
}

export interface Professor {
  id: number;
  name: string;
  surveys: Survey[];
  grades: Grades;
  total_enrolled: number;
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
