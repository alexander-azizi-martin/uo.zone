import { Survey } from '~/lib/api';

export class Surveys {
  // prettier-ignore
  static RESPONSE_VALUES: any = {
    'excellent': 5,
    'strongly agree': 5,
    'almost always': 5,
    'very useful': 5,
    'very light': 5,
    'lighter than average': 4.5,
    'good': 4,
    'agree': 4,
    'often': 4,
    'useful': 4,
    'average': 4,
    'neither agree nor disagree': 3.5,
    'acceptable': 3.5,
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
  _scoreCache: Map<string, number>;

  constructor(surveys: Survey[]) {
    this._surveys = {};
    this._numQuestions = surveys.length;
    this._scoreCache = new Map();

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
   * Calculates the average response out of 5 for the given question.
   */
  score(question: string): number {
    if (!this.has(question)) return 0;
    if (this._scoreCache.has(question))
      return this._scoreCache.get(question) as number;

    let value = 0;
    let total = 0;
    for (let option in this._surveys[question].options) {
      if (option in Surveys.RESPONSE_VALUES) {
        let numResponses = this._surveys[question].options[option];

        value += Surveys.RESPONSE_VALUES[option] * numResponses;
        total += numResponses;
      }
    }

    this._scoreCache.set(question, value / total);
    return this._scoreCache.get(question) as number;
  }

  /**
   * Calculated the average score of all questions.
   */
  overall(): number {
    let result = 0;
    for (let question in this._surveys) result += this.score(question);
    return result / this._numQuestions;
  }

  /**
   * Gets the total number of responses for the given question.
   */
  totalResponses(question: string): number {
    if (!this.has(question)) return 0;

    return Object.entries(this._surveys[question].options).reduce(
      (acc, [question, responses]) =>
        acc + (question in Surveys.RESPONSE_VALUES ? acc + responses : acc),
      0
    );
  }

  /**
   * Gets the number of questions in the survey.
   */
  numQuestions() {
    return this._numQuestions;
  }
}
