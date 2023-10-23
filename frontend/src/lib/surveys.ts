import { Survey } from '~/lib/api';

export class Surveys {
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
    for (let option in this._surveys[question].options) {
      switch (option) {
        case 'excellent':
        case 'strongly agree':
        case 'almost always':
          value += 5 * this._surveys[question].options[option];
          break;
        case 'good':
        case 'agree':
        case 'often':
          value += 4 * this._surveys[question].options[option];
          break;
        case 'acceptable':
        case 'neither agree nor disagree':
        case 'sometimes':
          value += 3 * this._surveys[question].options[option];
          break;
        case 'poor':
        case 'disagree':
        case 'rarely':
          value += 2 * this._surveys[question].options[option];
          break;
        case 'very poor':
        case 'strongly disagree':
        case 'almost never':
          value += 1 * this._surveys[question].options[option];
          break;
        default:
          value += 0;
          break;
      }
    }

    this._scoreCache.set(question, value / this.totalResponses(question));
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
    return this._surveys[question].total_responses;
  }

  /**
   * Gets the number of questions in the survey.
   */
  numQuestions() {
    return this._numQuestions;
  }
}
