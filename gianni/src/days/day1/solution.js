/* DIALY MESSAGE
============================================================================= */

/*
  This has been a colabiration / code battle between Me and CoPilot.
  Coming up with the solution for part 2 was a bit of a challenge, but we got there in the end.
  When i wrote out a repeatable solution for part 2, CoPilot was able to come up with almost work more optimised solution.
  With some tweaking this is the end result.
*/

/* IMPORTS
============================================================================= */

import chalk from 'chalk';
import { getRuntime, getFileSize, loadTextFile } from '../../utils/getters.js';
import { log } from '../../utils/log.js';

/* CONSTANTS
============================================================================= */

const DAY = 'day1';
const NUMERIC_WORDS = [
  { word: 'one', number: 1 },
  { word: 'two', number: 2 },
  { word: 'three', number: 3 },
  { word: 'four', number: 4 },
  { word: 'five', number: 5 },
  { word: 'six', number: 6 },
  { word: 'seven', number: 7 },
  { word: 'eight', number: 8 },
  { word: 'nine', number: 9 },
];

/* CORE FUNCTIONS
============================================================================= */
/**
 * @namespace D1_Helpers
 */

/**
 * Function to find the first or last numeric word in a string.
 *
 * @memberof D1_Helpers
 * 
 * @example
 * const result = findNumericWord('Hello 123 world 456', 'backward', true);
 * console.log(result); // { word: '456', type: 'number' }
 *
 * @param {string} sourceString - The source string to search.
 * @param {string} [direction='forward'] - The direction to search ('forward' or 'backward').
 * @param {boolean} [numbersOnly=false] - Whether to only look for numbers.
 * @returns {Object} The found word and its type ('number' or 'word').
 */
const findNumericWord = (sourceString, direction = 'forward', numbersOnly = false) => {
  // Initialize a new string to store the word
  let newString = '';
  // Initialize a variable to store the found word
  let foundWord = null;

  // Define the loop condition based on the direction
  const loopCondition = direction === 'forward'
    ? i => i < sourceString.length
    : i => i >= 0;

  // Define the loop increment based on the direction
  const loopIncrement = direction === 'forward'
    ? i => i + 1
    : i => i - 1;

  // Loop over the source string in the specified direction
  for (let i = direction === 'forward' ? 0 : sourceString.length - 1; loopCondition(i); i = loopIncrement(i)) {
    // If the current character is a number
    if (!Number.isNaN(Number(sourceString[i]))) {
      // Find the corresponding numeric word and set it as the found word
      foundWord = { ...NUMERIC_WORDS[parseInt(sourceString[i], 10) - 1], type: 'number' };
      // Break the loop
      break;
    }
    // If we're not looking for numbers only
    if (!numbersOnly) {
      // Add the current character to the new string
      newString = direction === 'forward' ? newString + sourceString[i] : sourceString[i] + newString;
      // Find the numeric word that matches the new string
      const numberWord = NUMERIC_WORDS.find(nw => newString.includes(nw.word));
      // If a numeric word is found
      if (numberWord) {
        // Set it as the found word
        foundWord = { ...numberWord, type: 'word' };
        // Break the loop
        break;
      }
    }
  }

  // Return the found word
  return foundWord;
};

/**
 * Function to replace the last occurrence of a substring in a source string.
 *
 * @memberof D1_Helpers
 *
 * @example
 * const result = replaceLastOccurrence('Hello world world', 'world', 'everyone');
 * console.log(result); // 'Hello world everyone'
 *
 * @param {string} sourceString - The source string.
 * @param {string} substringToReplace - The substring to replace.
 * @param {string} replace - The string to replace the substring with.
 * @returns {string} The source string with the last occurrence of the substring replaced.
 */
const replaceLastOccurrence = (sourceString, substringToReplace, replace) => {
  // Find the last index of the substring in the source string
  const lastIndex = sourceString.lastIndexOf(substringToReplace);

  // If the substring is not found, return the original source string
  if (lastIndex === -1) {
    return sourceString;
  }

  // Get the part of the source string before the last occurrence of the substring
  const begin = sourceString.substring(0, lastIndex);
  // Return the new string with the last occurrence of the substring replaced
  return begin + replace;
};

/**
 * @namespace D1_Core
 */


/**
 * Function to calculate the sum of merged numeric values in an array of strings.
 *
 * @memberof D1_Core
 *
 * @example
 * const dataLines = ['Hello 123 world 456', 'Another 789 line 012'];
 * const sum = Day1.calculateSumOfMergedNumerics(dataLines, true, false);
 * console.log(sum); // 123456 + 789012 = 912468
 *
 * @param {string[]} dataLines - The array of strings.
 * @param {boolean} numbersOnly - Whether to only consider numbers.
 * @param {boolean} isLoggingEnabled - Whether to enable logging.
 * @returns {number} The sum of the merged numeric values.
 * @throws {Error} If dataLines is not a non-empty array.
 */
const calculateSumOfMergedNumerics = (dataLines, numbersOnly, isLoggingEnabled) => {
  // Check if the input is a non-empty array
  if (!Array.isArray(dataLines) || dataLines.length === 0) {
    // If not, throw an error
    throw new Error('Invalid input: dataLines must be a non-empty array');
  }

  // Initialize the total sum to 0
  let totalSum = 0;

  // Loop over each line in the dataLines array
  for (let line of dataLines) {
    // Find the first numeric word in the line
    const initialWord = findNumericWord(line, 'forward', numbersOnly);
    // Find the last numeric word in the line
    const finalWord = findNumericWord(line, 'backward', numbersOnly);
    // Merge the two numeric words and convert them to a number
    const number = parseInt(`${initialWord.number}${finalWord.number}`, 10);
    // Add the number to the total sum
    totalSum += number;

    // If logging is enabled, log the line and the number
    if (isLoggingEnabled) {
      // Get the initial word value
      const initialWordValue = initialWord.type === 'word' ? initialWord.word : initialWord.number;
      // Get the final word value
      const finalWordValue = finalWord.type === 'word' ? finalWord.word : finalWord.number;
      // Highlight the initial word in the line
      line = line.replace(initialWordValue, `${chalk.redBright(initialWordValue)}`);
      // Highlight the final word in the line
      line = chalk.grey(replaceLastOccurrence(line, finalWordValue, `${chalk.cyanBright(finalWordValue)}`));
      // Log the line and the number
      console.log(line, number);
    }
  }

  // Return the total sum
  return totalSum;
};

/* MAIN EXECUTION
============================================================================= */

// Load the data file and measure the time it takes
const [dataLines, readTime] = getRuntime(loadTextFile, `${process.cwd()}/src/days/${DAY}/data.txt`);

// Get the size of the data file and measure the time it takes
const [dataSize, dataSizeTime] = getRuntime(getFileSize, `${process.cwd()}/src/days/${DAY}/data.txt`);

// Load the part 1 and part 2 example data files
const [linesPart1] = getRuntime(loadTextFile, `${process.cwd()}/src/days/${DAY}/part1-data.txt`);
const [linesPart2] = getRuntime(loadTextFile, `${process.cwd()}/src/days/${DAY}/part2-data.txt`);

// Get the size of the solution file and measure the time it takes
const [solutionSize, solutionSizeTime] = getRuntime(getFileSize, `${process.cwd()}/src/days/${DAY}/solution.js`);

// Calculate the solution for part 1 and measure the time it takes
const [part1Solution, part1Time] = getRuntime(calculateSumOfMergedNumerics, dataLines, true, false);

// Calculate the solution for part 2 and measure the time it takes
const [part2Solution, part2Time] = getRuntime(calculateSumOfMergedNumerics, dataLines, false, false);

// Calculate the total time
const totalTime = Math.round(readTime + solutionSizeTime + dataSizeTime + part1Time + part2Time);

/* OUTPUT LOGS
============================================================================= */

console.log('\n🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄\n');

// Print the day number
log(`${chalk.blue('Day:')} ${chalk.green(DAY[DAY.length - 1])}\n`);

// Print the solutions for part 1 and part 2
log(`${chalk.blue('Part-1:')} ${chalk.green(part1Solution)}`);
log(`${chalk.blue('Part-2:')} ${chalk.green(part2Solution)}\n`);

// Print the sizes of the script and data files
console.log(`${chalk.blue('Script:')} ${chalk.green(`${solutionSize}kb`)}`);
console.log(`${chalk.blue('Data:')} ${chalk.green(`${dataSize}kb\n`)}`);

// Print the total runtime
console.log(`${chalk.blue('Runtime:')} ${chalk.green(`${totalTime}ms`)}\n`);

console.log('🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁\n');

// Print the header for the part 1 example
console.log('Part 1\n');
const [part1SolutionExample, part1ExampleTime] = getRuntime(calculateSumOfMergedNumerics, linesPart1, true, true);
console.log('');
console.log(`${chalk.blue('Result:')} ${chalk.green(part1SolutionExample)}`);
console.log(`${chalk.blue('Runtime:')} ${chalk.green(`${part1ExampleTime}ms`)}\n`);

// Print the header for the part 2 example
console.log('Part 2\n');
const [part2SolutionExample, part2ExampleTime] = getRuntime(calculateSumOfMergedNumerics, linesPart2, false, true);
console.log('');
console.log(`${chalk.blue('Result:')} ${chalk.green(part2SolutionExample)}`);
console.log(`${chalk.blue('Runtime:')} ${chalk.green(`${part2ExampleTime}ms`)}\n`);
console.log('🎅🎅🎅🎅🎅🎅🎅🎅🎅🎅\n');
