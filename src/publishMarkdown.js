import fs from 'fs';
import path from 'path';

import nodePlop from 'node-plop';
const plop = await nodePlop(`./plopfile.js`);

const directory = 'docs/generated';

export default async (input) => {
  // get a generator by name
  const basicAdd = plop.getGenerator('controller');

  await fs.rm(path.join(directory), { recursive: true, force: true }, (err) => {
    if (err) throw err;
  });

  await fs.mkdir(path.join(directory), (err) => {
    if (err) throw err;
  });

  // write to file
  input.tables.forEach(async (table) => {
    basicAdd.runActions({ name: table.table }).then(function (results) {
      if (results.failures.length > 0) {
        results.failures.forEach((failure) => {
          console.error(failure.error);
        });
      } else {
        console.log(
          'Success!',
          results.changes.map((change) => change.path).join(',')
        );
      }
    });
  });
  console.log(input.tables[0]);
};
