export type Letter =
  | 'EIN'
  | 'ABS'
  | 'NS'
  | 'P'
  | 'S'
  | 'F'
  | 'E'
  | 'D'
  | 'D+'
  | 'C'
  | 'C+'
  | 'B'
  | 'B+'
  | 'A-'
  | 'A'
  | 'A+';

export class Grade {
  static NON_NUMERICAL_GRADES: Letter[] = ['P', 'S', 'NS'];

  static NUMERICAL_GRADES: Letter[] = [
    'F',
    'E',
    'D',
    'D+',
    'C',
    'C+',
    'B',
    'B+',
    'A-',
    'A',
    'A+',
  ];

  // prettier-ignore
  static GRADE_VALUES = {
    'ABS': NaN, 
    'EIN': NaN,
    'NS': NaN,
    'P': NaN,
    'S': NaN,
    'F': 0,
    'E': 1,
    'D': 2,
    'D+': 3,
    'C': 4,
    'C+': 5,
    'B': 6,
    'B+': 7,
    'A-': 8,
    'A': 9,
    'A+': 10,
  };

  // prettier-ignore
  static BADGE_GRADE_COLOR = {
    'A+': 'bg-green-100 text-green-800',
    'A': 'bg-green-100 text-green-800',
    'A-': 'bg-green-100 text-green-800',
    'B+': 'bg-yellow-100 text-yellow-800',
    'B': 'bg-yellow-100 text-yellow-800',
    'C+': 'bg-orange-100 text-orange-800',
    'C': 'bg-orange-100 text-orange-800',
    'D+': 'bg-orange-100 text-orange-800',
    'D': 'bg-red-100 text-red-800',
    'E': 'bg-red-100 text-red-800',
    'F': 'bg-red-100 text-red-800',
    'P': 'bg-purple-100 text-purple-800',
    'S': 'bg-cyan-100 text-cyan-800',
    'NS': 'bg-red-100 text-red-800',
    'ABS': 'bg-gray-100 text-gray-800', 
    'EIN': 'bg-gray-100 text-gray-800',
  };

  // prettier-ignore
  static BAR_GRADE_COLOR ={
    'P': 'bg-purple-400',
    'S': 'bg-cyan-400',
    'NS': 'bg-red-400', 
  };

  static badgeColor(grade: Letter | number) {
    const letterGrade = Grade.letter(grade);

    if (letterGrade in Grade.BADGE_GRADE_COLOR) {
      return Grade.BADGE_GRADE_COLOR[letterGrade];
    }

    throw new Error(`No badge color for '${grade}'.`);
  }

  static barColor(grade: Letter | number) {
    const letterGrade = Grade.letter(grade);

    if (grade in Grade.BAR_GRADE_COLOR) {
      return Grade.BAR_GRADE_COLOR[letterGrade as 'P' | 'S' | 'NS'];
    }

    throw new Error(`No bar color for '${grade}'.`);
  }

  static letter(grade: Letter | number) {
    if (typeof grade === 'string') {
      return grade;
    } else if (0 <= grade && grade <= 10) {
      return Grade.NUMERICAL_GRADES[Math.round(grade)];
    }

    throw new Error(`Grade '${grade}' is invalid.`);
  }

  static value(grade: Letter | number) {
    if (typeof grade === 'string') {
      return Grade.GRADE_VALUES[grade];
    } else if (0 <= grade && grade <= 10) {
      return Math.round(grade);
    }

    throw new Error(`Grade '${grade}' is invalid.`);
  }
}
