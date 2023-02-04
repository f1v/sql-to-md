import fs from 'fs';
import path from 'path';

import nodePlop from 'node-plop';
const plop = await nodePlop(`./plopfile.js`);

const directory = 'docs/generated';

export default async (input) => {
  // get a generator by name
  const basicAdd = plop.getGenerator('controller');

  fs.rmSync(path.join(directory), { recursive: true, force: true }, (err) => {
    if (err) throw `Error deleting directory: ${err}`;
    console.log('Deleted directory: ' + directory);

    fs.mkdirSync(path.join(directory), (err) => {
      if (err) throw `Error making directory: ${err}`;
      console.log('Created directory: ' + directory);
    });
  });

  // write to file
  input.tables.forEach(async (table) => {
    await basicAdd.runActions({ name: table.table }).then(function (results) {
      if (results.failures.length > 0) {
        results.failures.forEach((failure) => {
          console.error(failure.error);
        });
      }
    });
  });

  console.log(input.tables[0]);
  console.log('Success!', input.tables.length, 'files generated');
};
