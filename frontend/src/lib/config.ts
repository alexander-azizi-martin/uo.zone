import { msg } from "@lingui/macro";

export const searchDurations = {
  enter: 0.3,
  exit: 0.75,
};

export const gradeGradient = [
  { color: '#ff0000', offset: 0 },
  { color: '#ec6c17', offset: 40 },
  { color: '#e89029', offset: 50 },
  { color: '#ecc94b', offset: 65 },
  { color: '#ecc94b', offset: 80 },
  { color: '#c0c246', offset: 85 },
  { color: '#93ba41', offset: 90 },
  { color: '#38a169', offset: 95 },
  { color: '#38a169', offset: 100 },
];

export const professorQuestions = {
  // 'I find that the professor as a teacher is': msg`teacher`,
  'I find the professor well prepared for class': msg`Prepared`,
  'I think the professor conveys the subject matter effectively': msg`Communication`,
  'The professors feedback contributes to my learning': msg`Feedback`,
  'The professor is available to address questions outside of class': msg`Availability`,
  'The professor shows respect towards the students': msg`Respect`,
  'Instructions for completing activities and assignments are clear': msg`Instructions`,
};

export const courseQuestions = {
  'The course is well organized': msg`Organized`,
  'Course expectations are clearly explained': msg`Expectations`,
  'I have learned a lot in this course': msg`Learning`,
  'I would recommend this course to another student': msg`Recommend`,
  'In comparison with my other courses, the workload for this course is': msg`Workload`,
  'Assignments and/or exams closely reflect what is covered in class': msg`Activities`,
};

export const openGraph = {
  title: 'UO Grades',
  description: 'View all the past grades for courses taken at the University of Ottawa.',
  url: 'https://uo.zone',
  theme: '#651d32',
  image: 'https://uo.zone/images/homepage.png'
};
