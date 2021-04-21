/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

import fs from 'fs';
import path from 'path';

interface frequency {
  [propName: string]: number;
}

interface resultJSON {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: frequency;
}

const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
};

function convertToOutput(path: string): resultJSON {
  const emails: string = JSON.parse(
    JSON.stringify(fs.readFileSync(path, 'utf-8')),
  );
  let emailArr: string[] = emails.split('\n');
  emailArr = emailArr.filter((e) => e.includes('@'));
  let count = 0;
  let validEmails: string[] = emailArr.filter((e: string) => {
    count += 1;
    return validateEmail(e);
  });

  const validDomains: string[] = [];

  validEmails.forEach((el) => {
    const domain = el.split('@')[1];
    if (!validDomains.includes(domain)) {
      validDomains.push(domain);
    }
  });

  validEmails = validEmails.map((e) => e.split('@')[1]);
  const categories: frequency = validEmails.reduce(
    (tally: frequency, item: string) => {
      tally[item] = (tally[item] || 0) + 1;
      return tally;
    },
    {},
  );

  const result: resultJSON = {
    'valid-domains': validDomains,
    totalEmailsParsed: count,
    totalValidEmails: validEmails.length,
    categories,
  };
  // let output= JSON.stringify(result, null, 2)
  // console.log(output);
  return JSON.parse(JSON.stringify(result));
}

function syncPaths(str: string): string {
  const dirPath = path.resolve(__dirname, '..', str);
  return dirPath;
}

function analyseFiles(inputPaths: string[], outputPath: string): void {
  const outputSynced: string = syncPaths(outputPath);
  let result = {};
  inputPaths.forEach((path: string) => {
    const resolvedPath: string = syncPaths(path);
    result = convertToOutput(resolvedPath);
  });
  const json: string = JSON.stringify(result, null, 2);
  fs.writeFileSync(outputSynced, json);
}

export default analyseFiles;
