import type { Survey } from '~/lib/api';

export class Surveys {
  // prettier-ignore
  static RESPONSE_VALUES: any = {
    'excellent': 5,
    'strongly agree': 5,
    'almost always': 5,
    'very useful': 5,
    'very light': 5,
    'lighter than average': 4,
    'good': 4,
    'agree': 4,
    'often': 4,
    'useful': 4,
    'average': 4,
    'acceptable': 3.75,
    'neither agree nor disagree': 3.5,
    'sometimes': 3,
    'poor': 2,
    'disagree': 2,
    'rarely': 2,
    'useless': 2,
    'not very useful': 2,
    'heavier than average': 2,
    'very poor': 1,
    'strongly disagree': 1,
    'almost never': 1,
    'no feedback': 1,
    'very heavy': 1,
  };

  _surveys: { [question: string]: Survey };
  _numQuestions: number;

  constructor(surveys: Survey[]) {
    this._surveys = {};
    this._numQuestions = surveys.length;

    if (!surveys) return;

    for (let survey of surveys) {
      this._surveys[survey.question] = survey;
    }
  }

  /**
   * Checks whether one of the surveys has the given question.
   */
  has(question: string): boolean {
    return question in this._surveys;
  }

  /**
   * Gets the number of questions in the survey.
   */
  numQuestions() {
    return this._numQuestions;
  }

  /**
   * Gets the total number of responses for the given question.
   */
  totalResponses(question: string): number {
    let responses = 0;
    for (let option in this._surveys[question]?.options) {
      if (option in Surveys.RESPONSE_VALUES) {
        responses += this._surveys[question].options[option];
      }
    }
    return responses;
  }

  /**
   * Calculates the average response out of 5 for the given question.
   */
  score(question: string): number {
    let total = 0;
    let totalResponses = 0;
    for (let option in this._surveys[question]?.options) {
      if (option in Surveys.RESPONSE_VALUES) {
        let numResponses = this._surveys[question].options[option];

        total += Surveys.RESPONSE_VALUES[option] * numResponses;
        totalResponses += numResponses;
      }
    }

    if (totalResponses === 0) return NaN;
    return total / totalResponses;
  }

  /**
   * Calculated the average score of the given questions.
   */
  averageScore(questions: string[]): number {
    let total = 0;
    let numQuestions = 0;
    for (let question of questions) {
      let score = this.score(question);

      if (!Number.isNaN(score)) {
        total += this.score(question);
        numQuestions++;
      }
    }

    if (numQuestions === 0) return NaN;
    return total / numQuestions;
  }
}
