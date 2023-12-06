/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

import chalk from 'chalk';

/**
 * @class
 *
 * @property {Array} dataLines - The data lines.
 * @property {Array} cards - The cards.
 * @property {boolean} isLoggingEnabled - Whether logging is enabled.
 * @property {Array} cardIndexes - The card indexes.
 * @property {number} totalPoints - The total points.
 * @property {number} totalScratchcards - The total scratchcards.
 */
export class Day4 {
  /**
   * @param {Array} dataLines - The data lines.
   * @param {boolean} isLoggingEnabled - Whether logging is enabled.
   *
   * @example
   * const solution = new Day4(dataLines, true);
   */
  constructor(dataLines, isLoggingEnabled) {
    this.dataLines = dataLines;
    this.cards = [];
    this.isLoggingEnabled = isLoggingEnabled;
    this.cardIndexes = [];
    this.totalSum = {
      part1: 0,
      part2: 0,
    };
  }

  /**
   * Processes the first part of the solution.
   * Parses the card lines, calculates the total points, and prepares the card indexes.
   *
   * @throws {Error} If the dataLines property is not a non-empty array.
   * @example
   * solution.part1();
   */
  part1() {
    if (!Array.isArray(this.dataLines) || this.dataLines.length === 0) {
      throw new Error('Invalid input: dataLines must be a non-empty array');
    }

    this.processCards();

    this.totalSum.part1 = this.cards.reduce((sum, card) => sum + card.points, 0);

    if (this.isLoggingEnabled) {
      this.cards.forEach((card) => {
        const logProperties = {
          matchingNumbers: card.matchingNumbers,
          points: card.points,
          isClone: card.isClone,
        };
        const cardLine = this.dataLines[card.index - 1];
        this.logCard(cardLine, logProperties);
      });
    }

  }

  /**
   * Processes the second part of the solution.
   * Loops through the cards, calculates the total scratchcards, and logs the index overview.
   *
   * @throws {Error} If the dataLines property is not a non-empty array.
   * @example
   * solution.part2();
   */
  part2() {
    if (!Array.isArray(this.dataLines) || this.dataLines.length === 0) {
      throw new Error('Invalid input: dataLines must be a non-empty array');
    }

    this.processCards();

    this.cardIndexes = this.cardIndexes.flat();

    // Call the function
    this.loopThroughCards();

    const originalCardIndexes = Array.from({ length: this.dataLines.length }, (_, i) => i + 1);

    this.cardIndexes.unshift(originalCardIndexes); // Add the original cardIndexes to the beginning of this.cardIndexes
    this.cardIndexes = this.cardIndexes.flat(); // Flatten the array

    const indexOverview = this.cardIndexes.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    this.totalSum.part2 = Object.values(indexOverview).reduce((a, b) => a + b, 0);

    if (this.isLoggingEnabled) {
      console.log(indexOverview);
    }
  }

  // Common method to process cards
  processCards() {
    const cards = new Array(this.dataLines.length);
    const cardIndexes = new Array(this.dataLines.length);

    this.dataLines.forEach((cardLine, index) => {
      const card = this.parseCard(cardLine);
      cards[index] = card;
      cardIndexes[index] = index + 1;
    });

    this.cards = cards;

    this.cardIndexes = cards.flatMap((card) => {
      if (card.cardIndexes.length > 0) {
        return card.cardIndexes;
      }
      return [];
    });
  }

  /**
   * This method loops through the card indexes and processes each one.
   *
   * @example
   * solution.loopThroughCards();
   */
  loopThroughCards() {
    const queue = [...this.cardIndexes];

    while (queue.length > 0) {
      const index = queue.shift();
      const { cardIndexes } = this.cards[index - 1];

      if (cardIndexes.length > 0) {
        this.cardIndexes.push(...cardIndexes);
        queue.push(...cardIndexes);
      }
    }
  }

  /**
  * This method splits a card line into its constituent parts.
  *
  * @param {string} cardLine - The card line to split.
  * @returns {Array} The split card line.
  *
  * @example
  * const cardLine = "1 2 3 4 5";
  * const splitLine = solution.splitCard(cardLine);
  * console.log(splitLine); // Outputs: ["1", "2", "3", "4", "5"]
  */
  splitCard(cardLine) {
    const { cardIndexPart, winnerNumberPart, myNumberPart } = this.splitCardIntoParts(cardLine);
    const index = this.splitCardIndexFromPart(cardIndexPart);
    const winnerNumbers = this.splitCardNumbersFromPart(winnerNumberPart);
    const myNumbers = this.splitCardNumbersFromPart(myNumberPart);

    return {
      index,
      winnerNumbers,
      myNumbers,
    };
  }

  /**
   * This method splits a card line into its constituent parts.
   *
   * @param {string} cardLine - The card line to be split.
   * @returns {Array.<string>} The parts of the card line.
   *
   * @example
   * const cardLine = "1 2 3 4 5";
   * const parts = solution.splitCardIntoParts(cardLine);
   * console.log(parts); // Outputs: ["part1", "part2", "part3"]
   */
  splitCardIntoParts(cardLine) {
    const [cardIndexPart, numbersPart] = cardLine.split(': ');
    const [winnerNumberPart, myNumberPart] = numbersPart.split(' | ');
    return { cardIndexPart, winnerNumberPart, myNumberPart };
  }

  /**
   * This method splits the card index from a part.
   *
   * @param {string} cardIndexPart - The part to extract the index from.
   * @returns {number} The extracted index.
   *
   * @example
   * let index = splitCardIndexFromPart("card 4");
   * console.log(index); // Outputs: 4
   */
  splitCardIndexFromPart(cardIndexPart) {
    const indexArray = cardIndexPart.split(' ');
    const index = Number(indexArray[indexArray.length - 1]);
    return index;
  }

  /**
   * This method splits the card numbers from a part.
   *
   * @param {string} numberPart - The part to extract the numbers from.
   * @returns {Array.<number>} The extracted numbers.
   *
   * @example
   * let numbers = splitCardNumbersFromPart("1 2 3 4 5");
   * console.log(numbers); // Outputs: [1, 2, 3, 4, 5]
   */
  splitCardNumbersFromPart(numberPart) {
    return numberPart.split(' ').filter(item => item !== '').map(Number);
  }

  /**
   * Parses a card line into its constituent parts.
   *
   * @param {string} cardLine - The card line to be parsed.
   * @param {boolean} isClone - A flag indicating whether the card is a clone.
   * @returns {Object} An object containing the parsed parts of the card line.
   *
   * @example
   * let parsedCard = parseCard("card 4: 1 2 3 4 5", false);
   * console.log(parsedCard); // Outputs: { index: 4, points: 2, cardIndexes: [1, 2, 3, 4, 5] }
   */
  parseCard(cardLine, isClone = false) {
    const parsedData = this.splitCard(cardLine);
    const matchingNumbers = this.parseCardMatchingNumbers(parsedData.winnerNumbers, parsedData.myNumbers);
    const points = this.parseCardPoints(matchingNumbers);
    const cardIndexes = this.parseCardIndexes(Number(parsedData.index), matchingNumbers.length);

    return {
      index: parsedData.index,
      points,
      cardIndexes,
      matchingNumbers,
    };
  }

  /**
   * This method parses the matching numbers from a card.
   *
   * @param {Array.<number>} winnerNumbers - The winning numbers.
   * @param {Array.<number>} myNumbers - The player's numbers.
   * @returns {Array.<number>} The matching numbers.
   *
   * @example
   * let matchingNumbers = parseCardMatchingNumbers([1, 2, 3, 4, 5], [2, 3, 6, 7, 8]);
   * console.log(matchingNumbers); // Outputs: [2, 3]
   */
  parseCardMatchingNumbers(winnerNumbers, myNumbers) {
    const winnerNumbersSet = new Set(winnerNumbers);
    return myNumbers.filter(num => winnerNumbersSet.has(num));
  }

  /**
   * This method parses the points from a card.
   *
   * @param {Array.<number>} matchingNumbers - The matching numbers.
   * @returns {number} The total points.
   *
   * @example
   * let points = parseCardPoints([2, 3]);
   * console.log(points); // Outputs: 2
   */
  parseCardPoints(matchingNumbers) {
    return matchingNumbers.length > 0 ? 2 ** (matchingNumbers.length - 1) : 0;
  }

  /**
   * This method parses the indexes from a card.
   *
   * @param {number} index - The starting index.
   * @param {number} length - The length of the array to generate.
   * @returns {Array.<number>} The indexes.
   *
   * @example
   * let indexes = parseCardIndexes(0, 5);
   * console.log(indexes); // Outputs: [1, 2, 3, 4, 5]
   */
  parseCardIndexes(index, length) {
    return Array.from({ length }, (_, i) => i + index + 1);
  }

  /**
   * Logs the card line with updates and points if applicable.
   *
   * @param {string} cardLine - The card line to log.
   * @param {Object} logProperties - The properties to use for logging.
   * @param {Array.<number>} logProperties.matchingNumbers - The matching numbers.
   * @param {boolean} logProperties.isClone - A flag indicating whether the card is a clone.
   * @param {number} logProperties.points - The points earned.
   *
   * @example
   * logCard("Card 4: 1 2 3 4 5", { matchingNumbers: [2, 3], isClone: false, points: 2 });
   * // Outputs: "Card 4: 1 2 3 4 5 points: 2" with 2 and 3 highlighted
   */
  logCard(cardLine, logProperties) {
    const updatedCardLine = this.logCardLineUpdate(cardLine, logProperties.matchingNumbers);
    if (logProperties.isClone) {
      console.log(updatedCardLine);
    } else if (logProperties.points > 0) {
      console.log(updatedCardLine, `${chalk.dim.cyan('points:')} ${chalk.yellow(logProperties.points)}`);
    } else {
      console.log(updatedCardLine);
    }
  }

  /**
   * This method logs the update of a card line.
   *
   * @param {string} cardLine - The card line to update.
   * @param {Array.<number>} matchingNumbers - The matching numbers.
   * @returns {string} The updated card line.
   *
   * @example
   * let updatedLine = logCardLineUpdate("Card 4: 1 2 3 4 5", [2, 3]);
   * console.log(updatedLine); // Outputs: "Card 4: 1 2 3 4 5" with 2 and 3 highlighted
   */
  logCardLineUpdate(cardLine, matchingNumbers) {
    const cardColor = matchingNumbers.length > 0 ? chalk.green : chalk.red;
    let updatedCardLine = this.logCardColorUpdate(cardLine, cardColor, matchingNumbers);
    updatedCardLine = this.logCardNumberHighlight(updatedCardLine, matchingNumbers);
    return updatedCardLine;
  }

  /**
   * This method logs the update of a card color.
   *
   * @param {string} cardLine - The card line to update.
   * @param {string} cardColor - The color to update.
   * @param {Array.<number>} matchingNumbers - The matching numbers.
   * @returns {string} The updated card line.
   *
   * @example
   * let updatedLine = logCardColorUpdate("Card 4: 1 2 3 4 5", chalk.green, [2, 3]);
   * console.log(updatedLine); // Outputs: "Card 4: 1 2 3 4 5" in green color
   */
  logCardColorUpdate(cardLine, cardColor, matchingNumbers) {
    return matchingNumbers.length > 0
      ? cardLine.replace('Card', cardColor('Card'))
      : cardLine.replace(cardLine, cardColor(cardLine));
  }

  /**
   * This method logs the highlight of matching numbers.
   *
   * @param {string} cardLine - The card line to highlight.
   * @param {Array.<number>} matchingNumbers - The matching numbers.
   * @returns {string} The highlighted card line.
   *
   * @example
   * let highlightedLine = logCardNumberHighlight("Card 4: 1 2 3 4 5", [2, 3]);
   * console.log(highlightedLine); // Outputs: "Card 4: 1 2 3 4 5" with 2 and 3 highlighted
   */
  logCardNumberHighlight(cardLine, matchingNumbers) {
    const [cardName, numbers] = cardLine.split(':');
    const parts = cardName.split(' ');
    const cardString = parts.slice(0, -1).join(' ');
    const cardIndex = parts[parts.length - 1];

    if (matchingNumbers.length > 0) {
      const replacements = new Map(matchingNumbers.map((num) => {
        if (num >= 0 && num < 10) { // check if num is a single digit
          return [`  ${num}`, `  ${chalk.green(`${num}`)}`];
        }
        return [` ${num}`, ` ${chalk.green(num)}`];

      }));
      const regex = new RegExp(Array.from(replacements.keys()).join('|'), 'g');
      return `${cardString} ${cardIndex.replace(cardIndex, chalk.yellow(`${cardIndex}:`))}${chalk.grey(numbers.replace(regex, match => replacements.get(match)))}`;
    }
    return cardLine;
  }
}
