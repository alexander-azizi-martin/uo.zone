import { type SurveyQuestion } from '~/lib/api';

export default class Survey {
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
    'acceptable': 3.75,
    'neither agree nor disagree': 3.5,
    'sometimes': 3,
    'poor': 2,
    'disagree': 3,
    'rarely': 2,
    'useless': 2,
    'not very useful': 2,
    'heavier than average': 2,
    'strongly disagree': 2,
    'very poor': 1,
    'almost never': 1,
    'no feedback': 1,
    'very heavy': 1,
  };

  /**
   * Calculates the average response out of 5 for the given
   * survey question.
   */
  static score(question: SurveyQuestion) {
    let totalValue = 0;
    let totalResponses = 0;
    for (let option in question.options) {
      if (option in Survey.RESPONSE_VALUES) {
        let numResponses = question.options[option];

        totalValue += Survey.RESPONSE_VALUES[option] * numResponses;
        totalResponses += numResponses;
      }
    }

    if (totalResponses === 0) return NaN;
    return totalValue / totalResponses;
  }
}
