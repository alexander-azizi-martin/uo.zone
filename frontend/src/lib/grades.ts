import type { Grades as GradesType } from '~/lib/api';

export class LetterGrade {
  static LETTER_ORDER: string[] = [
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
  static GRADE_COLOR: {[letter: string]: string} = {
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

  _value: number;

  constructor(grade: string | number) {
    if (typeof grade === 'string') {
      this._value = LetterGrade.LETTER_ORDER.indexOf(grade);
    } else {
      this._value = grade;
    }

    if (!(0 <= this._value && this._value <= 10)) {
      throw new Error(
        `LetterGrade value ${this._value} must be between 0 and 10 ${grade}`
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
  letter(): string {
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

export class CourseGrades {
  _totalStudents: number;
  _grades: GradesType;
  _term?: string;
  _section?: string;

  constructor(grades: GradesType, term?: string, section?: string) {
    this._totalStudents = Object.values(grades ?? {}).reduce((a, b) => a + b, 0);
    this._grades = grades;
    this._term = term;
    this._section = section;
  }

  /**
   * Calculates the mean course grade.
   */
  mean(): LetterGrade {
    let average = 0;
    for (let letter in this._grades) {
      const grade = new LetterGrade(letter);
      average += (grade.value() * this._grades[letter]) / this._totalStudents;
    }

    return new LetterGrade(average);
  }

  /**
   * Calculates the mode course grade.
   */
  mode(): LetterGrade {
    let [modeLetter, mode] = ['F', 0];
    for (let letter in this._grades) {
      if (mode < this._grades[letter]) {
        modeLetter = letter;
        mode = this._grades[letter];
      }
    }

    return new LetterGrade(modeLetter);
  }

  /**
   * Gets the number of students who got a certain letter grade.
   */
  count(letter: string): number {
    if (letter in this._grades) return this._grades[letter];
    return 0;
  }

  /**
   * Calculates the percentage of students who received a certain letter grade.
   */
  percentage(letter: string): number {
    if (this._totalStudents == 0) return 0;
    return this.count(letter) / this._totalStudents;
  }

  /**
   * Gets the total number of students in the course.
   */
  totalStudents(): number {
    return this._totalStudents;
  }

  /**
   * Gets the term the course was taken.
   */
  term(): string | undefined {
    return this._term;
  }

  /**
   * Gets the section of the course.
   */
  section(): string | undefined {
    return this._section;
  }

  /**
   * Adds grades to current course grades.
   */
  add(grades: CourseGrades) {
    for (let key in grades._grades) {
      if (!(key in this._grades)) this._grades[key] = 0;

      this._grades[key] += grades._grades[key];
    }

    this._totalStudents += grades._totalStudents;
  }
}
