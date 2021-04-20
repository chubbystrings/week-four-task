/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs'
import dns, { MxRecord, SrvRecord, SoaRecord, NaptrRecord, AnyRecord }  from 'dns'
import path from 'path'
import readline from 'readline'

interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;

}

interface validEmails {str: string; isValid: boolean;}

const validateDns = async(domain: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err: ErrnoException | null, addresses: MxRecord[]) => {
        if(err) {
          resolve(false);
        }
        else if (addresses && addresses.length === 0) {
          resolve(false)
        }
        resolve(true);
      })
    })
}

const checkValidEmail =  (email: string): boolean  => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
}

const validateMail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(String(email).toLowerCase());
}

function syncPaths(str: string): string {
  const dirPath = path.resolve(__dirname, '..', str)
  return dirPath
}

// const resolvedPath = path.resolve(__dirname,  '../fixtures/inputs/small-sample.csv')

// const emailArray = fs.readFileSync(resolvedPath, 'utf-8');
// let emailData = JSON.parse(JSON.stringify(emailArray)).split('\n');
// emailData = emailData.filter((e: string) => e.includes('@') && checkValidEmail(e));
// // console.log(emailData);

const validateEmail = async (emailArr: string[], outputFile: string): Promise<void> => {

  let allEmails: Promise<validEmails>[] = emailArr.map(async (str: string): Promise<validEmails> => {

    const stringMail: string = str.split('@')[1];

    const isValid: boolean = await validateDns(stringMail);
    return {str, isValid};

  });

  const allNewEmails:  Array<validEmails> = await Promise.all(allEmails);
  const validEmails: Array<validEmails> = allNewEmails.filter(email => email.isValid);

  // console.log(validEmails);
  const result: string[] = validEmails.map((em) => em.str);
  const csv: string = result.join('\n');
  fs.writeFileSync(outputFile, csv);
}




function validateEmailAddresses(inputPath: string[], outputFile: string): void {
  // inputPath.forEach( async (newPath) => {
  //   const resolvedPath: string =  syncPaths(newPath)
  //   const emailArray: string = fs.readFileSync(resolvedPath, 'utf-8');
  //   let emailData: string[] = JSON.parse(JSON.stringify(emailArray)).split('\n');
  //   emailData = emailData.filter((e: string) => e.includes('@') && checkValidEmail(e));
  //   const outputPath: string =  syncPaths(outputFile)
  //   await validateEmail(emailData, outputPath)
  // })

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
          dns.resolve(domain, 'MX', (err: ErrnoException | null, addresses:  string[] | MxRecord[] | NaptrRecord[] | SoaRecord | SrvRecord[] | AnyRecord[]): void => {
            if (err) {
              console.log('Error');
            } else if (addresses && Array.isArray(addresses) && addresses.length > 0) {
              // console.log('Mail as valid.');
              fs.appendFileSync(outputFile, `${JSON.stringify(value)}\n`);
            }
          });
        }
      }
    });
  });
}

export default validateEmailAddresses;
