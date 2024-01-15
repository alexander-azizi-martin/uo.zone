export type Letter =
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
  static LETTER_ORDER: Letter[] = [
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
  };

  static isGrade(grade: string) {
    return grade in LetterGrade.LETTER_ORDER;
  }

  _value: number;

  constructor(grade: Letter | number) {
    if (typeof grade === 'string') {
      this._value = LetterGrade.LETTER_ORDER.indexOf(grade);
    } else {
      this._value = grade;
    }

    if (!(0 <= this._value && this._value <= 10)) {
      throw new Error(
        `LetterGrade value ${this._value} must be between 0 and 10: ${grade}`
      );
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
    const roundedGrade = Math.round(this._value);
    return LetterGrade.LETTER_ORDER[roundedGrade];
  }

  /**
   * Gets a color representing the grade's value.
   */
  color(): string {
    return LetterGrade.GRADE_COLOR[this.letter()];
  }
}
