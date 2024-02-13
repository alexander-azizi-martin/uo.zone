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

export default class LetterGrade {
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
  static GRADE_COLOR = {
    'A+': 'green',
    'A': 'green',
    'A-': 'green',
    'B+': 'yellow',
    'B': 'yellow',
    'C+': 'orange',
    'C': 'orange',
    'D+': 'orange',
    'D': 'red',
    'E': 'red',
    'F': 'red',
    'P': 'purple',
    'S': 'linkedin',
    'NS': 'red',
    'ABS': 'gray', 
    'EIN': 'gray',
  };

  _value: number;
  _letter: Letter;

  constructor(grade: Letter | number) {
    if (typeof grade === 'string') {
      this._value = LetterGrade.GRADE_VALUES[grade];
      this._letter = grade;
    } else {
      if (!(0 <= grade && grade <= 10)) {
        throw new Error(`LetterGrade value ${grade} must be between 0 and 10`);
      }

      this._value = grade;
      this._letter = Object.keys(LetterGrade.GRADE_VALUES).find(
        (key) => LetterGrade.GRADE_VALUES[key as Letter] === Math.round(grade)
      ) as Letter;
    }
  }

  /**
   * Gets the numeric value of the letter grade.
   */
  value(): number {
    return this._value;
  }

  /**
   * Gets the letter corresponding to the grade's value.
   */
  letter(): Letter {
    return this._letter;
  }

  /**
   * Gets a color representing the grade's value.
   */
  color(): string {
    return LetterGrade.GRADE_COLOR[this._letter];
  }
}
