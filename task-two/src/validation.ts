/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import dns, {
  MxRecord,
  SrvRecord,
  SoaRecord,
  NaptrRecord,
  AnyRecord,
} from 'dns';
import path from 'path';
import readline from 'readline';

interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

interface validEmails {
  str: string;
  isValid: boolean;
}

const validateMail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
};

function validateEmailAddresses(inputPath: string[], outputFile: string): void {
  inputPath.forEach((file) => {
    const filePath: string = path.join(__dirname, '..', file);
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, 'utf8'),
      output: process.stdout,
      terminal: false,
    });
    rl.on('line', (line) => {
      const value = JSON.parse(JSON.stringify(line));
      if (value !== undefined) {
        if (validateMail(value)) {
          const domain: string = value.split('@')[1];
          dns.resolve(
            domain,
            'MX',
            (
              err: ErrnoException | null,
              addresses:
                | string[]
                | MxRecord[]
                | NaptrRecord[]
                | SoaRecord
                | SrvRecord[]
                | AnyRecord[],
            ): void => {
              if (err) {
                // console.log('Error');
              } else if (
                addresses &&
                Array.isArray(addresses) &&
                addresses.length > 0
              ) {
                // console.log('Mail as valid.');
                fs.appendFileSync(outputFile, `${JSON.stringify(value)}\n`);
              }
            },
          );
        }
      }
    });
  });
}

export default validateEmailAddresses;
